
## 💼 Bærbar PowerShell-profil (portable profile)

Målet: Du har en PowerShell-konfiguration på GitHub og kan til enhver tid hente og loade den uden at ændre din `$PROFILE`.

---

### 📁 Struktur i dit repo (eksempel):

```
my-powershell-profile/
├── profile.ps1
├── modules/
│   └── MyCustomModule/
└── scripts/
    └── useful-functions.ps1
```

---

### ⚙️ Hente og bruge din profil uden at installere noget

```powershell
# Sæt base URL til dit GitHub-repo
$baseUrl = "https://raw.githubusercontent.com/youruser/my-powershell-profile/main"

# Hent din midlertidige profil
Invoke-WebRequest "$baseUrl/profile.ps1" -OutFile "$env:TEMP\portable-profile.ps1"

# Importér midlertidig profil (engangsbrug i denne session)
. "$env:TEMP\portable-profile.ps1"
```

---

### 💡 Tip: Lav en `bootstrap.ps1`

Denne kan ligge i repo'et og bruges til hurtigt at hente og indlæse profilen:

```powershell
# bootstrap.ps1
$baseUrl = "https://raw.githubusercontent.com/youruser/my-powershell-profile/main"

# Load selve profilscriptet
Invoke-WebRequest "$baseUrl/profile.ps1" -OutFile "$env:TEMP\portable-profile.ps1"
. "$env:TEMP\portable-profile.ps1"
```

Brug derefter:

```powershell
irm https://raw.githubusercontent.com/youruser/my-powershell-profile/main/bootstrap.ps1 | iex
```

---

### 🧠 Hvorfor bruge en portabel profil?

* Du kan tage dine aliaser, funktioner, moduler m.m. med dig overalt.
* Kræver ikke ændring af `$PROFILE`.
* Ideelt i locked-down miljøer eller ved test på andres maskiner.
* Let at vedligeholde gennem GitHub.

---

### ✅ Eksempel: Indhold i `profile.ps1`

```powershell
# profile.ps1
Write-Host "🔧 Indlæser portabel profil..."

Set-Alias ll Get-ChildItem
function gpoedit { gpmc.msc }

# Automatisk import af brugerdefinerede moduler
$modulePath = "$PSScriptRoot\modules"
if (Test-Path $modulePath) {
    $env:PSModulePath += ";$modulePath"
    Get-ChildItem $modulePath -Directory | ForEach-Object {
        Import-Module $_.FullName -Force
    }
}
```

---

Sig til hvis du vil have hjælp til at sætte repoet op med `scripts/`, `modules/` og en klar `bootstrap.ps1` – eller hvis du vil inkludere støtte til forskellige shells (f.eks. Windows PowerShell vs. PowerShell Core).
