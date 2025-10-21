# Beskyttet SSH Jump-host med whitelist
*Hurtig “set-and-forget” opskrift til Ubuntu 22.04+*

---

## 0. Det skal du bruge

| Element                                                        | Hvorfor                                   |
| -------------------------------------------------------------- | ----------------------------------------- |
| **Homelab Ubuntu-server**                                      | Jump-hosten du SSH'er ind på              |
| **Din statiske arbejds-WAN IP** (f.eks. 203.0.113.45)          | Skal whitelistes i firewall og router     |
| **Router/firewall med source-IP port-forwarding**              | Skjuler porten for alle andre             |
| **Windows-PC på arbejdet** (ingen installationer)              | Har indbygget `ssh.exe` og `ssh-keygen`   |

---

## 1  Generér en SSH-nøgle *på arbejdet* (engangs)

```powershell
# I et PowerShell-vindue på arbejds-PC'en
ssh-keygen -t ed25519 -C "work-pc key" -f %USERPROFILE%\.ssh\work_homelab_ed25519
```

* Tryk **Enter** to gange for at gemme uden passphrase (eller tilføj én for ekstra sikkerhed).
* Det skaber **`work_homelab_ed25519`** (privat) og **`work_homelab_ed25519.pub`** (offentlig).

Kopiér indholdet af **`.pub`**-filen til udklipsholderen.

---

## 2  Tilføj nøglen til Ubuntu jump-hosten

SSH ind på boksen *inde fra* dit hjemmenetværk:

```bash
ssh youruser@192.168.1.50        # gammel metode, virker stadig internt
```

Derefter:

```bash
# sørg for at .ssh findes
mkdir -p ~/.ssh && chmod 700 ~/.ssh

# indsæt nøglen
echo 'ssh-ed25519 AAAAC3NzaC1... work-pc key' >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

---

## 3  Hærd SSH-dæmonen

Redigér `/etc/ssh/sshd_config`:

```bash
sudo nano /etc/ssh/sshd_config
```

Tilføj/ret:

```
Port 22222                 # vælg en høj, ledig port
PasswordAuthentication no  # kun nøgler
PermitRootLogin no
# ekstra bælte og seler – accepter kun den arbejds-IP
Match Address 203.0.113.45
    AllowUsers youruser
```

```bash
sudo systemctl restart sshd
```

✅ **Test lokalt**

```bash
ssh -p 22222 youruser@127.0.0.1
```

---

## 4  Lås ned med UFW (Ubuntu firewall)

```bash
sudo ufw default deny incoming
sudo ufw allow from 203.0.113.45 to any port 22222 proto tcp comment "work-WAN SSH"
sudo ufw enable
sudo ufw status
```

Nu bliver alt undtagen din arbejds-IP droppet på selve serveren.

---

## 5  Tilføj router ↔ NAT-regel

1. **Intern destination**: `192.168.1.50 :22222`
2. **Ekstern port** : `22222` (eller den port du valgte)
3. **Source filter** : kun `203.0.113.45/32`

> Hver router-UI er forskellig; kig efter feltet “advanced NAT” eller “source IP”.
> Har firmwaren intet source filter, må du nøjes med UFW – bots når routeren men dør på serveren.

---

## 6  (Valgfrit) Fail2Ban-sikkerhedsnet

```bash
sudo apt update && sudo apt install fail2ban -y
# standard-jail beskytter allerede sshd
sudo systemctl enable --now fail2ban
```

Selv om password-login er slået fra, holder dette støj i audit-logs nede.

---

## 7  (Valgfrit) Vedvarende audit-logs

```bash
sudo mkdir -p /var/log/jumphost
sudo journalctl -u ssh -f     # live-visning
# eller gem en daglig log
sudo journalctl -u ssh --since today > /var/log/jumphost/ssh-$(date +%F).log
```

Systemd-journalen beholder allerede logs gennem genstarter (tjek `/etc/systemd/journald.conf` hvis du skal øge logstørrelsen).

---

## 8  Forbind fra arbejdet

Opret/redigér `%USERPROFILE%\.ssh\config` på Windows-PC'en:

```
Host homelab
    HostName your-home-dns-or-ip   # eller DDNS
    Port 22222
    User youruser
    IdentityFile ~/.ssh/work_homelab_ed25519
    IdentitiesOnly yes
```

Nu kan du blot:

```powershell
ssh homelab
```

---

## 9  Fast tjekliste (efter ændringer hjemme/på arbejdet)

| Hændelse            | Handling                                                     |
| ------------------- | ------------------------------------------------------------ |
| Arbejds-WAN IP ændres | Opdatér UFW-regel og routerens source-IP                   |
| Ny arbejds-PC       | Generér ny nøgle og tilføj dens `.pub` til `authorized_keys` |
| PC pensioneres      | Fjern dens nøglelinje fra `authorized_keys`                  |
