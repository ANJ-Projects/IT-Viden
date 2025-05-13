AdGuard Home can give you exactly the “one-line wildcard” you want, while Pi-hole’s UI still can’t. Just add a single wildcard DNS-rewrite rule in AdGuard Home and every host you spin up in Nginx Proxy Manager will resolve automatically on the LAN.

---

## Why AdGuard Home is a good fit

| Feature                                           | AdGuard Home                                                                                                                 | Pi-hole (current UI)                                                                                                                                               |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Wildcard A/AAAA or CNAME for an internal zone** | Native — GUI → **Filters → DNS Rewrites → Add**. Use `*.intra.lan → 192.168.1.10` (or a CNAME) and you’re done.([GitHub][1]) | Not exposed. You’d have to drop manual `address=/intra.lan/192.168.1.10` lines into `/etc/dnsmasq.d/` or use regex tricks; no GUI support.([Pi-hole Userspace][2]) |
| **Specific host overrides**                       | Explicit entries beat the wildcard automatically (`nas.intra.lan` will win over `*.intra.lan`).([Reddit][3])                 | Same hack-around file-based method; still manual.                                                                                                                  |
| **Ad/tracker blocking, client stats, DoH/DoT**    | Built-in                                                                                                                     |                                                                                                                                                                    |
| **Auto-issue internal TLS (optional)**            | Still handled by Nginx Proxy Manager (e.g. internal ACME server or your own CA).                                             |                                                                                                                                                                    |

AdGuard Home added wildcard support back in 0.104 (late 2019) and it’s now part of both the YAML config (`rewrites:`) and the web UI.([GitHub][4], [AdGuard DNS — ad-blocking DNS server][5])

---

## One-time setup

1. **Install AdGuard Home** on the Ubuntu 22.04 “border” VM

   ```bash
   curl -sSL https://raw.githubusercontent.com/AdguardTeam/AdGuardHome/master/scripts/install.sh | sudo bash
   ```

   (or run it in Docker if you prefer).

2. **Run the web wizard** (`http://<vm-ip>:3000`) → choose

   * *Upstream DNS*: whatever recursive resolver you like.
   * *Listening interfaces*: LAN only (leave WAN closed).

3. **Add the wildcard rule**
   *UI → Filters → DNS Rewrites → Add*

   ```
   Domain : *.intra.lan
   Answer : 192.168.1.10        # the reverse-proxy VM’s LAN IP
   ```

   Save. That single entry covers **every** future `something.intra.lan`.

4. **(Optional) exceptions**
   If you need one host to point elsewhere, just add another rewrite:

   ```
   nas.intra.lan  → 192.168.1.30
   ```

   The specific host record overrides the wildcard automatically.([Reddit][3])

5. **Point your LAN clients at AdGuard Home**

   * DHCP option – set DNS to the VM’s IP
   * Or push via router if you’re running this at the edge.

6. **Nginx Proxy Manager**

   * In NPM, create a proxy host `newapp.intra.lan`.
   * No DNS work needed; the wildcard already resolves it.
   * For TLS inside the LAN you can:

     * Use your own internal CA and let NPM request certs from it; or
     * Skip TLS and use HTTP if the network is trusted.

---

## If you **must** stay on Pi-hole

Pi-hole’s core `dnsmasq` **can** do the same wildcard, but you have to touch the filesystem:

```bash
echo 'address=/intra.lan/192.168.1.10' | sudo tee /etc/dnsmasq.d/45-wildcard.conf
pihole restartdns
```

No GUI, order management, or per-host override; hence most homelabbers switch to AdGuard Home for this use-case.([Pi-hole Userspace][2])

---

### TL;DR

* Deploy **AdGuard Home** (small, single-binary).
* Add one DNS-rewrite: `*.intra.lan → <proxy-IP>`.
* Point DHCP to AdGuard Home and forget about DNS forever — every new vhost you add in Nginx Proxy Manager “just works”.

[1]: https://github.com/AdguardTeam/Adguardhome/wiki/Configuration "Configuration · AdguardTeam/AdGuardHome Wiki · GitHub"
[2]: https://discourse.pi-hole.net/t/support-wildcards-in-local-dns-records/32098 "Support wildcards in local DNS records - Feature Requests - Pi-hole Userspace"
[3]: https://www.reddit.com/r/AdGuardHome/comments/12bhyok/order_of_dns_rewrites/ "Order of DNS rewrites : r/AdGuardHome"
[4]: https://github.com/AdguardTeam/AdGuardHome/issues/1547?utm_source=chatgpt.com "DNS Rewrites: support wildcard domain name exceptions #1547"
[5]: https://adguard-dns.io/kb/general/dns-filtering-syntax/ "DNS filtering rules syntax | AdGuard DNS Knowledge Base"
