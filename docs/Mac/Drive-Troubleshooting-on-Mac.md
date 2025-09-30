# Fejlfinding af drevadgang på Mac
macOS monterer gerne et SMB-share og viser den øverste mappestruktur, selv hvis de underliggende NTFS-tilladelser ikke faktisk giver dig adgang til alle undermapper. I praksis kan du ende med at være “mapped” (altså forbundet til sharet), men få “You don’t have permission to access that folder”, så snart du åbner en eller flere undermapper. De typiske syndere er:

1. **Share-level vs NTFS ACLs**
   - **Share permissions** på Windows-siden kan give din sikkerhedsgruppe Read (eller endda Change) på roden af sharet, så Mac'en kan montere og vise sharet.
   - **NTFS permissions** (ACLs på selve mapperne) gælder, når du prøver at åbne undermapper. Hvis gruppen ikke har mindst “Traverse folder / execute file” samt “List folder / read data” på en given mappe (eller hvis der ligger et eksplicit Deny), bliver du blokeret.

2. **Stale credentials eller Kerberos-ticket**
   - Hvis dit AD-gruppemedlemskab lige er ændret, opdaterer macOS ikke Kerberos-ticket før du logger ud (eller kører `kinit`) og
monterer igen. Du præsenterer måske stadig den “gamle” token uden den nye gruppe.
   - Finder kan via SMB-password i Keychain forbinde som en anden bruger (eller “Guest”), så dobbelttjek i **Keychain Access →
smb:server**, at de gemte credentials er korrekte, eller fjern posten og forbind igen som domænebrugeren.

3. **Explicit Deny eller brud på inheritance**
   - I Windows er det let at sætte et **explicit Deny** på en undermappe eller slå “Inherit from parent” fra, hvilket tilsidesætter Allow fra din gruppe. Et Allow på roden hjælper ikke, hvis der ligger et Deny længere nede.

---

### Sådan fejlfinder du på macOS

1. **Gennemtving et friskt mount med dine rigtige credentials**
   - I Finder: **Go → Connect to Server…**, og brug
     ```
     smb://DOMAIN;username@fileserver.example.com/ShareName
     ```
   - Indtast din adgangskode, når du bliver spurgt (lad den ikke falde tilbage til Guest).

2. **Forny din Kerberos-ticket**
   ```bash
   kdestroy
   kinit username@YOUR.DOMAIN
   ```
   Afmontér/remonter derefter sharet.

3. **Kontrollér effektive ACLs i Windows**
   - På filserveren: **Properties → Security → Advanced → Effective Access**, vælg din konto og bekræft hvilke tilladelser der
reelt bruges.

4. **Test fra Mac-terminalen**
   ```bash
   smbutil statshares -a
   ls -led /Volumes/ShareName/ProblemSubfolder
   ```
   `ls -led` viser de POSIX-tilladelser og eventuelle udvidede ACL-poster, som macOS ser; et “0” eller “drwx—” for din bruger
   betyder, at du reelt ikke har adgang.

---

#### Kort fortalt
macOS smelter ikke share-level og NTFS ACLs sammen til én samlet “må monteres eller ej”-test – den monterer først og håndhæver
derefter ACLs pr. mappe, når du navigerer. Du kan altså godt være i de rigtige AD-grupper til roden af sharet og alligevel få
permission denied i undermapper længere nede.
