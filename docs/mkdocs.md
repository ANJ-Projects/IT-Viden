### TL;DR

* **Lille til mellemstort doc-sæt og du er eneste vedligeholder?**
  → Manuel `nav:` i `mkdocs.yml` er helt fint.

* **Voksende dokumentation, flere bidragydere, eller hader du at røre den gigantiske YAML-fil?**
  → Brug **`awesome-pages` (nu kaldet `awesome-nav`)** – den holder YAML'en lille og lader hver mappe styre sin egen rækkefølge.

Nedenfor finder du en pragmatisk sammenligning og et par mønstre, teams ofte ender på.

---

## 1. Manuel `nav:` i `mkdocs.yml`

| ✔ Fordele | ✘ Ulemper |
| --------- | --------- |
| *Single source of truth* – du ser hele strukturen ét sted. | Filen bliver hurtigt hundrede linjer lang; merge-conflicts er almindelige. |
| Virker out-of-the-box uden tredjepartsafhængigheder. | Hver ny/omdøbt side kræver redigering af YAML. |
| Fuld kontrol: du kan liste filer i vilkårlig rækkefølge og blande eksterne links. | Bidragydere skal forstå YAML-syntax og repo-strukturen. |

Til **10–30 sider** er det stadig komfortabelt, men når træet vokser, bliver det en flaskehals.

---

## 2. `awesome-pages` / `awesome-nav`-plugin

> Pluginnet erstatter eller supplerer `nav:` ved at læse mappe-strukturen og små `.pages`-filer i hver mappe.

### Sådan føles det

* Du **fjerner det enorme `nav:`-blok** (eller beholder et skelet med `...`) og aktiverer pluginnet:

  ```yaml
  plugins:
    - search      # har du allerede
    - awesome-pages   # pip install mkdocs-awesome-pages-plugin
  ```

* Inde i en mappe lægger du en `.pages`-fil for at styre titel, rækkefølge eller skjule elementer:

  ```yaml
  # docs/api/.pages
  title: API Reference
  sort: natural
  arrange:
    - overview.md
    - ...
    - changelog.md
  ```

* Nye `.md`-filer dukker automatisk op i navigationen med korrekt sortering. Ingen redigering af `mkdocs.yml`.

### Styrker

| ✔ Fordele | ✘ Ulemper |
| --------- | --------- |
| **Lokale beslutninger** – rækkefølge og titler ligger ved siden af de sider, de påvirker. | Tilføjer en plugin-afhængighed (men den vedligeholdes aktivt – v3.1.1 udkom 6. apr. 2025). |
| Skalerer uden problemer til hundredvis af sider; næsten ingen merge-conflicts. | Du skal stadig bruge lidt YAML, hvis du vil blande sektioner på tværs, men du kan kombinere manuel og automatisk med `...`. |
| Ikke-tekniske skribenter kan ændre rækkefølge ved at redigere en `.pages`-fil på to linjer. | Hvis navigationen skal afvige markant fra mappe-layoutet, kan manuel YAML stadig være tydeligere. |

Pluginnet er meget populært i MkDocs-community'et (≈550 GitHub-stjerner og inkluderet i mange Docker-images).

---

## 3. Et hybrid-setup mange vælger

```yaml
# mkdocs.yml
site_name: My Docs
plugins:
  - search
  - awesome-pages

nav:
  - Home: index.md      # eksplicitte top-level-punkter du går op i
  - ...
```

*Alt* under `...` genereres af pluginnet, men du bevarer fuld kontrol over de få top-punkter.

---

## 4. Alternative “nav helpers”

| Plugin | Idé | Hvornår nyttig |
| ------ | --- | -------------- |
| **`literate-nav`** | Definér navigation i en Markdown-liste i stedet for YAML. | Når du foretrækker at skrive lister i Markdown. |
| **`mkdocs-simple-plugin`** | Minder om awesome-pages men med anden syntaks. | Små projekter hvor du vil undgå skjulte filer. |

De løser samme problem; awesome-pages er blot mest gennemprøvet.

---

## Anbefaling til *“jeg vil have det simpelt men med god navigation”*

1. **Installer `awesome-pages`/`awesome-nav`.**
   ```bash
   pip install mkdocs-awesome-pages-plugin
   ```
2. **Start med en tom eller skelet-`nav:`** (behold kun de punkter, der skal være øverst).
3. **Brug `.pages`-filer** i mapper til rækkefølge og venlige titler.
4. Behold dit eksisterende `search`-plugin – det virker uændret.

Så bruger du langt mindre tid i den centrale YAML, og bidragydere kan styre deres sektion uden at træde hinanden over tæerne.
