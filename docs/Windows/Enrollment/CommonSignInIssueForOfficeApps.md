# Outlook/Teams loginfejl efter "Lad organisationen administrere denne enhed"

## Indholdsfortegnelse
1. [Oversigt over problemet](#1-oversigt-over-problemet)
2. [Symptomer](#2-symptomer)
3. [Hurtig løsning (til brugerens PC)](#3-hurtig-løsning-til-brugerens-pc)
4. [Forebyggelse af problemet](#4-forebyggelse-af-problemet)
5. [Årsagen til problemet (teknisk forklaring)](#5-årsagen-til-problemet-teknisk-forklaring)
6. [Langsigtede løsninger](#6-langsigtede-løsninger)
7. [Tjekliste til fejlfinding](#7-tjekliste-til-fejlfinding)
8. [Anbefalinger til IT-afdelinger](#8-anbefalinger-til-it-afdelinger)

---

## 1. Oversigt over problemet
Når en bruger logger ind i Outlook eller Teams på en **Active Directory (AD)-joined Windows PC**, bliver de nogle gange mødt med en prompt:

> "Vil du lade din organisation administrere denne enhed?"

Hvis brugeren klikker **Ja**, oprettes en **Azure AD-registrering (Workplace Join)**, som konflikter med den eksisterende AD-identitet. Dette medfører:
- Loginfejl i Office-apps
- Sign-in loops
- Krav om ny aktivering i Word/Excel

---

## 2. Symptomer

| App     | Fejlbeskrivelse                             | Fejlmeddelelser              |
|---------|---------------------------------------------|------------------------------|
| Outlook | Viser "Adgangskode nødvendig" konstant       | "Disconnected", "Need password" |
| Teams   | Loop ved login                              | Fejlkode 80070003, 801c0003  |
| Word    | Skal aktiveres igen og igen                 | "Sign in to activate"        |

---

## 3. Hurtig løsning (til brugerens PC)

### Trin 1: Fjern Entra-registreringen
Gå til:
- **Indstillinger → Konti → Adgang til arbejde eller skole**
- Vælg den arbejdskonto og klik på **Fjern** / **Kobl fra**

Eller kør følgende PowerShell via RMM (f.eks. NinjaRMM):
```powershell
# Fjern AAD-registrering
Start-Process -FilePath dsregcmd -ArgumentList "/leave" -Wait
```

### Trin 2: Genstart PC'en
Dette sikrer at cached tokens bliver fjernet.

### Trin 3: Brugeren logger ind igen
Når brugeren åbner Office-apps:
- De bliver bedt om at logge ind igen
- **Klik "Nej, log kun ind på denne app"**

✅ Dette genskaber normal funktionalitet uden at forsøge enhedshåndtering.

---

## 4. Forebyggelse af problemet

### Mulighed A: Bloker fremtidige prompts via registreringsdatabasen
Deploy dette via Group Policy eller script:
```reg
[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\WorkplaceJoin]
"BlockAADWorkplaceJoin"=dword:00000001
```

Alternativt via PowerShell:
```powershell
New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WorkplaceJoin" -Force | Out-Null
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WorkplaceJoin" -Name "BlockAADWorkplaceJoin" -Value 1 -Type DWord
```

### Mulighed B: Informer brugere
- Lav en informationskampagne: "Klik altid NEJ til enhedsadministration"
- Overvej bannere, emails eller popup-notifikationer

---

## 5. Årsagen til problemet (teknisk forklaring)

Når Office 365 apps ikke kan få en **Primary Refresh Token (PRT)**, forsøger de at få adgang via AAD-registrering.

Hvis PC'en kun er AD-joined (og ikke Hybrid-joined), og **Conditional Access** kræver enten:
- "Compliant device"
- "Hybrid Azure AD join"

…så kan Office ikke logge ind og foreslår enhedshåndtering.

Hvis brugeren klikker **Ja**, registreres enheden i Azure AD, men dette skaber en konflikt, da den allerede er i Active Directory. Resultatet: fejlslagne tokens og login loops.

---

## 6. Langsigtede løsninger

### Mulighed A: Hybrid Azure AD Join
- Brug Azure AD Connect
- Opsæt GPO til automatisk registrering i Azure AD
- Så er enheder allerede godkendt — ingen prompts

### Mulighed B: Brug Conditional Access uden enhedskrav
Hvis I ikke har Intune eller AAD Join:
- Fjern kravet om "Compliant device" i Conditional Access
- Brug kun MFA + lokationsbaseret adgang

### Mulighed C: Rul Intune MDM korrekt ud
- Sørg for licenser (f.eks. M365 Business Premium)
- Opsæt Device Compliance policies
- Brug Enrollment restrictions for at styre hvem der må registrere sig

---

## 7. Tjekliste til fejlfinding

✅ Kør `dsregcmd /status` for at tjekke:
- AzureAdJoined: NO
- DomainJoined: YES
- DeviceAuthStatus: NOT_AUTHENTICATED

✅ Tjek Entra portal (entra.microsoft.com):
- Se efter dobbeltregistreringer under "Devices"
- Slet forældede eller forkerte Workplace Joined entries

✅ Kontroller Conditional Access:
- Gå til Entra Admin → Security → Conditional Access
- Se hvilke policies der kræver compliant/hybrid joined devices

---

## 8. Anbefalinger til IT-afdelinger

| Tiltag | Beskrivelse |
|--------|-------------|
| Blokér AAD Workplace Join | Via reg nøgle eller GPO |
| Evaluer Conditional Access | Brug MFA i stedet for enhedskrav |
| Planlæg Hybrid Join | For langtidsholdbar løsning |
| Overvåg devices i Entra | Slet forældede entries, undgå konflikter |
| Træn brugere | Gør det klart, hvad de skal vælge ved login |

---
