# Den nemme SSH-nøgle-guide der bør standardiseres
**"The 2025 SSH Key Setup That Doesn't Suck"**

```bash
# Trin 1 – Opret din nøgle
ssh-keygen -t ed25519 -C "username_master_2025"

# Trin 2 – Upload public key til GitHub
cat ~/.ssh/id_ed25519.pub
# Indsæt dette på github.com > Settings > SSH Keys

# Trin 3 – På en hvilken som helst server, kør dette
ssh-import-id-gh username

# Hvis du bruger Windows er trin 3 dette
mkdir $env:USERPROFILE\.ssh\
Invoke-WebRequest -Uri "https://github.com/username.keys" -OutFile "$env:USERPROFILE\.ssh\authorized_keys"

```

Det er det.
Ingen `scp`, ingen redigering af `.ssh/authorized_keys`, ingen ødelagte vaner.
