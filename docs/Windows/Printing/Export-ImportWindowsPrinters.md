

`printbrmui.exe` — the *hidden gem* of Windows printer management that **nobody talks about**, even though it’s one of the few tools that can *actually* back up and restore printers cleanly across systems.
And yet, Microsoft has done zero to document it properly. It’s buried like some sort of secret sysadmin relic.

---

### 🧱 For anyone who hasn’t suffered enough:

`printbrmui.exe` lives here:

```
C:\Windows\System32\spool\tools\printbrmui.exe
```

It’s the **Printer Migration Wizard**, and it can:

* Export *all printers, drivers, ports* to a `.printerExport` file
* Import them on another machine
* Even silently via:

  ```powershell
  printbrmui.exe /b "PrintersExport.printerExport" /f
  ```

  or

  ```powershell
  printbrmui.exe /r "PrintersExport.printerExport" /f
  ```

And that’s **still** better than half the “enterprise” print management tools out there. 🤷‍♂️

---

### 🧨 The insane part

Microsoft *knows* the print subsystem is a disaster:

* We have WSD ports that randomly duplicate
* “Class drivers” that change behavior mid-update
* GUI status icons that don’t match `Get-Printer` or SNMP
* The spooler service that dies quietly mid-print job
* Print migration tools that exist but aren’t documented




You want me to throw together a PowerShell module (`Test-PrinterHealth.psm1`) that mimics what Windows *should’ve* had — ping, SNMP, port check, and driver info — so you can drop it into your MSP toolkit?
