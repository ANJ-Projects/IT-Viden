# Proxmox Backup & Restore Playbook (GUI + CLI)

Hold dine VMs og LXCs sikre med en enkel strategi: lokal snapshot + offsite kopi. Her er de konkrete trin uden unødvendig støj.

---

## Forudsætninger
- Backup storage (NAS via CIFS/NFS eller Proxmox Backup Server)
- Mindst ét eksisterende backup job for at verificere restore-processen
- Administrator adgang til Proxmox GUI og SSH adgang til hosten

---

## GUI: Opsæt backups og test restore
### 1. Tilføj backup storage
1. **Datacenter → Storage → Add → (CIFS eller NFS)**.
2. Vælg **Content** = `VZDump backup file` (og `ISO image` hvis samme share skal rumme ISOs).
3. Marker "Enable" og tryk **Add**. Sørg for at share'et har plads og adgang.

### 2. Planlæg automatiske backups
1. **Datacenter → Backup → Add**.
2. Vælg storage, schedule (fx `daily` eller `mon-sun` 03:00), og hvilke gæster der skal med.
3. Brug **Mode = Snapshot** for VMs (hurtigst) og **Stop** for følsomme databaser, hvis du ikke bruger guest agent hooks.
4. Sæt **Send email** hvis du har SMTP opsat – ellers tjek loggen dagligt.

### 3. Restore-test uden risiko
1. Find backup: **Datacenter → Storage → <dit backup storage> → Backups**.
2. Vælg backup → **Restore**.
3. Genopret til nyt ID (fx `9000+`). Markér "Unique" for MAC-adresser.
4. Start den gendannede gæst og verificér applikationen. Slet bagefter for at frigøre plads.

---

## CLI: Hurtige kommandoer til backup og restore
### Kør manuel backup
```bash
# Backup VM 120 til storage 'backup-nas'
vzdump 120 --storage backup-nas --mode snapshot --compress zstd

# Backup container 220 og stop midlertidigt for konsistens
vzdump 220 --storage backup-nas --mode stop --compress zstd
```

### Planlæg via cron (alternativ til GUI)
```bash
cat <<'CRON' >> /etc/cron.d/proxmox-custom-backups
# Daglig VM backup kl. 02:30
30 2 * * * root vzdump 120 --storage backup-nas --mode snapshot --compress zstd --quiet 1
CRON
```

### Restore direkte fra shell
```bash
# Gendan VM backup til nyt ID 121 og kør på samme node
vzdump --list /mnt/pve/backup-nas/dump | grep vm-120
qmrestore /mnt/pve/backup-nas/dump/vzdump-qemu-120-*.vma.zst 121 --unique 1 --storage fast-ssd

# Gendan container til nyt ID 221
pct restore 221 /mnt/pve/backup-nas/dump/vzdump-lxc-220-*.tar.zst --storage fast-ssd
```

> Tip: Brug `--pool` på backup jobs for at gruppere relaterede servere. Under restore kan du filtrere via pool-navnet.

---

## Overvågning og oprydning
- **Logfiler**: `journalctl -u vzdump` og `/var/log/pve/tasks` viser fejl.
- **Pladsstyring**: Brug **Datacenter → Storage → <backup> → Content** og slet gamle backups, eller kør `pveperf /mnt/pve/backup-nas` for at teste performance.
- **Retention**: Sæt `Keep` værdier i backup job (fx keep-last=7, keep-weekly=4) så du ikke drukner i gamle filer.
