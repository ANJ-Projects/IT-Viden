# Citrix – ren geninstallation

Denne vejledning forklarer, hvordan du foretager en fuldstændig geninstallation af **Citrix Workspace App** på Windows. Metoden fjerner rester fra tidligere installationer, så du ikke behøver at afinstallere programmet manuelt.

1. Download den seneste `CitrixWorkspaceApp.exe` fra Citrix.
2. Åbn **CMD**. Hvis du befinder dig i PowerShell, skriv `cmd` og tryk *Enter*.
3. Naviger til mappen hvor installationsfilen ligger.
4. Kør installationen med parameteren `/CleanInstall`:

   ```cmd
   CitrixWorkspaceApp.exe /CleanInstall
   ```

Installationsprogrammet rydder nu alle tidligere installationer og gennemfører en ren opsætning. Når processen er færdig, kan du starte Citrix som normalt.

