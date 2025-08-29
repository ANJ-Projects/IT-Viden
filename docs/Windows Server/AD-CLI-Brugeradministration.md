
# Commands til at administerer AD brugere via CLI
*Benyttes f.eks til headless adgang til DC*

Kør i **Windows PowerShell** på en **Domain Controller** (eller med **RSAT/ActiveDirectory-modul**):  
*Bemærk at på DC'er er den allerede importeret*

```powershell
Import-Module ActiveDirectory
```

---

# Søg efter brugere (find users)

**Via navn (Name) – delvist match**

```powershell
$Name = Read-Host "Indtast navn (delvist tilladt)"
Write-Host "Søger: Name -like '*$Name*' ..."
Get-ADUser -Filter "Name -like '*$Name*'" -Properties DisplayName,SamAccountName,Mail |
  Select-Object DisplayName,SamAccountName,Mail |
  Sort-Object DisplayName | Format-Table -AutoSize
```

**Via e-mail (Mail)**

```powershell
$Mail = Read-Host "Indtast e-mail (fuld adresse)"
Write-Host "Søger: Mail -eq '$Mail' ..."
Get-ADUser -Filter "Mail -eq '$Mail'" -Properties DisplayName,SamAccountName,Mail |
  Select-Object DisplayName,SamAccountName,Mail | Format-Table -AutoSize
```

**Via brugernavn (sAMAccountName / username)**

```powershell
$User = Read-Host "Indtast brugernavn (sAMAccountName)"
Write-Host "Henter bruger: $User ..."
Get-ADUser -Identity $User -Properties DisplayName,SamAccountName,Mail |
  Select-Object DisplayName,SamAccountName,Mail | Format-Table -AutoSize
```

---

# Password & konto-info (password & account info)

**Sidst ændret (PasswordLastSet) + beregnet udløb (Expiry)**

```powershell
$User = Read-Host "Brugernavn"
$u = Get-ADUser -Identity $User -Properties PasswordLastSet,PasswordExpired,msDS-UserPasswordExpiryTimeComputed,DisplayName,SamAccountName,LastLogonDate
$expiry = if ($u."msDS-UserPasswordExpiryTimeComputed") { [datetime]::FromFileTime($u."msDS-UserPasswordExpiryTimeComputed") } else { $null }
[pscustomobject]@{
  DisplayName     = $u.DisplayName
  SamAccountName  = $u.SamAccountName
  PasswordExpired = $u.PasswordExpired
  PasswordLastSet = $u.PasswordLastSet
  PasswordExpiry  = $expiry
  LastLogonDate   = $u.LastLogonDate
} | Format-List
```

**Er konto låst (LockedOut) + lås op (Unlock)**

```powershell
$User = Read-Host "Brugernavn"
$u = Get-ADUser -Identity $User -Properties LockedOut
Write-Host ("LockedOut: {0}" -f $u.LockedOut)
if ($u.LockedOut) {
  $go = Read-Host "Tryk Enter for at låse op (Unlock-ADAccount), eller N for at afbryde"
  if ($go -notmatch '^(n|N)$') {
    Unlock-ADAccount -Identity $User -Confirm:$false
    Write-Host "OK: Konto låst op."
  } else { Write-Host "Annulleret." }
}
```

---

# Håndter udløbet password (User must change password at next logon)

**Sæt kravet (ChangePasswordAtLogon = True)**

```powershell
$User = Read-Host "Brugernavn"
Write-Host "Sætter 'User must change password at next logon' for $User (pwdLastSet=0)"
$go = Read-Host "Tryk Enter for at fortsætte, eller N for at afbryde"
if ($go -notmatch '^(n|N)$') {
  Set-ADUser -Identity $User -ChangePasswordAtLogon $true -Confirm:$false
  Write-Host "OK: Brugeren skal ændre password ved næste logon."
} else { Write-Host "Annulleret." }
```

**Fjern kravet igen (ChangePasswordAtLogon = False)**

```powershell
$User = Read-Host "Brugernavn"
$go = Read-Host "Tryk Enter for at fjerne kravet, eller N for at afbryde"
if ($go -notmatch '^(n|N)$') {
  Set-ADUser -Identity $User -ChangePasswordAtLogon $false -Confirm:$false
  Write-Host "OK: Kravet fjernet."
} else { Write-Host "Annulleret." }
```

> **Bemærk**: Hvis du i stedet skal ophæve udløb **uden** at tvinge ændring, kan du sætte “pwdLastSet” til nu:

```powershell
$User = Read-Host "Brugernavn"
$go = Read-Host "Tryk Enter for at sætte pwdLastSet=nu (ophæv udløb), eller N for at afbryde"
if ($go -notmatch '^(n|N)$') {
  Set-ADUser -Identity $User -Replace @{pwdLastSet = -1} -Confirm:$false
  Write-Host "OK: pwdLastSet sat til nu."
} else { Write-Host "Annulleret." }
```

---

# Reset password (klar tekst / plain text)

```powershell
$User = Read-Host "Brugernavn"
$pwPlain = Read-Host "Ny adgangskode (PLAIN tekst – konverteres ved kørsel)"
Write-Host "RESET PASSWORD for '$User' -> '$pwPlain'"
$go = Read-Host "Tryk Enter for at fortsætte, eller N for at afbryde"
if ($go -notmatch '^(n|N)$') {
  Set-ADAccountPassword -Identity $User -Reset -NewPassword (ConvertTo-SecureString $pwPlain -AsPlainText -Force) -Confirm:$false
  Write-Host "OK: Password nulstillet."
  $chg = Read-Host "Tving 'User must change password at next logon'? (Enter=Ja, N=Nej)"
  if ($chg -notmatch '^(n|N)$') {
    Set-ADUser -Identity $User -ChangePasswordAtLogon $true -Confirm:$false
    Write-Host "Sat: ChangePasswordAtLogon = True."
  }
} else { Write-Host "Annulleret." }
```

---

## Hurtige noter

* Kræver passende rettigheder og **ActiveDirectory**-modulet.
* **msDS-UserPasswordExpiryTimeComputed** vises kun når domænets password-policy gør det relevant.
* Undgå anførselstegn i input til `-Filter` for at slippe for quoting-bøvl.

Sig til, hvis du vil have en **mini-menu** (én enkelt paste der giver et simpelt valg-UI til alle handlinger).
