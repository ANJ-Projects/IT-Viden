
# Teamviewer
*En af de mest brugte remote værktøjer til IT Supportere*

## Teamviewer GUI

### Forbind som Administrator på Teamviewer PC
*Hvis bruger benytter sig Quicksupport klient skal dette gøres for at forbinde som Administrator*

Når du forbinder istedet for at skrive kode tryk "Windows-Login"
Herefter indtast login

#### Hvis PC'en benytter AzureAD
Username: `azuread\support@dinmail.dk`  
Password: `Din kode`  

#### Hvis PC'en benytter LAPS
Username: `.\Brugernavn`   
Password: `Din kode`  

#### Hvis PC'en benytter Domæne
Username: `Domænenavn\Brugernavn`  
Password: `Din kode`  

## Teamviewer CLI

### Teamviewer CMD
```
C:\Program Files\TeamViewer\TeamViewer.exe -i "ID" --password "Password"
```

### Powershell Script - Forbind via Teamviewer
```powershell
function Connect-TeamViewer {
        param (
            [Parameter(Mandatory=$true)]
            [string]$ID,
    
            [Parameter(Mandatory=$true)]
            [string]$Password
        )
    
        # Build the command to run TeamViewer with ID and Password
        $teamViewerCommand = "C:\Program Files\TeamViewer\TeamViewer.exe"
        $arguments = "-i $ID --Password $Password"
    
        # Start TeamViewer with the specified ID and Password
        Start-Process -FilePath $teamViewerCommand -ArgumentList $arguments
    
        # Get current timestamp
        $timestamp = Get-Date -Format "HH:mm dd-MM-yyyy"
    
        # Define the path to the notes file (optional)
        # $notesPath = "c:\notes.txt"
    
        # Add entry to the notes file (optional)
        # Add-Content -Path $script:filePath -Value "$timestamp - Connected to TeamViewer with ID: $ID and Password: $Password"
    }
```