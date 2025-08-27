
# 📝 Ticket Status'er & Betegnelser (Non-Actionable / Special Cases)

### **Pending Customer / Awaiting Customer Input**

Sagen er sat på pause, fordi man venter på svar eller yderligere information fra brugeren.  
➡ Bruges når der mangler logs, screenshots, konkrete tidspunkter eller adgang til en maskine.

---

### **Cannot Reproduce**

Problemet er meldt, men kan ikke genskabes i systemet, og ingen logs/fejlspor understøtter det.  
➡ Ticket lukkes med mulighed for genåbning, hvis problemet opstår igen med dokumentation.

---

### **No Fault Found (NFF)**

Der er undersøgt, men systemer og logs viser alt OK. Bruger har oplevet noget, men der findes ingen fejl.  
➡ Typisk “spøgelsesfejl” eller enkeltstående hændelse.

---

### **User Error / Misconfiguration**

Problemet skyldes forkerte oplysninger, gamle credentials, tastefejl eller forkert brug af systemet.  
➡ Lukket efter bruger er instrueret eller rettet i konfigurationen.

---

### **User Miscommunication / Misreported Issue**

Brugerens beskrivelse stemmer ikke med det faktiske problem, eller de “hallucinerer” en fejl.  
➡ Dokumentér: “Bruger oplyser X, men logs viser Y.” Ticket lukkes eller venter på præcisering.

---

### **Working as Intended (WAI)**

Systemet opfører sig præcis som konfigureret – selvom brugeren oplever det som en fejl.  
➡ Eksempel: konto låser efter 3 mislykkede forsøg iht. password policy.

---

### **By Design**

Samme som WAI, men ofte brugt når en funktionalitet er specifikt defineret af leverandør/udvikler.  
➡ Eksempel: kodeord udløber efter 60 dage, fordi det er sat sådan.

---

### **Policy Restriction**

Problemet skyldes en bevidst beslutning i virksomhedens sikkerheds- eller governance-politik.  
➡ Eksempel: aggressiv password policy, krav om MFA, begrænsede loginforsøg.

---

### **Out of Scope**

Sagen ligger udenfor jeres ansvarsområde eller supportaftale.  
➡ Eksempel: privat udstyr, tredjepartssoftware, internetforbindelser uden for jeres drift.

---

### **Environment Limitation**

Problemet findes, men er forårsaget af faktorer i brugerens miljø, som I ikke kan ændre.  
➡ Eksempel: dårlig Wi-Fi, ustabil VPN pga. 2G forbindelse, strømudfald.

---

### **Unsupported Scenario**

Bruger forsøger at bruge systemet i et setup, der aldrig er tænkt understøttet.  
➡ Eksempel: køre tung Citrix-session på 2G net, eller installere software på gammel OS-version.

---

### **Closed – Incomplete Information**

Bruger har ikke leveret tilstrækkelige oplysninger, selv efter efterspørgsel.  
➡ Ticket lukkes, men kan genåbnes ved ny info.

---

### **User Abandoned**

Bruger svarer aldrig tilbage, eller stopper midt i sagen.  
➡ Ticket lukkes efter SLA/eskalationstid, typisk med standardtekst: “Lukket pga. manglende tilbagemelding.”

---

### **Closed – Not a Defect**

Brugt i software/bug tracking, men også i IT: det indmeldte problem er ikke en egentlig fejl.  
➡ Eksempel: funktion virker som specificeret.

---

### 🔹 Eksempeltekst til ticket

> **Status:** Vendor Limitation
> **Kommentar:** Produktet opfører sig som dokumenteret af leverandøren, men opleves som ustabilt og lever ikke op til forventningerne. Dette er en begrænsning i produktet, ikke en fejl i vores miljø.
> Ticket lukkes. Kan genåbnes, hvis leverandøren udgiver en rettelse.

🔹 Best Practice

* **Dokumentér objektivt** (fx version, build, logs).
* **Henvis til vendor** (ticket, knowledge base, release note).
* **Brug neutral framing** → aldrig “produktet er dårligt”, men “leverandøren understøtter ikke dette scenarie”.
* **Afslut professionelt** → “Kan ikke afhjælpes herfra, venligst kontakt leverandørens support/produktteam”.

⚡ Kort sagt: du giver brugeren en **professionel sandhed**, placerer ansvaret hos vendor og undgår at jeres servicedesk fremstår inkompetent.


⚡ **Tip til implementering i servicedesk:**

* Hold listen kort i systemet (3-5 statusser), men brug disse som **interne retningslinjer**.
* Dokumentér altid neutralt → aldrig “det er brugerens skyld”, men “ingen fejl fundet” / “arbejder som designet”.
* Giv altid mulighed for genåbning → så er man professionel og viser, at man ikke bare lukker for at slippe.

---

### 🔹 Betegnelser hvor at software ikke virker som reklameret

1. **Vendor Limitation**  
   Bruges når fejlen kan spores til et produkt eller leverandør, men ikke kan fixes af jer.  
   ➡ “Begrænsning i leverandørens produkt. Kan ikke løses internt.”

2. **Known Issue**  
   Når vendor *har* anerkendt problemet (men uden fix).  
   ➡ “Fejlen er kendt hos leverandøren, men der findes ingen rettelse pt.”

3. **Product Limitation / By Design (Vendor)**  
   Når leverandøren siger, at det er designet sådan – selvom det opleves som fejl.  
   ➡ “Funktionaliteten virker som leverandøren har defineret den, men ikke som forventet af brugeren.”

4. **Vendor Dependency**  
   Bruges til at markere, at løsningen afhænger af en tredjeparts vendor.  
   ➡ “Afventer afklaring fra leverandør. Ticket lukkes midlertidigt.”

5. **Expectation Gap** *(uofficiel, men meget brugt i MSP’er)*  
   Når produktet markedsfører noget, som ikke matcher virkeligheden.  
   ➡ “Brugerens forventninger overstiger leverandørens faktiske funktionalitet.”

---
