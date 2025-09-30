AdGuard Home giver dig præcis den “one-line wildcard”, du ønsker, mens Pi-hole’s UI stadig ikke kan. Tilføj blot en enkelt
wildcard DNS-rewrite i AdGuard Home, og alle hosts du opretter i Nginx Proxy Manager, vil automatisk resolve på LAN'et.

---

## Hvorfor AdGuard Home passer godt

| Feature                                           | AdGuard Home                                                                              | Pi-hole (nuværende UI)                                                                 |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Wildcard A/AAAA eller CNAME til intern zone**   | Native — GUI → **Filters → DNS Rewrites → Add**. Brug `*.intra.lan → 192.168.1.10` (eller en CNAME), og du er færdig.([GitHub][1]) | Ikke eksponeret. Du skal lægge manuelle `address=/intra.lan/192.168.1.10`-linjer i `/etc/dnsmasq.d/` eller bruge regex-tricks; ingen GUI-support.([Pi-hole Userspace][2]) |
| **Specifikke host-overrides**                     | Eksplícitte entries slår wildcard automatisk (`nas.intra.lan` vinder over `*.intra.lan`).([Reddit][3]) | Samme filbaserede workaround-metode; stadig manuelt.                                    |
| **Ad/tracker blocking, klientstatistik, DoH/DoT** | Indbygget                                                                               |                                                                                         |
| **Auto-udsted intern TLS (valgfrit)**             | Håndteres stadig af Nginx Proxy Manager (fx intern ACME eller egen CA).                 |                                                                                         |

AdGuard Home fik wildcard-support tilbage i 0.104 (slut 2019) og har det nu både i YAML-konfigurationen (`rewrites:`) og i web-UI'et.([GitHub][4], [AdGuard DNS — ad-blocking DNS server][5])

---

## Engangs-setup

1. **Installer AdGuard Home** på Ubuntu 22.04 “border”-VM'en

   ```bash
   curl -sSL https://raw.githubusercontent.com/AdguardTeam/AdGuardHome/master/scripts/install.sh | sudo bash
   ```

   (eller kør den i Docker, hvis du foretrækker det).

2. **Kør web-guiden** (`http://<vm-ip>:3000`) → vælg

   * *Upstream DNS*: den recursive resolver du foretrækker.
   * *Listening interfaces*: kun LAN (lad WAN være lukket).

3. **Tilføj wildcard-reglen**
   *UI → Filters → DNS Rewrites → Add*

   ```
   Domain : *.intra.lan
   Answer : 192.168.1.10        # reverse-proxy VM'ens LAN-IP
   ```

   Gem. Denne ene entry dækker **hver** fremtidig `something.intra.lan`.

4. **(Valgfrit) undtagelser**
   Hvis en host skal pege et andet sted hen, tilføjer du blot endnu en rewrite:

   ```
   nas.intra.lan  → 192.168.1.30
   ```

   Den specifikke host-record overstyrer wildcard automatisk.([Reddit][3])

5. **Peg LAN-klienter mod AdGuard Home**

   * DHCP-option – sæt DNS til VM'ens IP
   * Eller skub via router, hvis den kører i kanten.

6. **Nginx Proxy Manager**

   * Opret et proxy host `newapp.intra.lan` i NPM.
   * Ingen DNS-arbejde nødvendigt; wildcardet løser det allerede.
   * For TLS på LAN'et kan du:

     * Bruge din egen interne CA og lade NPM hente certifikater derfra; eller
     * Springe TLS over og bruge HTTP, hvis netværket er betroet.

---

## Hvis du **skal** blive på Pi-hole

Pi-hole's kerne-`dnsmasq` **kan** lave samme wildcard, men du skal røre filsystemet:

```bash
echo 'address=/intra.lan/192.168.1.10' | sudo tee /etc/dnsmasq.d/45-wildcard.conf
pihole restartdns
```

Ingen GUI, ordrehåndtering eller per-host override; derfor skifter de fleste homelabbere til AdGuard Home til netop denne use-case.([Pi-hole Userspace][2])

---

### TL;DR

* Implementér **AdGuard Home** (lille, single-binary).
* Tilføj én DNS-rewrite: `*.intra.lan → <proxy-IP>`.
* Peg DHCP mod AdGuard Home og glem DNS – hver ny vhost du tilføjer i Nginx Proxy Manager fungerer bare.

[1]: https://github.com/AdguardTeam/Adguardhome/wiki/Configuration "Configuration · AdguardTeam/AdGuardHome Wiki · GitHub"
[2]: https://discourse.pi-hole.net/t/support-wildcards-in-local-dns-records/32098 "Support wildcards in local DNS records - Feature Requests - Pi-hole Userspace"
[3]: https://www.reddit.com/r/AdGuardHome/comments/12bhyok/order_of_dns_rewrites/ "Order of DNS rewrites : r/AdGuardHome"
[4]: https://github.com/AdguardTeam/AdGuardHome/issues/1547?utm_source=chatgpt.com "DNS Rewrites: support wildcard domain name exceptions #1547"
[5]: https://adguard-dns.io/kb/general/dns-filtering-syntax/ "DNS filtering rules syntax | AdGuard DNS Knowledge Base"
