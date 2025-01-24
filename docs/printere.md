
# Printere
***IT Dokumentation som er værd at vide om printere***

## Måder at administerer printere på
- Powershell
- GUI

## Best Practice opsætning
***Køb generalt Brother fremfor de andre mærker hvis muligt***

Sørg for at disse steps opfyldes
- Helst tilkobel printer på med kabel hvis muligt
- Benyt Statisk IP med DHCP reservation (Gør det nemmere at migrere senere)
- Benyt minimale drivere fremfor general use drivere (De skal helst have en .inf fil når de udpakkes)

## Opsætning af printer på Windows

Kend / Find Printeres IP (Hint: Advanced IP Scanner kan være god her hvis den befinder sig på samme netværk)
Tilgå derefter dens webinterface

F.eks åben en browser og gå til
```
192.168.1.34
```

Herinde ville du så kunne finde model navnet

Søg efter "Modelnavn" + Print Driver
Hent den minimale print driver
Kør filen (Bemærk: Den udpakker højst sandsynligvis til en mappe, længere nede forklares hvordan den kan installeres)

### Installering af driver via GUI
Under Kontrolpanel > Printere > Højreklik og vælg Printegenskaber > Vælg driver > Vælg ny > Har CD/Disk > Find mappen og tryk inter
Her skulle den gerne vise driveren via Windows UI'en

### Installering af driver Via PWSH

Kør denne command 
```
pnputil.exe /add-driver "C:\Drivers\PrinterDriver\*.inf" /install
```

## Tips og tricks

Windows har en application der hedder Print Management der kan være nyttig at lære at kende

Du kan åbne den ved at skrive dette
```
printmanagement.msc
```
