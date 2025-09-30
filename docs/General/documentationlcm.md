# MSP- og IT-helpdesk dokumentationslivscyklus
**"MSP and IT Helpdesk Documentation Lifecycle"** er helt klart en *ting*—selv hvis det ikke altid er formaliseret under det navn. Det, du rører ved, er en meget reel udfordring i managed service- og interne IT-miljøer: **at finde balancen mellem over-dokumentation og under-dokumentation**.

### 🔄 Dokumentationslivscyklussen (MSP/helpdesk-kontekst)

Her er en kondenseret version af, hvordan en praktisk **Documentation Lifecycle** ser ud i MSP- og IT-helpdesk-drift:

1. **Identify**

   * Hvad skal dokumenteres?
     → Systemer, credentials, procedurer, kontaktdata, vendors, configs, backups, licenser osv.

2. **Create**

   * Brug skabeloner hvor det giver mening.
   * Hold det kort og præcist (især til teknikere under pres).

3. **Review & Validate**

   * Sørg for, at det er teknisk korrekt og brugbart.
   * Undgå "rote"-trin medmindre det er nødvendigt for niche- eller legacy-ting.

4. **Distribute / Store**

   * Centraliseret system: ITGlue, Hudu, Confluence, SharePoint, OneNote (til mindre ops) osv.
   * Adgangskontrol: Hvem må læse, hvem må skrive.

5. **Use & Update**

   * Docs skal bruges under tickets, onboarding, projekter.
   * Genbesøg ofte brugte docs hver 3.–6. måned.
   * Tilføj version-/dato-headere for at undgå zombie-info.

6. **Archive / Decommission**

   * Er en kunde offboardet? Legacy-system fjernet? Pensionér dokumentet.

---

### 🧠 Less is More

Du har helt ret:

> “Too much information can be just as bad as barely any.”

Et godt dokument skal:

* Passe på én skærm, hvis muligt
* Bruge bullet points, ikke lange afsnit
* Indeholde:

  * **Essential data** (IP, port, login, licensing, renewal date)
  * **"Gotchas"** (fx “Genstart service X, ellers virker config ikke”)
  * **Links** til dybere info efter behov

---

### 📦 Hvad skal dokumenteres fuldt?

Kun det der er:

* **Non-obvious**
* **Non-Googlable**
* **Business-critical**
* **Client-specific**

**Eksempler:**

* Et internt LOB-system skrevet i 2009
* En printerkonfiguration der bryder sammen, hvis SNMP ikke er slået fra
* En VPN der kun virker, hvis client ID sættes til en bestemt streng

---

### 📌 Tips til effektive MSP/helpdesk-docs

* Lav **“One-Pagers”** pr. system/kunde
* **Standardisér navngivning** og tagging
* Brug **skærmbilleder** sparsomt
* Tilføj **TL;DR**-sektioner i toppen
* Dokumentér ikke det **åbenlyse** (“Klik File > Save As” er spild af tid for en tech)
* Antag til How-Tos, at læseren er **IT-kompetent**, men ikke kender netop dette setup
