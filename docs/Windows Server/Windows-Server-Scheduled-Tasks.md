
# Windows Server - Scheduled Tasks (Opgavestyring)
*Hvis man ikke har kendskab til opgavestyring kan den virke meget uoverskueligt*

## Kør et powershell script

Åben "Kør" og skriv `taskschd.msc`

### Opret Task
Højreklik på en mappe > Create Task...

#### General
Find "Security options"

Tryk `Change User or Group...`  
Skriv `system`  *Bemærk: Hvis den skal have adgang til drev eller andet authentication skal den køres som en bruger, dette kræver ydeligere krav*  
Tryk på `OK`  

#### Actions


Gå under  
`Actions > New`

Vælg type  
Action: `Start a program`

Angiv parametre  
Program/script: `C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe`  
Add arguments (optional): `-ex bypass -file c:\Scripts\DitPowershellScript.ps1`  

Derefter tryk på videre og gem, dette skulle gerne være det vigtigste viden ift Scheduled Tasks og kørsel af et Powershell script  

*Hvis der er behov for at den køre periodisk kan det defineres under "Triggers"*

## Forklaring af tabs

### General

Felter  
- Name  
- Location  
- Author  
- Description  
- Security Options  

### Triggers

### Actions

### Conditions

### Settings
