
# Tilknyt netværksdrev på macOS

## Forudsætninger
- macOS 11 (Big Sur) eller nyere  
- Netværks‑share tilgængelig via **SMB**  
- Brugernavn + adgangskode med adgang til share

---

## 1. Åbn **Connect to Server** i Finder
1. Åbn **Finder**.  
2. Tryk **⌘ K** *eller* vælg **Go ▸ Connect to Server…**.  
3. Indtast stien – husk **forward slash**:
   ```text
   smb://servernavn/sharenavn
   ```
   > Brug **/** (forward slash) mellem segmenterne – *ikke* `\` som i Windows.  
4. Klik **Connect** → vælg **Registered User** → indtast legitimation.

---

## 2. Gem & genåbn share automatisk
- Marker **Remember this password in my keychain** hvis login må gemmes.  
- Når sharet er monteret, gør én af disse:
  - **Højreklik** på drevikonet på Dock → **Options ▸ Open at Login**.  
  - Gå til System Settings ▸ Users & Groups ▸ Login Items**  
    1. Klik **+**.  
    2. Vælg drevet under **Locations**.  
    3. Klik **Add**.

---

## 3. Når Keychain gør at drev login driller
Statiske eller forældede adgangskoder blokerer ofte forbindelsen.

1. Åbn **Keychain Access** (`/Applications/Utilities`).  
2. Vælg **Passwords** i sidepanelet.  
3. Søg på servernavn/IP.  
4. Slet (⌫) eller opdatér de matchende poster.  
5. Forbind igen via **⌘ K** og indtast korrekte oplysninger.

---

## 4. Fejlfinding

| Symptom                              | Sandsynlig årsag                 | Hurtig løsning                              |
|--------------------------------------|----------------------------------|---------------------------------------------|
| **“Connection failed”**              | Backslash eller forkert protokol | Brug `smb://` + **/** mellem alle navne     |
| Share forsvinder efter genstart      | Ikke sat til autostart           | Tilføj under **Login Items** (trin 2)       |
| Gentagne login‑prompter              | Stale Keychain‑post              | Ryd/ret nøgler (trin 3)                     |
| Manglende skrive‑/læserettigheder    | Server‑tilladelser               | Kontroller SMB‑rettigheder på serveren      |

---

## 5. Tips & genveje
- Finder viser monterede drev under **Locations**; Terminal viser dem i **/Volumes**.  
- Hurtig mount i Terminal:
  ```bash
  open smb://brugernavn@server/sharenavn
  ```
- Afmonter med **⌘ E** i Finder eller:
  ```bash
  diskutil unmount "/Volumes/sharenavn"
  ```
