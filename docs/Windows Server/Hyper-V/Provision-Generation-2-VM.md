# Provision a Generation 2 VM in Hyper-V

## Why you care
* Generation 2 VMs support Secure Boot, UEFI, and better performance.
* Consistent provisioning keeps deployments fast and predictable.

## Prerequisites
* Hyper-V role installed and at least one virtual switch available.
* Installation media ISO accessible (UNC path or local).
* Storage volume with enough free space for the VM disks.

## Create via Hyper-V Manager (GUI)
1. Open **Hyper-V Manager** → right-click the host → **New** → **Virtual Machine**.
2. **Before You Begin** → **Next**.
3. Name the VM (e.g., `WIN2022-APP01`) and adjust location if you store VMs on another volume.
4. **Specify Generation** → choose **Generation 2**.
5. **Assign Memory** → set startup RAM (e.g., `4096 MB`), leave **Dynamic Memory** checked unless workload requires fixed RAM.
6. **Configure Networking** → select the correct virtual switch.
7. **Connect Virtual Hard Disk** → choose **Create a virtual hard disk** → size it realistically (e.g., 80 GB for Server Core).
8. **Installation Options** → select **Install an operating system from a bootable image file** → browse to ISO.
9. Review summary → **Finish**.
10. Start the VM → open **Connect** to verify it boots to the installer.

## Create via PowerShell (CLI)
```powershell
$vmName = "WIN2022-APP01"
$vmPath = "D:\Hyper-V\$vmName"
New-VM -Name $vmName -Generation 2 -MemoryStartupBytes 4GB -SwitchName "External-LAN" -Path $vmPath -NewVHDPath "$vmPath\$vmName.vhdx" -NewVHDSizeBytes 80GB
Set-VMProcessor -VMName $vmName -Count 4
Set-VMDvdDrive -VMName $vmName -Path "\\fileserver\isos\SW_DVD9_Win_Server.iso"
$dvd = (Get-VMFirmware -VMName $vmName).BootOrder | Where-Object { $_.Device -like "*DVD Drive*" }
Set-VMFirmware -VMName $vmName -FirstBootDevice $dvd
Start-VM -Name $vmName
```
* Adjust CPU, memory, ISO path, and storage paths to match your environment.
* `Set-VMFirmware` step ensures the DVD boots first.

## Quick validation
* `Get-VM -Name WIN2022-APP01` should show **State = Running**.
* VM console should display OS installer.
* Confirm VM files exist under the chosen storage path.
