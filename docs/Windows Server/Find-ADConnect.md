
# Find Entra AD Connect Server
### 🔍 Use PowerShell Remotely (Best if You Have Access to the Environment)**

#### **Script to Find the Azure AD Connect Server**

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

This will probe all machines in the domain for the `ADSync` service — the core of Entra Connect. It's fast and accurate if remote PowerShell is enabled and firewalls aren't in the way.

---

### 🔍 **Option 2: Check via Event Logs (On Known Candidates)**

Go to each server you *suspect* might be running it and look at:

* **Event Viewer → Applications and Services Logs → Directory Synchronization**
* Or `Event Viewer → Application Log` for source: `Directory Synchronization` or `ADSync`

You're looking for regular sync logs.

---

### 🔍 **Option 3: Use Entra Connect Health (If Set Up)**

* **[https://portal.azure.com](https://portal.azure.com) > Azure AD Connect Health**
* If they’ve deployed the health agent, it’ll show you **exactly which server is doing the sync**.
* Sadly, many small orgs don’t have this configured, or it’s broken.

---

### 🔍 **Option 4: Look in Entra Portal (Limited Use)**

You're already using:

* **Entra → User → Properties → On-premises**
  Good to confirm **which AD domain** is syncing, but not the exact server.

You can at least narrow down the **AD domain**, then start checking DCs or file servers in that domain for the `ADSync` service.

