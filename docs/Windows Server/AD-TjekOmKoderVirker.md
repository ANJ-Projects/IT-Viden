
# Tjek om en Active Directory Bruger/Adgangskode virker

Denne guide viser forskellige måder at validere om et AD-brugernavn og password fungerer.
Det er nyttigt efter en ny bruger er oprettet, ved fejlmeldinger om login, eller hvis man bare vil sanity-checke credentials.

---

## Hurtig test via .NET DirectoryEntry

Bruger indbyggede .NET klasser til at forsøge et login.

```powershell
$username = "DOMAIN\BrugerNavn"
$password = "Hemmelig123"

new-object directoryservices.directoryentry "",$username,$password
```

✅ Hvis koden returnerer et objekt uden fejl → password er OK.
❌ Hvis du får en exception → password er forkert eller kontoen er spærret/udløbet.

---

## Test med `Get-ADUser`

Her kan man lade PowerShell selv spørge efter credentials:

```powershell
Get-ADUser -Identity BrugerNavn -Credential (Get-Credential)
```

Indtast domæne-brugernavn og password i prompten.
✅ Returnerer brugerobjekt → login virker.
❌ Fejl: *“Logon failure: unknown user name or bad password”* → password forkert.

---

## Alternativ: Brug `Test-ComputerSecureChannel`

Hvis du tester maskinens domænetrust samtidig:

```powershell
Test-ComputerSecureChannel -Credential (Get-Credential)
```

Returnerer `True` hvis login og trust er OK.

---

## Tjek status for bruger

Nyttigt at se om kontoen **i det hele taget kan logge på**:

```powershell
Get-ADUser BrugerNavn -Properties Enabled, PasswordExpired, LockedOut, LastLogonDate |
Select-Object SamAccountName, Enabled, PasswordExpired, LockedOut, LastLogonDate
```

* **Enabled** = Konto er aktiv.
* **PasswordExpired** = Skal skifte password ved næste login.
* **LockedOut** = Konto er låst.

---

## Simuler logon via `runas`

Hurtig manuelt test uden PowerShell:

```cmd
runas /user:DOMAIN\BrugerNavn cmd
```

Hvis password er forkert → prompten dukker bare op igen.
Hvis password er rigtigt → ny CMD åbner i brugerens kontekst.

---

## Typiske fejlårsager at checke

* Konto er **locked out** pga. for mange forsøg.
* Password er **udløbet**.
* Bruger forsøger at logge på en maskine hvor **LogonWorkstation** restriktion er sat.
* Forkert domæne: husk `DOMAIN\username` eller `username@domain.local`.


