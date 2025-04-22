# Tilfælde hvor at drev ikke virker efter password skift og der benyttes drev og Azure Joined PC'er
Rigtig godt svar fra den nye o3 model fra OpenAI

**Short answer:**  
Unlocking the account on‑prem and then forcing the workstation to reboot (or at least sign‑out/sign‑in) *does* clear the cached credentials and Kerberos tickets, so it explains why everything started working. It wasn’t harmful—but it’s the “big hammer.” You could have fixed it without a restart and with less chance of a second lock‑out.

---

### What actually happened

| Step | What Windows was doing |
|------|------------------------|
|User changed password (Azure AD)|The PC updated its cloud sign‑in token, **but** the old NTLM/Kerberos credentials that were saved for the mapped drives were still on disk and in memory.|
|Mapped drives reconnected in the background|Each reconnect tried the **old** password several times → caused AD DS account lock‑out citeturn0search0|
|You unlocked the account in AD|Lock‑out flag cleared, but the workstation still held the stale credentials + service tickets in LSASS, so new attempts still failed.|
|Restart (or full sign‑out)|Purged the cached Windows credentials and Kerberos tickets, so the next connect used the new password and succeeded. |

---

### Faster / cleaner ways (no reboot required)

| Action | Command / UI | When to use |
|--------|--------------|-------------|
|Flush Kerberos tickets in *current* logon session|`klist purge`|Immediately after a password change when the PC still has network resources open citeturn2search7|
|Flush tickets held by SYSTEM for drive reconnect |`klist -li 0x3e7 purge` (elevated)|If the SYSTEM account is doing the reconnects citeturn2search4|
|Delete / re‑create mapped drive|`net use * /delete /y` then `net use Z: \\fileserver\share /user:DOMAIN\user newPassword`|Quickest way to stop the lock‑out loop; avoids touching Kerberos entirely|
|Clear saved creds|Credential Manager → *Windows Credentials* → remove the entry|Needed if the drive was mapped with “Remember my credentials”|

Either of the first two options immediately forces Windows to request a fresh TGT/service ticket with the new password; no reboot is needed.

---

### Hardening / long‑term fixes

1. **Stop storing passwords for on‑prem shares.**  
   Configure *Azure AD Kerberos* so Azure AD–joined devices can get Kerberos tickets for your AD DS shares without saving credentials. Requires:  
   * DCs on Server 2016+  
   * Azure AD Connect (or cloud sync)  
   * `Enable-AzureADKerberosServer` on a DC citeturn0search1  
   Once enabled, the drive can be deployed via Intune with “Azure AD Kerberos” auth and users never re‑enter a password.

2. **Review lock‑out sources.**  
   Scheduled tasks, services, phones with legacy ActiveSync, etc. can all keep retrying the old password and re‑lock the account citeturn0search6.

3. **Post‑password‑change guidance for users.**  
   Tell users on Azure AD‑joined PCs to *sign out and back in* (not just lock/unlock) after they change their password. That renews all tokens and avoids silent lock‑outs.

---

### Checklist for next time

```text
1. Unlock account in AD if necessary.
2. On the PC (elevated):
      klist purge
      klist -li 0x3e7 purge   ← optional but safe
3. Delete and re‑create any mapped drives OR clear the entry in Credential Manager.
4. (Optional) Sign out/in to renew Azure AD tokens.
```

If you follow those four steps you’ll avoid the reboot and prevent multiple lock‑out cycles, while still getting the mapped drives online with the new password.
