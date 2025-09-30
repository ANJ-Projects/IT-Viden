# Hyper-V Checkpoints: Create, Apply, and Cleanup

## Why you care
* Checkpoints let you roll back risky changes fast.
* Leaving checkpoints around bloats storage and slows VM performance.

## Prerequisites
* Hyper-V role installed.
* VM in a healthy state (no critical errors).
* Enough free disk space to hold checkpoint differencing disks.

## Create checkpoint via Hyper-V Manager (GUI)
1. Open **Hyper-V Manager** → select the target VM.
2. Ensure the VM is **Running** or **Off**—avoid **Saved** state.
3. Right-click the VM → **Checkpoint**.
4. Rename the checkpoint immediately: right-click checkpoint → **Rename** (e.g., `Pre-Patch-2024-06-15`).
5. Wait until checkpoint creation completes (Status column returns to normal).

## Apply or revert checkpoint via Hyper-V Manager
1. Right-click the VM → **Checkpoint** tree.
2. Right-click desired checkpoint → **Apply**.
3. Choose whether to create an automatic checkpoint before apply:
   * **Create Checkpoint and Apply** if you may need to return.
   * **Apply** for direct rollback.
4. VM restarts to the saved state—log in and validate.

## Remove checkpoint via Hyper-V Manager
1. Right-click checkpoint → **Delete** (single) or **Delete Checkpoint Subtree** (all after selected point).
2. Confirm the delete—Hyper-V merges differencing disks in background.
3. Monitor the **Status** column; merging can take time on large disks.

## PowerShell equivalents (CLI)
### Create
```powershell
Checkpoint-VM -Name "WIN2022-APP01" -SnapshotName "Pre-Patch-2024-06-15"
```

### Apply
```powershell
Restore-VMSnapshot -VMName "WIN2022-APP01" -Name "Pre-Patch-2024-06-15" -Confirm:$false
```
* Add `-AsJob` if you want it to run asynchronously.

### Remove
```powershell
Remove-VMSnapshot -VMName "WIN2022-APP01" -Name "Pre-Patch-2024-06-15" -Confirm:$false
```
* To remove all checkpoints: `Get-VMSnapshot -VMName "WIN2022-APP01" | Remove-VMSnapshot -Confirm:$false`

## Best practices
* Never leave checkpoints longer than necessary—merge them after verifying changes.
* Avoid checkpoints on tier-1 workloads without change windows; they pause I/O during merge.
* For backup, use proper VSS-aware tools instead of long-lived checkpoints.
