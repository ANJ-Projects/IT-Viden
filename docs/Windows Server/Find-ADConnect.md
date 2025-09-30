# Find Entra AD Connect-server
### 🔍 Brug PowerShell eksternt (bedst hvis du har adgang til miljøet)

#### **Script til at finde Azure AD Connect-serveren**

```powershell
$syncServer = Get-ADComputer -Filter 'Name -like "*"' -Properties Name |
    ForEach-Object {
        try {
            $result = Invoke-Command -ComputerName $_.Name -ScriptBlock {
                Get-Service -Name ADSync -ErrorAction Stop
            } -ErrorAction Stop
            return $_.Name
        } catch {}
    }

Write-Output "Azure AD Connect is installed on: $syncServer"
```

Dette prøver alle maskiner i domænet for `ADSync`-servicen — kernen i Entra Connect. Det er hurtigt og præcist, hvis Remote PowerShell er aktiveret og firewalls ikke blokerer.

---

### 🔍 **Mulighed 2: Tjek Event Logs (på sandsynlige kandidater)**

Gå til hver server, du *mistænker* kører den, og kig i:

* **Event Viewer → Applications and Services Logs → Directory Synchronization**
* Eller `Event Viewer → Application Log` efter kilderne `Directory Synchronization` eller `ADSync`

Du leder efter regelmæssige sync-logs.

---

### 🔍 **Mulighed 3: Brug Entra Connect Health (hvis sat op)**

* **[https://portal.azure.com](https://portal.azure.com) > Azure AD Connect Health**
* Hvis Health-agenten er implementeret, viser den dig **præcis hvilken server der synkroniserer**.
* Desværre har mange små organisationer ikke konfigureret dette, eller også er det gået i stykker.

---

### 🔍 **Mulighed 4: Kig i Entra-portalen (begrænset brug)**

Du bruger måske allerede:

* **Entra → User → Properties → On-premises**
  God til at bekræfte **hvilket AD-domæne** der synkroniseres, men ikke den præcise server.

Du kan i det mindste indsnævre **AD-domænet** og derefter begynde at tjekke DC'er eller filservere i det domæne for `ADSync`-servicen.
