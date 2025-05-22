
# Install SSH Server on Windows

## ✅ STEP 1: INSTALL OPENSSH SERVER (Windows 10/11 or Server)

### Option A: PowerShell (Best for automation)

```powershell
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
```

### Option B: GUI

* Go to *Settings > Apps > Optional Features > Add a feature*
* Find **OpenSSH Server**, click **Install**

---

## ✅ STEP 2: START AND ENABLE SERVICE

```powershell
Start-Service sshd
Set-Service -Name sshd -StartupType 'Automatic'
```

To confirm it's running:

```powershell
Get-Service sshd
```

---

## ✅ STEP 3: OPEN FIREWALL PORT 22

```powershell
New-NetFirewallRule -Name sshd -DisplayName 'OpenSSH Server' -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22
```

---

## ✅ STEP 4: RESTRICT ACCESS TO SPECIFIC USERS ONLY

This is where most people mess up. You don’t just install it—you **lock it down**.

### 🔐 Modify the `sshd_config` file:

Location:

```plaintext
C:\ProgramData\ssh\sshd_config
```

### Add this at the bottom of `sshd_config`:

```plaintext
AllowUsers yourdomain\User yourdomain\OtherUser
```

> ✅ You can also use local accounts like `DESKTOP-XXXX\username`
> ❌ Don’t use `AllowGroups` unless you’ve configured local/AD groups correctly.

Then restart the SSH service:

```powershell
Restart-Service sshd
```

---

## ✅ STEP 5: HARDEN SSH CONFIG

Edit `sshd_config` again and change/add these:

```plaintext
PasswordAuthentication no
PermitRootLogin no
PermitEmptyPasswords no
UseDNS no
AllowTcpForwarding no
MaxAuthTries 3
LogLevel VERBOSE
```

> If you want to allow key-based only:

```plaintext
PubkeyAuthentication yes
```

---

## ✅ STEP 6: SET UP AUTHORIZED KEYS FOR USERS

For each allowed user:

1. Create `.ssh` folder:
   `C:\Users\<Username>\.ssh\`
2. Create `authorized_keys` file inside `.ssh`
3. Paste their public key inside

Set proper permissions:

* `.ssh` folder: User = Full Control
* `authorized_keys` file: User = Read only

---

## ✅ STEP 7: TEST AND VERIFY

From another machine:

```bash
ssh User@yourwindowsIP
```

Check `C:\ProgramData\ssh\logs\sshd.log` if login fails.

---

## ✅ BONUS: AUDIT & MONITORING

Check login attempts:

```powershell
Get-WinEvent -LogName "Microsoft-Windows-OpenSSH/Operational" | Select TimeCreated, Message
```

---

## ⚠️ COMMON MISTAKES TO AVOID

* ❌ Forgetting to restart `sshd` after config changes
* ❌ Not setting correct file permissions on `.ssh` folders
* ❌ Leaving `PasswordAuthentication yes` on
* ❌ Thinking UAC applies to SSH—it doesn’t. You need correct group/policy access too
