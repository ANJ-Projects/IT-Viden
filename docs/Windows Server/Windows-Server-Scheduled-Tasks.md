
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

| Felt / gruppe | Formål |
|---------------|--------|
| **Name** | Opgavens visningsnavn. |
| **Location** | Sti i Task Scheduler-biblioteket. |
| **Author** | Brugerkontoen der oprettede opgaven. |
| **Description** | Valgfri beskrivelse – brug den til formål og ændringshistorik. |
| **Security options** | Vælg **Change User or Group…** for at angive konto; marker **Run with highest privileges** hvis scriptet kræver administrator-rettigheder. Marker **Hidden** hvis opgaven ikke skal vises i standardvisningen. |

---

### Triggers

| Element | Beskrivelse |
|---------|-------------|
| **New… / Edit… / Delete** | Opret, redigér eller fjern triggere. Flere triggere kan kombineres (OR-logik). |
| **Begin the task:** | Vælg hvornår opgaven skal starte. Typiske værdier:<br>• **On a schedule** (One time / Daily / Weekly / Monthly)<br>• **At log on**<br>• **At startup**<br>• **On workstation unlock**<br>• **On an event** (vælg log, kilde, event ID) |
| **One time / Daily / Weekly / Monthly** | Fastlæg dato(er) og klokkeslæt. Ved Weekly/Monthly kan du vælge ugedage eller specifikke dage (1.–31.) / det **Last** weekday-mønster. |
| **Advanced settings** | <br>• **Delay task for:** udskyder start x minutter/timer.<br>• **Repeat task every:** kør flere gange med bestemt interval, fx hver 15 minut i 8 timer.<br>• **Stop task at end of repetition duration**<br>• **Enabled** (sluk for at deaktivere triggeren uden at slette den). |

---

### Actions

> Du har allerede vist, hvordan man konfigurerer **Start a program** til PowerShell. Her er resten af felt-mulighederne:

| Element | Beskrivelse |
|---------|-------------|
| **Action** | <br>• **Start a program** (mest brugt)<br>• **Send an e-mail (deprecated)**<br>• **Display a message (deprecated)** |
| **Program/script** | Fuld sti til eksekverbar fil (.exe, .cmd, .bat, **powershell.exe** osv.). |
| **Add arguments (optional)** | Parametre til programmet, fx `-ExecutionPolicy Bypass -File C:\Scripts\Task.ps1`. |
| **Start in (optional)** | Arbejdsmappe hvis scriptet forventer relative stier. |

---

### Conditions

| Element | Beskrivelse |
|---------|-------------|
| **Idle** | <br>• **Start the task only if the computer is idle for:** x minutter.<br>• **Wait for idle for:** hvor længe Task Scheduler skal vente på idle-tilstand. |
| **Power** | <br>• **Start the task only if the computer is on AC power**<br>• **Stop if the computer switches to battery power**<br>• **Wake the computer to run this task** – sender Wake-on-LAN-signal til maskinen selv. |
| **Network** | **Start only if the following network connection is available:** vælg specifik adapter eller **Any connection**. |

---

### Settings

| Element | Beskrivelse |
|---------|-------------|
| **Allow task to be run on demand** | Gør det muligt at køre opgaven manuelt via **Run**. |
| **Run task as soon as possible after a scheduled start is missed** | F.eks. hvis serveren var slukket på planlagt tidspunkt. |
| **If the task fails, restart every:** | Angiv interval (minutter/timer) og **Attempt count**. |
| **Stop the task if it runs longer than:** | Hårdfører timeout. |
| **If the running task does not end when requested, force it to stop** | Sender `TerminateProcess`, svarer til `Stop-Process`. |
| **If the task is already running, then the following rule applies:** | <br>• **Do not start a new instance**<br>• **Run a new instance in parallel**<br>• **Queue a new instance**<br>• **Stop the existing instance** |

---

## Hurtige huskeregler

1. **Run with highest privileges** → kræves ofte til systemadministrative scripts.  
2. Scripts der mapper drev eller bruger netværksressourcer skal **ikke** køre som `SYSTEM` men som en domæne-servicekonto.  
3. Test altid med **Run**-knappen før du lukker Task Scheduler – den viser exit-kode direkte.  
4. Tjek logning under **History**-tab (slå den til i **Enable All Tasks History** i højre panel).  

Med ovenstående felter udfyldt har du hele overblikket over Task Schedulers vigtigste indstillinger.