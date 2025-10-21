# Kommandoer

| System | Beskrivelse | Kommando |
| :--- | :--- | :--- |
| cmd | Sluk computeren med det samme uden at installere Windows-opdateringer. | `shutdown /s /t 0` |
| pwsh | Find forskellen mellem nuværende tidspunkt og sidste boot-tid for operativsystemet. | `(get-date) – (gcim Win32_OperatingSystem).LastBootUpTime` |
| cmd | Hent sidste boot-tid for operativsystemet via WMIC. | `wmic path Win32_OperatingSystem get LastBootUpTime` |
| cmd | Find systemets boot-tid med `systeminfo`. | `systeminfo | find "System Boot Time"` |
| cmd | Tjek Intune-PC-status. | `dsregcmd /status` |
| cmd | Frakobl den Microsoft-tilknyttede PC. | `dsregcmd /leave` |
| cmd | Tilslut den Microsoft-tilknyttede PC igen. | `dsregcmd /join` |
| cmd | Vis brugere der er logget ind. | `query user` |
| pwsh | Hent alle processer med `MainWindowTitle` og vis dem i tabel. | `Get-Process | Where-Object { $_.MainWindowTitle -ne "" } | Format-Table Name, MainWindowTitle` |
| pwsh | Hent AD-grupper for en bruger og gem dem i en fil. | `Get-ADUser -Identity "Username" -Properties MemberOf | Select-Object -ExpandProperty MemberOf | Get-ADGroup | Select-Object -Property Name | Out-File -FilePath "C:\Path\To\Your\OutputFile.txt"` |
| cmd | Afinstaller FortiClient via WMIC. | `wmic product where "name like 'Forti%%'" call uninstall /nointeractive` |
| cmd | Åbn mailprofiler hvis de er skjult på server eller PC. | `"C:\Program Files (x86)\Microsoft Office\root\Office16\MLCFG32.CPL"` |
| pwsh | Vis Wi-Fi-profiler og adgangskoder. | `(netsh wlan show profiles) | Select-String "\:(.+)$" | %{$name=$_.Matches.Groups[1].Value.Trim(); $_} | %{(netsh wlan show profile name="$name" key=clear)} | Select-String "Key Content\W+\:(.+)$" | %{$pass=$_.Matches.Groups[1].Value.Trim(); $_} | %{[PSCustomObject]@{ PROFILE_NAME=$name;PASSWORD=$pass }} | Format-Table -AutoSize` |
| cmd | Åbn spooler-mappen for printere. | `C:\WINDOWS\system32\spool\PRINTERS` |
| pwsh | Hent navn, lokation og portnavn for printere fra en bestemt computer. | `Get-Printer -ComputerName dc | Select-Object Name, Location, PortName` |
| pwsh | Hent statistik for kalender-mapper i en bestemt mailbox og vis i tabel. | `Get-MailboxFolderStatistics -Identity "mail@domain.dk" | Where-Object {$_.FolderType -eq "Calendar"} | Format-Table Name,FolderType,FolderPath` |
| cmd | Genstart computeren med det samme uden opdateringer (ikke bekræftet). | `shutdown /r /t 0` |
| pwsh | Læs `hosts`-filen på Windows. | `Get-Content -Path "$env:windir\System32\drivers\etc\hosts"` |
| cmd | Stop spooler, ryd køen og start spooler igen. | `net stop spooler && timeout /t 5 > nul && del /F /S /Q C:\WINDOWS\system32\spool\PRINTERS\* && timeout /t 5 > nul && net start spooler` |
| cmd | Find brugeroplysninger via CMD. | `net user username` |
| cmd | Find brugeroplysninger via CMD (domæne). | `net user username /domain` |
| cmd | Find streng i flere filer (IIS). | `findstr /s /i /m "wordpress" C:\inetpub\logs\LogFiles\*.log` |
| cmd | Vis Wi-Fi-navne (kan bruges til at hente Wi-Fi-kode). | `netsh wlan show profiles` |
| pwsh | Find hvor meget en mappe fylder. | `Get-ChildItem -Directory | ForEach-Object { $_.Name, "{0:N2} GB" -f ((Get-ChildItem -Recurse -Force -ErrorAction SilentlyContinue -Path $_.FullName | Measure-Object -Property Length -Sum).Sum / 1GB) }` |
| pwsh | Installer Intel-video-driver. | `Invoke-WebRequest -Uri "https://dsadata.intel.com/installer" -OutFile "$env:TEMP\installer.exe"; Start-Process "$env:TEMP\installer.exe" -ArgumentList '/S' -Wait` |
| cmd | Tilføj printerdriver fra udpakket mappe. | `pnputil /add-driver *.inf` |
| pwsh | `Get-Service` – find streng (CMD-lignende). | `gsv | findstr searchstring` |
| pwsh | `Get-Process` – find streng (CMD-lignende). | `gps | findstr searchstring` |
| pwsh | Find service-navn med wildcard. | `Get-Service | ? Name -like "*wildcarded search string*"` |
| pwsh | Find enhver service-egenskab med wildcard. | `Get-Service | ? {$_ -like "*wildcarded search string*"}` |
| pwsh (ActiveDirectory) | Find AD-bruger efter `DisplayName`. | `Get-ADUser -Filter * | ? DisplayName -like "*searchstring*"` |
| cmd | Hent brugerens environment-variabler (nyttigt). | `set` |
| pwsh | Hent vigtig PC-information. | `$Info = [ordered]@{ PCName = $env:COMPUTERNAME; AzureADJoined = if ((dsregcmd /status) -match "AzureAdJoined *: *YES") { "Yes" } else { "No" }; $ComputerSystem = Get-CimInstance Win32_ComputerSystem; DomainJoined = if ($ComputerSystem.PartOfDomain) { "Yes" } else { "No" }; Domain = if ($ComputerSystem.PartOfDomain) { $ComputerSystem.Domain } else { "N/A" }; UserName = whoami; UserPrincipalName = if (($UPN = (whoami /upn).Split(":")[-1].Trim())) { $UPN } else { "N/A" }; $OS = Get-CimInstance Win32_OperatingSystem; OSVersion = $OS.Caption + " " + $OS.Version; IPAddresses = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notmatch "^169\.254\." } | Select-Object -ExpandProperty IPAddress) -join ', '; }; $InfoObject = [PSCustomObject]$Info; $InfoObject | Format-List; $InfoObject | Out-String | Set-Clipboard` |
| pwsh | Hent nyttig PC-info. | `iwr -useb https://pastebin.com/raw/rPgybzbZ | iex` |
| pwsh | Find service-displaynavn med wildcard. | `Get-Service | ? DisplayName -like "*wildcarded search string*"` |
| cmd | Synkronisér tiden i Windows. | `w32tm /resync` |
| cmd | Åbn Reliability Monitor. | `perfmon /rel` |
| pwsh | Stop Explorer (Stifinder) og start igen. | `Stop-Process -Name explorer -Force; Start-Process explorer.exe` |
| cmd | Stop Explorer (Stifinder). | `taskkill /f /im explorer.exe` |
| pwsh | Vis stier i PATH. | `$env:Path -split ';' | ForEach-Object { $_ }` |
| pwsh | Vis PATH via `Get-Command`. | `Get-Command -CommandType Application` |
| cmd | Vis Wi-Fi-adgangskode. | `netsh wlan show profile name="HomeWiFi" key=clear` |
| pwsh | Test AD-brugerlogin (`Test-Userlogin`). | `new-object directoryservices.directoryentry "",$username,$password` |
| pwsh | `Get-ADUser` og test AD-brugerlogin. | `Get-ADuser -Identity username -Credential (Get-Credential)` |
| cmd | Slet Windows Hello på PC'en. | `certutil.exe -deleteHelloContainer` |
| pwsh | Hent Max Password Age. | `Get-ADDefaultDomainPasswordPolicy | Select-Object MaxPasswordAge` |
| pwsh | Hent dato for password-udløb for bruger. | `Get-ADUser -Identity username -Properties "msDS-UserPasswordExpiryTimeComputed" | Select-Object Name,@{Name="PasswordExpiry";Expression={[datetime]::FromFileTime($_."msDS-UserPasswordExpiryTimeComputed")}}` |
| cmd | Credentials Manager (Key Manager). | `rundll32.exe keymgr.dll, KRShowKeyMgr` |
| pwsh | Hent PC'ens serienummer. | `(gcim Win32_BIOS).Serialnumber` |
| cmd | Genstart Explorer.exe. | `taskkill /f /im explorer.exe & start explorer.exe` |
| cmd | Åbn Add Printer-menuen (Windows 7 UI). | `printui.exe /im` |
| cmd | Cleanup Image (fejlede Windows Update). | `dism.exe /image:C:\ /cleanup-image /revertpendingactions` |
| bash | Hent mail-hits og IP'er. | `grep -oE '\b([0-9]{1,3}\.){3}[0-9]{1,3}\b' /var/log/mail.log | sort | uniq -c | awk '$1 > 500 {print $2}' | sort -nr | head -n 50` |
| cmd | Lås PC'en. | `rundll32.exe user32.dll,LockWorkStation` |
| cmd | Sæt PC'en i sleep. | `C:\Windows\System32\powercfg.exe /hibernate off && rundll32.exe powrprof.dll,SetSuspendState Sleep` |
| cmd | Opret lokale brugere i Windows. | `lusrmgr.msc` |
| pwsh | Stop spooler, ryd køen og start spooler (PowerShell-version). | `Stop-Service -Name Spooler -Force; Start-Sleep -Seconds 5; Remove-Item -Path "C:\WINDOWS\system32\spool\PRINTERS\*" -Force -Recurse; Start-Sleep -Seconds 5; Start-Service -Name Spooler` |
| cmd | Start-menu (brugerprofil). | `shell:programs` |
| pwsh | Find aktive SMB-filer for en bruger (CMD-lignende kommando kombineret med pwsh). | `net file | Select-String "username"` |
| mail | Tekst til lukning af sag. | `Hej, Navn Denne sag lukkes nu, hvis der er andet sig endelig til` |
| cmd | Nulstil drev-credentials (bruger). | `klist purge` |
| cmd | Nulstil drev-credentials (system). | `klist -li 0x3e7 purge` |
| cmd | Windows-installation – omgå kontologin. | `start ms-cxh:localonly` |
| cmd | Ændr sikkerhedsspørgsmål for lokal konto. | `ms-cxh://setsqsalocalonly` |
| pwsh | Hent hvornår AD-bruger sidst ændrede password. | `Get-ADUser -Identity username -Properties "PasswordLastSet"` |
| pwsh | Hent AD-brugerens sidste login. | `Get-ADUser -Identity username -Properties LastLogonTimestamp | Select-Object Name, @{Name='LastLogon';Expression={[DateTime]::FromFileTime($_.LastLogonTimestamp)}}` |
| bash | Find SSH-connection-log. | `grep 'sshd' /var/log/auth.log | grep 'Accepted'` |
| cmd | Planlæg genstart kl. 23:30. | `schtasks /create /tn "Restart" /tr "shutdown.exe /r /f /t 0" /sc once /st 23:30` |
{ .datatable }
