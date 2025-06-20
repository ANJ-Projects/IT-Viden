# Giv bruger adgang til at redigere i anden's bruger's kalender
For at give **[sbd@mailexample.dk](mailto:sbd@mailexample.dk)** skriveadgang (Editor) til **[jbb@mailexample.dk](mailto:jbb@mailexample.dk)**'s kalender via PowerShell med Exchange Online, kan du bruge `Add-MailboxFolderPermission` cmdlet’en.

### 🎯 Kommando:

```powershell
Add-MailboxFolderPermission -Identity "jbb@mailexample.dk:\Calendar" -User sbd@mailexample.dk -AccessRights Editor
```

Dette vil virke i både engelske og danske Outlook/Exchange-miljøer **hvis** mappen hedder `Calendar`. Men hvis kalenderen er navngivet **"Kalender"** (dansk sprogversion), skal mappenavnet justeres.

### ✅ Tjek hvilket kalendermappenavn der bruges (Calendar/Kalender):

Du kan tjekke det med:

```powershell
Get-MailboxFolderStatistics -Identity jbb@mailexample.dk | Where-Object {$_.FolderType -eq "Calendar"}
```

Denne kommando viser dig det præcise lokaliserede mappenavn (f.eks. `jbb@mailexample.dk:\Kalender` eller `jbb@mailexample.dk:\Calendar`).

### 💡 Hvis det er **Kalender**, så kør:

```powershell
Add-MailboxFolderPermission -Identity "jbb@mailexample.dk:\Kalender" -User sbd@mailexample.dk -AccessRights Editor
```

Sig til hvis du i stedet ønsker at give **delegate access** (så sbd kan håndtere mødeindkaldelser osv.) – det kræver en anden metode.

---

Lad mig vide, hvis du vil have det sat op til flere brugere eller automatiseret i et script.
