# Drive Access Troubleshooting on Mac
macOS will happily mount an SMB share and show you the top-level folder structure even if your underlying NTFS permissions don’t actually let you traverse into every subfolder. In practice you can end up “mapped” (i.e. the share is connected) but then get “You don’t have permission to access that folder” as soon as you try to open one or more subfolders. The usual culprits are:

1. **Share-level vs NTFS ACLs**  
   - **Share permissions** on the Windows side may grant your security group Read (or even Change) at the share root, so the Mac can mount and list the share.  
   - **NTFS permissions** (the ACLs on the folders themselves) then kick in when you try to open subfolders. If your group isn’t granted at least “Traverse folder / execute file” plus “List folder / read data” on a given folder (or if an explicit Deny is applied), you’ll be blocked.  
   
2. **Stale credentials or Kerberos ticket**  
   - If your AD group membership was changed recently, macOS won’t pick up the new Kerberos ticket until you log out (or run `kinit`) and remount. You may still be presenting the “old” token that doesn’t include your new group.  
   - Similarly, Finder’s SMB password keychain entry can cause it to reconnect as a different user (or even as “Guest”), so double-check in **Keychain Access → smb:server** that the stored credentials are correct, or remove that entry and reconnect explicitly as your domain user.  

3. **Explicit Deny or inheritance break**  
   - On Windows it’s easy to accidentally put an **explicit Deny** on a subfolder, or turn off “Inherit from parent,” which overrides the Allow from your group. An Allow on the share root won’t help you if a Deny lives deeper in the tree.  

---

### How to troubleshoot on macOS

1. **Force a fresh mount with your true user credentials**  
   - In Finder: **Go → Connect to Server…**, then use  
     ```
     smb://DOMAIN;username@fileserver.example.com/ShareName
     ```  
   - Enter your password when prompted (don’t let it default to Guest).  

2. **Renew your Kerberos ticket**  
   ```bash
   kdestroy
   kinit username@YOUR.DOMAIN
   ```  
   Then unmount/remount the share.

3. **Check effective ACLs on Windows**  
   - On the file server, in the folder’s **Properties → Security → Advanced → Effective Access**, select your account and verify which permissions are actually being applied.  

4. **Test from the Mac command line**  
   ```bash
   smbutil statshares -a
   ls -led /Volumes/ShareName/ProblemSubfolder
   ```  
   The `ls -led` will show you the POSIX permissions and any extended ACL entries that macOS sees; a “0” or “drwx—” for your user means you truly aren’t allowed in.

---

#### Bottom line
macOS doesn’t fuse share-level and NTFS ACLs into one single “you’re allowed to mount or not” test – it mounts first, then enforces per-folder ACLs as you browse. So yes, you can be in the right AD groups for the share root yet still hit permission denied on folders deeper in the structure.
