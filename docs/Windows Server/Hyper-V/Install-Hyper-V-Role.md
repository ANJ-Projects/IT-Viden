# Install Hyper-V Role on Windows Server

## Why you care
* You cannot manage or host VMs until the Hyper-V role is enabled.
* Role install requires a reboot—plan a maintenance window.

## Prerequisites
* Windows Server with hardware virtualization (Intel VT-x/AMD-V) enabled in BIOS/UEFI.
* Local administrator rights.
* Outbound access to Windows Update if features on demand are missing.

## Install via Server Manager (GUI)
1. Sign in with an administrator account.
2. Launch **Server Manager** → **Manage** → **Add Roles and Features**.
3. **Before You Begin** → click **Next** until **Server Roles**.
4. Check **Hyper-V** → confirm required features → **Add Features** → **Next**.
5. Leave defaults in **Features** and **Hyper-V** wizard pages unless you need remote management tools.
6. On **Virtual Switches**, leave unchecked unless you want automatic external switch creation.
7. Review **Migration** and **Default Stores** settings → adjust if you have dedicated storage volumes.
8. Click **Install** → allow the server to reboot when prompted.
9. After restart, log back in → installation completes automatically → verify **Hyper-V Manager** shortcut exists in Start Menu.

## Install via PowerShell (CLI)
```powershell
# Run in elevated PowerShell
Install-WindowsFeature -Name Hyper-V -IncludeManagementTools -Restart
```
* Command automatically schedules reboot when required.
* If you cannot reboot immediately, remove `-Restart` and reboot later.

## Post-install checks
* `Get-WindowsFeature Hyper-V` should show **Installed**.
* Hyper-V services (VMMS, vmcompute) should be running.
* If installation fails, review `C:\Windows\Logs\CBS\CBS.log` and ensure virtualization is enabled in firmware.
