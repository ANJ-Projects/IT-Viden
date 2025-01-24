
# Printere
* IT Dokumentation som er værd at vide om printere *

## Måder at administerer printere på
- Powershell
- GUI
	- 

## Best Practice opsætning
* Køb generalt Brother fremfor de andre mærker hvis muligt *

Sørg for at disse steps opfyldes
- Kobel printer på med kabel
- Benyt Statisk IP med DHCP reservation (Gør det nemmere at migrer senere)
- Hent minimale drivere (De skal helst have en .inf fil der udpakkes)


## Opsætning af printer på Windows

Med IP, gå til dens webinterface
Noter navn ned

Søg efter "Printernavn" + Print Driver
Hent den minimale print driver

Kør filen (Den skulle gerne udpakke til en mappe)

### Via GUI
Under Kontrolpanel > Printere > Højreklik og vælg Printegenskaber > Vælg driver > Vælg ny > Har CD/Disk > Find mappen og tryk inter
Her skulle den gerne vise driveren via Windows UI'en

### Via PWSH

Kør denne command 
```
pnputil.exe /add-driver "C:\Drivers\PrinterDriver\*.inf" /install
```
