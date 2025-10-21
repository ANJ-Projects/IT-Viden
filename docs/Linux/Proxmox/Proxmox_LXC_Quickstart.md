# Proxmox LXC Quickstart (GUI + CLI)

Målet er at klargøre en LXC-container med korrekte limits og netværk på få minutter.

---

## Forudsætninger
- Downloadet LXC template (GUI: **Storage → Templates** eller CLI: `pveam update && pveam download <storage> <template>`)
- Kendt VLAN eller bridge og eventuelt statisk IP
- SSH adgang til host, hvis du vil bruge CLI

---

## GUI: Klargør en container uden spildtid
1. **Datacenter → Node → Create CT**.
2. **General**: Navngiv containeren, vælg root password og eventuel SSH key.
3. **Template**: Vælg storage + template. Prioritér "std" eller "minimal" images for hurtig boot.
4. **Disks**: Sæt diskstørrelse. Brug "Discard" hvis storage understøtter det.
5. **CPU**: Begræns cores (fx 2) og sæt CPU limit, hvis containeren ikke må stjæle alt.
6. **Memory**: Sæt hard limit (fx 2048 MB). Swap = 0, medmindre applikationen kræver det.
7. **Network**:
   - Bridge = `vmbr0` (eller relevant). 
   - VLAN tag efter behov.
   - DHCP til hurtige tests, statisk for produktion.
8. **DNS**: Brug hostens DNS (auto) eller angiv specifikke.
9. **Confirm**: Fjern "Start after created", hvis du vil tilføje mounts først.

### Hurtige efter-steps
- Tilføj bind mounts: **Resources → Add → Mount Point**. Sæt `mp0=/data,backup=0` for hurtig storage.
- Skift CPU type til **host** (Options → Features → Nesting hvis containeren skal køre Docker).
- Start containeren og SSH ind.

---

## CLI: Opret container via `pct`
Eksempel opretter en Debian 12 container på ID 220 med statisk IP.

```bash
CTID=220
HOSTNAME="debian-services"
TEMPLATE="local:vztmpl/debian-12-standard_12.2-1_amd64.tar.zst"
STORAGE="fast-ssd"
BRIDGE="vmbr0"
IP="192.168.10.50/24"
GW="192.168.10.1"

pct create "$CTID" "$TEMPLATE" \
  --hostname "$HOSTNAME" \
  --password 'SkiftMig123!' \
  --cores 2 \
  --memory 2048 \
  --swap 0 \
  --rootfs ${STORAGE}:8 \
  --net0 name=eth0,bridge=$BRIDGE,ip=$IP,gw=$GW \
  --features nesting=1 \
  --unprivileged 1
```

### Efter opsætning
```bash
# Start container og attach konsol
pct start "$CTID"
pct console "$CTID"

# Tilføj bind mount til /data
pct set "$CTID" --mp0 /srv/appdata,mp=/data

# Sæt automatisk start, når noden booter
pct set "$CTID" --onboot 1 --startup order=20,up=30
```

---

## Fejlfinding i felten
- Container nægter at starte? Kør `pct start <ctid> --debug` og læs `/var/log/pve/tasks/`.
- Manglende netværk? Tjek at bridge eksisterer (`ip link show vmbr0`) og at VLAN er tilladt på uplink.
- Har du brug for fuld isolation? Overvej at oprette en VM i stedet; LXC deler host-kernen.
