# Create Hyper-V Virtual Switches

## Why you care
* Virtual switches provide VM network access—no switch, no connectivity.
* Correct switch type (External/Internal/Private) prevents routing surprises later.

## Prerequisites
* Hyper-V role installed.
* At least one physical NIC dedicated for external traffic (if creating External switch).
* Run steps from an elevated account.

## Create via Hyper-V Manager (GUI)
1. Open **Hyper-V Manager** → select the host in the left pane.
2. In **Actions**, click **Virtual Switch Manager**.
3. Choose the switch type:
   * **External** – binds to a physical NIC for LAN/internet access.
   * **Internal** – host ↔ VM communication only.
   * **Private** – VM ↔ VM communication only.
4. Click **Create Virtual Switch**.
5. Name the switch descriptively (e.g., `External-LAN`), add notes if useful.
6. For External switches:
   * Select the physical adapter.
   * Check **Allow management OS to share this network adapter** only if the host should use the same NIC.
   * Leave VLAN unchecked unless trunking is required—configure tagged VLAN ID if needed.
7. Click **Apply** → confirm that network connectivity will reset → **Yes**.
8. Click **OK** to exit the manager.

## Create via PowerShell (CLI)
### External switch
```powershell
New-VMSwitch -Name "External-LAN" -NetAdapterName "NIC1" -AllowManagementOS $true
```
* Replace `NIC1` with the exact adapter name from `Get-NetAdapter`.

### Internal switch
```powershell
New-VMSwitch -Name "Internal-Only" -SwitchType Internal
```

### Private switch
```powershell
New-VMSwitch -Name "Private-Isolated" -SwitchType Private
```

### Optional VLAN tag
```powershell
Set-VMSwitch -Name "External-LAN" -DefaultFlowMinimumBandwidthWeight 0 -Notes "VLAN 20 for production"
Set-VMNetworkAdapterVlan -ManagementOS -VMNetworkAdapterName "External-LAN" -Access -VlanId 20
```
* Skip VLAN commands if not required.

## Verification
* `Get-VMSwitch` should list the new switch with **Status = {Up/Down}**.
* Check host NIC list—an external switch creates a new vEthernet adapter.
* Test connectivity by assigning the switch to a test VM and pinging gateway.
