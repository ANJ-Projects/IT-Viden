# Protected-Whitelist SSH Jumphost

*Fast, “set-and-forget” recipe for Ubuntu 22.04+*

---

## 0. What you’ll need

| Item                                                          | Why                                     |
| ------------------------------------------------------------- | --------------------------------------- |
| **Homelab Ubuntu server**                                     | The jumphost you’ll SSH into            |
| **Your static work WAN IP** (e.g. 203.0.113.45)               | To whitelist in the firewall & router   |
| **Router / firewall that supports source-IP port-forwarding** | Hides the port from everyone else       |
| **Windows PC at work** (no installs)                          | Has built-in `ssh.exe` and `ssh-keygen` |

---

## 1  Generate an SSH key *at work* (one-time)

```powershell
# in a PowerShell window on the work PC
ssh-keygen -t ed25519 -C "work-pc key" -f %USERPROFILE%\.ssh\work_homelab_ed25519
```

* Press **Enter** twice to save without passphrase (or add one for extra safety).
* This creates **`work_homelab_ed25519`** (private) and **`work_homelab_ed25519.pub`** (public).

Copy the content of the **`.pub`** file to your clipboard.

---

## 2  Add the key to the Ubuntu jumphost

SSH into the box from *inside* your home network:

```bash
ssh youruser@192.168.1.50        # old way, still works internally
```

Then:

```bash
# ensure .ssh exists
mkdir -p ~/.ssh && chmod 700 ~/.ssh

# paste the key
echo 'ssh-ed25519 AAAAC3NzaC1... work-pc key' >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

---

## 3  Harden the SSH daemon

Edit `/etc/ssh/sshd_config`:

```bash
sudo nano /etc/ssh/sshd_config
```

Add / modify:

```
Port 22222                 # pick any high, unused port
PasswordAuthentication no  # keys only
PermitRootLogin no
# optional extra belt-and-braces – accept only that work IP
Match Address 203.0.113.45
    AllowUsers youruser
```

```bash
sudo systemctl restart sshd
```

✅ **Test locally**

```bash
ssh -p 22222 youruser@127.0.0.1
```

---

## 4  Lock it down with UFW (Ubuntu firewall)

```bash
sudo ufw default deny incoming
sudo ufw allow from 203.0.113.45 to any port 22222 proto tcp comment "work-WAN SSH"
sudo ufw enable
sudo ufw status
```

Everything except your work IP is now dropped at the server itself.

---

## 5  Add router ↔ NAT rule

1. **Internal target**: `192.168.1.50 :22222`
2. **External port** : `22222` (or the same you chose)
3. **Source filter** : `203.0.113.45/32` only

> Each router UI is different; look for “advanced NAT” or “source IP” field.
> If your firmware has no source filter, rely on UFW only—bots will reach the router but die at the server.

---

## 6  (Optional) Fail2Ban safety-net

```bash
sudo apt update && sudo apt install fail2ban -y
# default jail already protects sshd
sudo systemctl enable --now fail2ban
```

Even if password auth is disabled, this keeps audit noise low.

---

## 7  (Optional) Persistent audit logs

```bash
sudo mkdir -p /var/log/jumphost
sudo journalctl -u ssh -f     # live view
# or save a daily log
sudo journalctl -u ssh --since today > /var/log/jumphost/ssh-$(date +%F).log
```

Systemd’s journal already retains logs across reboots (check `/etc/systemd/journald.conf` if you need to enlarge the log size).

---

## 8  Connect from work

Create / edit `%USERPROFILE%\.ssh\config` on the Windows PC:

```
Host homelab
    HostName your-home-dns-or-ip   # or DDNS
    Port 22222
    User youruser
    IdentityFile ~/.ssh/work_homelab_ed25519
    IdentitiesOnly yes
```

Now just:

```powershell
ssh homelab
```

---

## 9  Routine checklist (after a change at work/home)

| Event               | Action                                                     |
| ------------------- | ---------------------------------------------------------- |
| Work WAN IP changes | Update UFW rule & router source IP                         |
| New work PC         | Generate a new key, append its `.pub` to `authorized_keys` |
| Retire a PC         | Remove its key line from `authorized_keys`                 |

---

### 🎉 You now have a **Protected Whitelisted-IP SSH Jumphost**:

* Invisible to the internet
* Only reachable from your work network
* Key-authenticated, non-standard port
* Local firewall + optional Fail2Ban & logs

Drop me a note if you need automation scripts or guidance for a different Ubuntu version—happy hacking!
