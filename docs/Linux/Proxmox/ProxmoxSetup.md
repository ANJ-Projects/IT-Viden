
# Sådan konfigurerer du en ny Proxmox Server  
Denne guide bruges, når en ny Proxmox-server skal opsættes.  

At være ny i Proxmox kan være en udfordring – nogle af de mest frustrerende ting at finde ud af som nybegynder er fx:  
* Storage  
* Backups  
* Shares / Monterede eksterne drev  

Denne guide forsøger at være så simpel som muligt, men stadig informativ nok til at kunne udføre de nødvendige opgaver.  

---

## OPSÆTNING  
* Lenovo PC  
* 120 GB SSD (Proxmox er installeret her)  
* 500 GB NVME (Bruges til storage)  
* Drev blev slettet via Windows installer og genoprettet derfra (Der opstod fejl under installation af Proxmox, da diskene var uinitialiserede)

Videoguide: https://www.youtube.com/watch?v=GoZaMgEgrHw  

---

## Opdatering  

Gå ind i Proxmox Web GUI  

**Datacenter > Nodes > Aktuel PC/Server > Updates > Repositories**  

Så:  
```
Add Standard  
Disable Enterprise  
```

Åbn shell:  
```bash
apt update -y && apt upgrade -y && apt dist-upgrade -y
```

---

## Storage  

### Rens partitioner  

*Jeg har ikke haft brug for dette endnu, da alt kunne klares via GUI’en*  

Gå til:  
**Datacenter > Nodes > Aktuel PC/Server > Disks**  
Her kan du se diskene  

Åbn shell:  
Brug `fdisk`  
```bash
fdisk /dev/sda
```

Vis partition-info:  
```bash
p
```

Slet partitioner (hvis nødvendigt):  
```bash
fdisk /dev/sda
```

---

### Klargør disk til storage  
**Datacenter > Nodes > Aktuel PC/Server > Disks**  
Initialiser disken med GPT  
**Datacenter > Nodes > Aktuel PC/Server > Disks > ZFS**  
Klik på **CREATE: ZFS**  
Vælg og tilføj disken som ZFS  

---

### Tjek om disk er klar til VM-oprettelse  

**Datacenter > Nodes > Aktuel PC/Server** (højreklik)  
**Create VM**  

Angiv navn  
Klik videre – når du kommer til Hard disk, fold **Storage** dropdown ud.  
Den nye disk burde være synlig – hvis ikke, er der måske et problem med initialiseringen.  

---

## Backups  
Genstart serveren, så den er på version **Proxmox 7.3-3** eller højere  

**Datacenter > Storage > SMB/CIFS**  

- **ID** er navnet  
- **Server** er SMB serveren  
- **Username** er brugernavn  
- **Password** er adgangskoden  
- **Share** er det share, der bruges – opret et nyt share, da Proxmox laver mapper i sharet  
- Under **Content**, vælg **VZDump backup file**

---

## ISOs  
*Jeg anbefaler at gemme ISOs på et netværks-share – upload kan være frustrerende, og det er en god idé at holde VMs adskilt*  

**Datacenter > Storage > SMB/CIFS**

- **ID** er navnet  
- **Server** er SMB serveren  
- **Username** er brugernavn  
- **Password** er adgangskode  
- **Share** er det share, der bruges – opret et nyt share, da Proxmox laver mapper i sharet  
- Under **Content**, vælg **ISO image**

---

## Auto Mount  

Installer `pve7-usb-automount`  

### Installation  
```bash
apt-key adv --recv-keys --keyserver keyserver.ubuntu.com 2FAB19E7CCB7F415 && echo "deb https://apt.iteas.at/iteas bullseye main" > /etc/apt/sources.list.d/iteas.list && apt update && apt install pve7-usb-automount
```

### Brug  
```bash
df -h
```

Find størrelsen på din storage og tjek hvor den er monteret – i dette eksempel var den monteret her:  
`/media/sdb1`

---

## Cluster  

### 2 Proxmox servere  

*Sørg for, at den anden node ikke har adgang til nogen af de VMs eller storage den første node bruger.*  

Kør følgende kommando for at starte VMs, hvis der kun er 2 Proxmox-servere:  
```bash
pvecm expected 1
```
