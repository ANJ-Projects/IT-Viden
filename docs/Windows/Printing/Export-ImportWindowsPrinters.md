
# Export & Import Windows Printers via printbrmui

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

This is better than half the “enterprise” print management tools out there. 🤷‍♂️

---

