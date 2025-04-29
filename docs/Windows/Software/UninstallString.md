
# 🔧 **PowerShell-script: Vis installerede MSI-applikationer med GUID'er**

## 🧾 **Introduktion**
Dette PowerShell-script bruges til at finde og liste programmer installeret via MSI (Microsoft Installer) på en Windows-maskine. Det henter oplysninger fra både 64-bit og 32-bit registreringsstier under HKLM og HKCU. Det filtrerer kun de programmer, som er installeret med `msiexec`, og udtrækker GUID direkte fra afinstallationsstrengen.

---

```powershell
$registryPaths = @(
    "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*",
    "HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*",
    "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*"
)

$results = foreach ($path in $registryPaths) {
    Get-ItemProperty $path -ErrorAction SilentlyContinue |
    Where-Object { $_.DisplayName -and $_.UninstallString -like "*msiexec*" } |
    Select-Object @{Name="Name";Expression={$_.DisplayName}},
                  @{Name="Version";Expression={$_.DisplayVersion}},
                  @{Name="MSI_GUID";Expression={[regex]::Match($_.UninstallString, '{.*?}').Value}},
                  @{Name="InstallLocation";Expression={$_.InstallLocation}}
}

$results | Format-Table -AutoSize
```

---

### 💡 Noter:
- Filtrerer kun MSI-baserede programmer (`msiexec` i `UninstallString`).
- GUID (`MSI_GUID`) udtrækkes med regex fra `UninstallString`.
- Dækker både 64-bit og 32-bit placeringer under HKLM og HKCU.

