# Commands

| System | Description | Command |
| :--- | :--- | :--- |
| cmd | Shutdown the computer immediately without updating Windows. | `shutdown /s /t 0` |
| pwsh | Get the difference between the current date and the last boot up time of the operating system. | `(get-date) – (gcim Win32_OperatingSystem).LastBootUpTime` |
| cmd | Retrieve the last boot up time of the operating system using WMIC. | `wmic path Win32_OperatingSystem get LastBootUpTime` |
| cmd | Find the system boot time using the systeminfo command. | `systeminfo \| find “System Boot Time”` |
| cmd | Check the Intune PC status. | `dsregcmd /status` |
| cmd | Leave the Microsoft signed in PC. | `dsregcmd /leave` |
| cmd | Join the Microsoft signed in PC. | `dsregcmd /join` |
| cmd | Display logged-in users. | `query user` |
| pwsh | Get all processes with a main window title and format them in a table. | `Get-Process \| Where-Object { $_.MainWindowTitle -ne "" } \| Format-Table Name, MainWindowTitle` |
| pwsh | Get AD groups for a user and save them to a file. | `Get-ADUser -Identity "Username" -Properties MemberOf \| Select-Object -ExpandProperty MemberOf \| Get-ADGroup \| Select-Object -Property Name \| Out-File -FilePath "C:\Path\To\Your\OutputFile.txt"` |
| cmd | Uninstall FortiClient using WMIC. | `wmic product where "name like 'Forti%%'" call uninstall /nointeractive` |
| cmd | Open mail profiles if they are hidden on the server or PC. | `"C:\Program Files (x86)\Microsoft Office\root\Office16\MLCFG32.CPL"` |
| pwsh | Retrieve and display Wi-Fi profile names and passwords. | `(netsh wlan show profiles) \| Select-String "\:(.+)$" \| %{$name=$_.Matches.Groups[1].Value.Trim(); $_} \| %{(netsh wlan show profile name="$name" key=clear)} \| Select-String "Key Content\W+\:(.+)$" \| %{$pass=$_.Matches.Groups[1].Value.Trim(); $_} \| %{[PSCustomObject]@{ PROFILE_NAME=$name;PASSWORD=$pass }} \| Format-Table -AutoSize` |
| cmd | Open the spool printers folder. | `C:\WINDOWS\system32\spool\PRINTERS` |
| pwsh | Get the name, location, and port name of printers from a specific computer. | `Get-Printer -ComputerName dc \| Select-Object Name, Location, PortName` |
| pwsh | Get statistics for calendar folders in a specific mailbox and format the output in a table. | `Get-MailboxFolderStatistics -Identity "mail@domain.dk" \| Where-Object {$_.FolderType -eq "Calendar"} \| Format-Table Name,FolderType,FolderPath` |
| cmd | Restart the computer immediately without updating Windows. This has not been tested to confirm if it avoids updates. | `shutdown /r /t 0` |
| pwsh | Read Hosts file on Windows | `Get-Content -Path "$env:windir\System32\drivers\etc\hosts"` |
| cmd | Stop Spooler, Slet Spooler, Start spooler til Print | `net stop spooler && timeout /t 5 > nul && del /F /S /Q C:\WINDOWS\system32\spool\PRINTERS\* && timeout /t 5 > nul && net start spooler` |
| cmd | Find user details via CMD | `net user username` |
| cmd | Find user details via CMD (Domain) | `net user username /domain` |
| cmd | Find string i flere filer (IIS) | `findstr /s /i /m "wordpress" C:\inetpub\logs\LogFiles\*.log` |
| cmd | Vis Wi-Fi Navne (Kan bruges til at hente Wi-Fi Kode) | `netsh wlan show profiles` |
| pwsh | Find hvor meget en mappe fylder | `Get-ChildItem -Directory \| ForEach-Object { $_.Name, "{0:N2} GB" -f ((Get-ChildItem -Recurse -Force -ErrorAction SilentlyContinue -Path $_.FullName \| Measure-Object -Property Length -Sum).Sum / 1GB) }` |
| pwsh | Install Intel Video Driver | `Invoke-WebRequest -Uri "https://dsadata.intel.com/installer" -OutFile "$env:TEMP\installer.exe"; Start-Process "$env:TEMP\installer.exe" -ArgumentList '/S' -Wait` |
| cmd | Add Printer driver from unpacked folder | `pnputil /add-driver *.inf` |
| pwsh | Get-Service - Find String (CMD like) | `gsv \| findstr searchstring` |
| pwsh | Get-Process - Find String (CMD like) | `gps \| findstr searchstring` |
| pwsh | Get-Service Find name using wildcard | `Get-Service \| ? Name -like "*wildcarded search string*"` |
| pwsh | Get-Service Find any property using wildcard | `Get-Service \| ? {$_ -like "*wildcarded search string*"}` |
| pwsh (ActiveDirectory) | Get-ADUser Search for Display Name | `Get-ADUser -Filter * \| ? DisplayName -like "*searchstring*"` |
| cmd | Henter bruger envirement variables (Useful) | `set` |
| pwsh | Get Importent PC Information | `$Info = [ordered]@{ PCName = $env:COMPUTERNAME; AzureADJoined = if ((dsregcmd /status) -match "AzureAdJoined *: *YES") { "Yes" } else { "No" }; $ComputerSystem = Get-CimInstance Win32_ComputerSystem; DomainJoined = if ($ComputerSystem.PartOfDomain) { "Yes" } else { "No" }; Domain = if ($ComputerSystem.PartOfDomain) { $ComputerSystem.Domain } else { "N/A" }; UserName = whoami; UserPrincipalName = if (($UPN = (whoami /upn).Split(":")[-1].Trim())) { $UPN } else { "N/A" }; $OS = Get-CimInstance Win32_OperatingSystem; OSVersion = $OS.Caption + " " + $OS.Version; IPAddresses = (Get-NetIPAddress -AddressFamily IPv4 \| Where-Object { $_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notmatch "^169\.254\." } \| Select-Object -ExpandProperty IPAddress) -join ', '; }; $InfoObject = [PSCustomObject]$Info; $InfoObject \| Format-List; $InfoObject \| Out-String \| Set-Clipboard` |
| pwsh | Find Nyttigt PC Information | `iwr -useb https://pastebin.com/raw/rPgybzbZ \| iex` |
| pwsh | Get-Service Find display name using wildcard | `Get-Service \| ? DisplayName -like "*wildcarded search string*"` |
| cmd | Sync time on windows | `w32tm /resync` |
| cmd | Reliability Monitor | `perfmon /rel` |
| pwsh | Stop Explorer (Stifinder) og start explorer igen | `Stop-Process -Name explorer -Force; Start-Process explorer.exe` |
| cmd | Stop Explorer (Stifinder) | `taskkill /f /im explorer.exe` |
| pwsh | Vis stier i PATH | `$env:Path -split ';' \| ForEach-Object { $_ }` |
| pwsh | Vis PATH via Get-Command | `Get-Command -CommandType Application` |
| cmd | Show Wi-Fi Password | `netsh wlan show profile name="HomeWiFi" key=clear` |
| pwsh | Test AD User Login (Test-Userlogin) | `new-object directoryservices.directoryentry "",$username,$password` |
| pwsh | Get-ADUser And Test AD User Login (Test-Userlogin) | `Get-ADuser -Identity username -Credential (Get-Credential)` |
| cmd | Slet Windows Hello på PC | `certutil.exe -deleteHelloContainer` |
| pwsh | Get Max Password Age | `Get-ADDefaultDomainPasswordPolicy \| Select-Object MaxPasswordAge` |
| pwsh | Get Password Expire Date for user | `Get-ADUser -Identity username -Properties "msDS-UserPasswordExpiryTimeComputed" \| Select-Object Name,@{Name="PasswordExpiry";Expression={[datetime]::FromFileTime($_."msDS-UserPasswordExpiryTimeComputed")}}` |
| cmd | Credentials Extended (Key Manager) | `rundll32.exe keymgr.dll, KRShowKeyMgr` |
| pwsh | Henter Serial Number på PC | `(gcim Win32_BIOS).Serialnumber` |
| cmd | Restart Explorer.exe | `taskkill /f /im explorer.exe & start explorer.exe` |
| cmd | Åben Add Printer menuen (Windows 7 UI) | `printui.exe /im` |
| cmd | Cleanup Image (Failed Windows Update) | `dism.exe /image:C:\ /cleanup-image /revertpendingactions` |
| bash | Hent Mail hits og IP'er | `grep -oE '\b([0-9]{1,3}\.){3}[0-9]{1,3}\b' /var/log/mail.log \| sort \| uniq -c \| awk '$1 > 500 {print $2}' \| sort -nr \| head -n 50` |
| cmd | Lås PC | `rundll32.exe user32.dll,LockWorkStation` |
| cmd | Sleep PC | `C:\Windows\System32\powercfg.exe /hibernate off && rundll32.exe powrprof.dll,SetSuspendState Sleep` |
| cmd | Create Local Users On Windows | `lusrmgr.msc` |
| pwsh | Stop Spooler, Slet Spooler, Start spooler til Print | `Stop-Service -Name Spooler -Force; Start-Sleep -Seconds 5; Remove-Item -Path "C:\WINDOWS\system32\spool\PRINTERS\*" -Force -Recurse; Start-Sleep -Seconds 5; Start-Service -Name Spooler` |
| cmd | Start Menu (User Profile) | `shell:programs` |
| pwsh | Find active SMB files for an user using cmd like command combined with pwsh | `net file \| Select-String "username"` |
| mail | Sagen lukkes | `Hej, Navn Denne sag lukkes nu, hvis der er andet sig endelig til` |
| cmd | Reset Drive Credentials (User) | `klist purge` |
| cmd | Reset Drive Credentials (System) | `klist -li 0x3e7 purge` |
| cmd | Windows Install - Bypass Account Sign in (log in) | `start ms-cxh:localonly` |
| cmd | Ændre lokal konto sikkerhedsspørgsmål | `ms-cxh://setsqsalocalonly` |
| pwsh | Get AD User Password Last Set | `Get-ADUser -Identity username -Properties "PasswordLastSet"` |
| pwsh | Get AD User Last Login | `Get-ADUser -Identity username -Properties LastLogonTimestamp \| Select-Object Name, @{Name='LastLogon';Expression={[DateTime]::FromFileTime($_.LastLogonTimestamp)}}` |
| bash | Find SSH Connection Log | `grep 'sshd' /var/log/auth.log \| grep 'Accepted'` |
| cmd | Genstart PC kl 23:30 | `schtasks /create /tn "Restart" /tr "shutdown.exe /r /f /t 0" /sc once /st 23:30` |
{: .datatable }
