# Proxmox VM Quickstart (GUI + CLI)

Formålet er at få en VM klar til brug på under 15 minutter. Guiden er opdelt i to spor – start med GUI, hvis du sjældent opretter VMs, og brug CLI, når du kender standardvalgene og vil spare tid.

---

## Forudsætninger
- Proxmox host er opdateret og har adgang til CPU og RAM nok til den nye VM
- Uploadet ISO eller eksisterende Cloud-Init template i dit foretrukne storage
- Netværksbridge (fx `vmbr0`) med adgang til det ønskede VLAN/subnet

---

## GUI: Opret en VM uden bøvl
1. **Datacenter → Node → Create VM**.
2. **General**: Navngiv VM'en kort og sigende. Sæt et VM ID manuelt, hvis du styrer nummer-serier.
3. **OS**: Vælg storage og ISO. Deaktivér "Guest Agent" kun hvis ISO'en er meget gammel.
4. **System**:
   - Sæt BIOS til **OVMF (UEFI)** for moderne OS, ellers **SeaBIOS**.
   - Slå **Qemu Agent** til, hvis OS'et understøtter det (gør shutdowns og IP-visning hurtigere).
5. **Disks**: 
   - Disk type: `scsi` med **VirtIO SCSI single** controller.
   - Storage: vælg hurtigste datastore (SSD/NVMe). 
   - Disk size: hellere lidt større og brug `fstrim` efterfølgende.
6. **CPU**: Vælg **host** som type for bedst performance. Start med 2 cores (4 threads) og øg efter behov.
7. **Memory**: Angiv minimum/maximum (ballooning). Start fx med 4096/4096 MB for en Linux server.
8. **Network**: Bridge = `vmbr0`. Model = **VirtIO (paravirtualized)**. Tilføj VLAN tag hvis nødvendigt.
9. **Confirm**: Fravælg "Start after created", hvis du vil redigere Cloud-Init først.

### Efter oprettelse
- Tilføj Cloud-Init disk (Hardware → **Add → CloudInit Drive**), hvis du vil auto-konfigurere bruger/SSH.
- Opret backup job med det samme (Datacenter → Backup → **Add** → vælg storage + schedule).
- Start VM'en, åbn konsol og installer OS. Installer Qemu agent (`qemu-guest-agent`) inde i VM'en.

---

## CLI: Hurtig VM via `qm`
Brug CLI, når du allerede har defineret standarder (ISO, storage, bridge). Eksemplet opretter en Ubuntu server på ID 120.

```bash
VMID=120
VMNAME="ubuntu-core"
ISO_STORAGE="local"
ISO_IMAGE="ubuntu-22.04-live-server.iso"
VM_STORAGE="fast-ssd"
BRIDGE="vmbr0"

qm create "$VMID" \
  --name "$VMNAME" \
  --ostype l26 \
  --memory 4096 \
  --cores 4 \
  --sockets 1 \
  --cpu host \
  --scsihw virtio-scsi-single \
  --scsi0 ${VM_STORAGE}:32 \
  --net0 virtio,bridge=$BRIDGE \
  --ide2 ${ISO_STORAGE}:iso/${ISO_IMAGE},media=cdrom \
  --boot order=scsi0;ide2 \
  --agent enabled=1,fstrim_cloned_disks=1
```

### Tuning og start
```bash
# Tilføj Cloud-Init disk (kræver Cloud-Init image i storage)
qm set "$VMID" --ide0 ${VM_STORAGE}:cloudinit

# Definér bruger, SSH nøgle og netværk
qm set "$VMID" --ciuser admin --cipassword 'SikkerMidltidigtPassword'
qm set "$VMID" --sshkey ~/.ssh/id_ed25519.pub
qm set "$VMID" --ipconfig0 ip=dhcp

# Start VM'en og overvåg konsollen
qm start "$VMID"
qm terminal "$VMID"
```

### Genbrug opsætningen
Når VM'en er klar, stop den og lav en template, så du kan klone lynhurtigt næste gang:
```bash
qm shutdown "$VMID" && qm template "$VMID"
```

---

## Hurtige fejlfindingstrin
- Ingen netværk? Tjek VLAN-tag på NIC og at bridge er knyttet til fysisk interface.
- Dårlig diskperformance? Verificer at disktypen er VirtIO SCSI og at `qemu-guest-agent` + `virtio` drivere er installeret.
- Kan ikke starte? `journalctl -xe` i host shell eller `qm status <vmid>` for mere info.
