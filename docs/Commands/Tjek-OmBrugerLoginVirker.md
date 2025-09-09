
# Tjek om bruger login virker

Denne side er scripts der kan bruges til at verificere om 

## Simple commands

Simpel Command, kig efter sidste login, refresh manuelt  

```
Get-ADUser -Identity <USERNAME> -Properties LastLogonDate | 
    Select-Object Name, SamAccountName, LastLogonDate
```


# Monitoring commands

Utestet - Complex command, skulle gerne refresh automatisk, så du får svar hvis det virkede
```
<# 
    Purpose: Watch for a user's next AD logon in near real-time
    How it works: Queries each DC's non-replicated 'lastLogon' attribute and looks for a newer value.
    Requirements: RSAT ActiveDirectory module
#>

#--- Tunables ---
$PollIntervalSeconds = 7           # 5–12 seconds recommended
$MaxWatchMinutes     = 15          # stop after this time (support-session friendly)

#--- Helpers ---
function Get-TrueLastLogon {
    param(
        [Parameter(Mandatory)]
        [string]$Identity,

        [Parameter(Mandatory)]
        [Microsoft.ActiveDirectory.Management.ADDomainController[]]$DomainControllers
    )

    $results = foreach ($dc in $DomainControllers) {
        try {
            $u = Get-ADUser -Identity $Identity -Server $dc.HostName -Properties lastLogon -ErrorAction Stop
            $ll = if ($u.lastLogon -and $u.lastLogon -ne 0) { [DateTime]::FromFileTime($u.lastLogon) } else { $null }
            [pscustomobject]@{
                DC        = $dc.HostName
                LastLogon = $ll
            }
        } catch {
            # Swallow per-DC lookup errors; continue with others
            [pscustomobject]@{
                DC        = $dc.HostName
                LastLogon = $null
            }
        }
    }

    # Return the most recent non-null lastLogon with the DC it came from
    $results |
        Where-Object { $_.LastLogon } |
        Sort-Object LastLogon -Descending |
        Select-Object -First 1
}

#--- Main ---
try { Import-Module ActiveDirectory -ErrorAction Stop } catch {
    Write-Host "ActiveDirectory module not found. Install RSAT (Active Directory) and try again." -ForegroundColor Red
    return
}

$UserId = Read-Host -Prompt 'Enter username (sAMAccountName or UPN)'
if ([string]::IsNullOrWhiteSpace($UserId)) {
    Write-Host "No username provided. Exiting." -ForegroundColor Yellow
    return
}

# Validate user and get display info up-front
try {
    $userObj = Get-ADUser -Identity $UserId -Properties DisplayName,SamAccountName -ErrorAction Stop
} catch {
    Write-Host "User '$UserId' not found in AD." -ForegroundColor Red
    return
}

$display = if ($userObj.DisplayName) { $userObj.DisplayName } else { $userObj.SamAccountName }
Write-Host "Monitoring logon for: $display ($($userObj.SamAccountName))" -ForegroundColor Cyan

# Get DCs once
try {
    $dcs = Get-ADDomainController -Filter * -ErrorAction Stop
} catch {
    Write-Host "Could not enumerate Domain Controllers." -ForegroundColor Red
    return
}
if (-not $dcs) {
    Write-Host "No Domain Controllers found." -ForegroundColor Red
    return
}

# Establish baseline lastLogon (may be $null if user never logged on)
$baselineRecord = Get-TrueLastLogon -Identity $userObj.SamAccountName -DomainControllers $dcs
$baselineTime   = $baselineRecord.LastLogon
$baselineDC     = $baselineRecord.DC

if ($baselineTime) {
    Write-Host ("Current last logon:  {0} (DC: {1})" -f $baselineTime, $baselineDC) -ForegroundColor DarkGray
} else {
    Write-Host "Current last logon:  <none recorded>" -ForegroundColor DarkGray
}

$deadline = (Get-Date).AddMinutes($MaxWatchMinutes)
Write-Host ("Watching for a new logon (polling every {0}s, timeout {1}m). Press Ctrl+C to stop..." -f $PollIntervalSeconds, $MaxWatchMinutes) -ForegroundColor Yellow

# Watch loop
while ($true) {
    if ((Get-Date) -ge $deadline) {
        Write-Host "No new logon detected within $MaxWatchMinutes minute(s). Exiting." -ForegroundColor Yellow
        break
    }

    $current = Get-TrueLastLogon -Identity $userObj.SamAccountName -DomainControllers $dcs

    if ($current -and $current.LastLogon) {
        # New logon if there's no baseline or if timestamp increased
        if (-not $baselineTime -or ($current.LastLogon -gt $baselineTime)) {
            Write-Host ""
            Write-Host ("SUCCESS: Logon detected for {0}" -f $display) -ForegroundColor Green
            Write-Host ("Time: {0}" -f $current.LastLogon) -ForegroundColor Green
            Write-Host ("DC:   {0}" -f $current.DC) -ForegroundColor Green
            break
        }
    }

    Start-Sleep -Seconds $PollIntervalSeconds
}

```
