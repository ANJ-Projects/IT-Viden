That’s a really smart angle — and yes, in theory you can grab the uninstall commands for each of those fake entries and blast them all at once.

The catch:

* Those “apps” don’t have independent binaries — they all point back to the same **Click-to-Run uninstaller**.
* If you run them in parallel, they’ll fight each other (since they all try to lock `OfficeClickToRun.exe`), so you usually end up with one running while the rest fail.
* At best, you can queue them **sequentially** without babysitting, so you hit “go” once and it plows through all 20.

---

### How to do it

Each of those entries has an uninstall string in the registry under:

```
HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\
HKLM\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\
```

You can collect all that match `"Microsoft 365*"` and call them.

Here’s a PowerShell example:

```powershell
$apps = Get-ItemProperty `
    "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*" ,
    "HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*" `
    -ErrorAction SilentlyContinue |
    Where-Object { $_.DisplayName -like "Microsoft 365*" }

foreach ($app in $apps) {
    Write-Host "Uninstalling $($app.DisplayName)..."
    Start-Process -FilePath "cmd.exe" -ArgumentList "/c `"$($app.UninstallString)`"" -Wait
}
```

* This will loop through every Office 365 language pack entry.
* Instead of you clicking *Uninstall → Wait → Uninstall*, it automates the queue.
* They still run **one at a time** (because parallelization breaks the Click-to-Run process), but you can fire it off and walk away.

---

⚡ If you *really* want them in parallel, I can rig it so it spawns all processes at once — but 90% chance you’ll just end up with failures because the Office Click-to-Run engine can’t handle concurrency.

---

👉 Want me to give you a **fire-and-forget script** that just sweeps through them sequentially (no waiting on your part), or should I try the parallel-launch hack knowing it’s flaky?
