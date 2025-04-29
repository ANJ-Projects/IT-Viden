
### 🔧 **PowerShell Script: List Installed MSI Apps with GUIDs**

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

### 💡 Notes:
- This filters only MSI-based applications (`msiexec` in `UninstallString`).
- The GUID (`MSI_GUID`) is extracted via regex from the `UninstallString`.
- It covers 64-bit and 32-bit locations under both HKLM and HKCU.
