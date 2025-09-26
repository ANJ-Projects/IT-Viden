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

You’re very close with that one 👍 — but a couple of details will bite you if you run it as-is:

---

### Issues in that snippet

1. **Registry coverage** → You’re only checking `HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*`.

   * Many Office C2R stubs live under `WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall` too.
   * So you’ll miss half the entries unless you query both.

2. **Argument handling** →

   ```powershell
   $UninstallArg = ($UninstallString -split '"')[2] + " DisplayLevel=False"
   ```

   * This assumes the uninstall string *always* looks like `"C:\path\to\setup.exe" /config something.xml`.
   * But some Click-to-Run entries are structured differently (some even don’t have quotes).
   * That split can throw an out-of-range error or build a broken arg list.

3. **Silent flag** → Adding `DisplayLevel=False` doesn’t always work. For Click-to-Run, you need `/quiet` or the right XML `<Display Level="None" />`.

---

### A safer approach

Here’s a hardened version:

```powershell
$uninstallKeys = @(
    "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*",
    "HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*"
)

$officeApps = Get-ItemProperty $uninstallKeys -ErrorAction SilentlyContinue |
    Where-Object { $_.DisplayName -like "*Microsoft 365*" -or $_.DisplayName -like "*Office 365*" }

foreach ($app in $officeApps) {
    $uninstallString = $app.UninstallString
    if ($null -ne $uninstallString) {
        Write-Host "Uninstalling $($app.DisplayName)..."

        # Split exe and arguments safely
        $exe, $args = $uninstallString -replace '^\s*','' -split '\s+',2
        # Force quiet if possible
        if ($args) {
            $args = "$args DisplayLevel=False"
        } else {
            $args = "DisplayLevel=False"
        }

        Start-Process -FilePath $exe -ArgumentList $args -Wait
    }
}
```

---

### What this does

* Sweeps *both* 32-bit and 64-bit uninstall registry hives.
* Matches `"Microsoft 365"` and `"Office 365"` product names.
* Splits uninstall string more defensively (doesn’t assume quotes).
* Forces `DisplayLevel=False` where possible, so you shouldn’t have to click Next/Finish.

---

⚠️ Reality check: Some of the stubs ignore `DisplayLevel=False` and *still* show a GUI wizard (that’s just how the Click-to-Run client behaves). But with this loop, at least it chains through them all sequentially — no babysitting.

---

👉 Do you want me to modify it so it **logs results to a file** (success/failure per language pack), so you can push it via RMM and get a report instead of guessing what got removed?
