# Hackweek Mykonos 2026 — mobiele app (PWA)

Een installeerbare, offline-werkende mobiele web-app (Progressive Web App) met de volledige
reisgids. Thema: **Samen beter**. Geen App Store / Play Store nodig — bedoeld voor intern gebruik.

## Wat zit erin
- 🏛️ **Start** — cover, live aftelklok tot 19 sep 2026, voorwoord, wisselende quotes
- 📅 **Programma** — alle 8 dagen, uitklapbaar; de dag van vandaag licht automatisch op
- ℹ️ **Info** — reisdetails, verblijf, hackprojecten, praktische tips, Griekse woordjes, wandelingen
- 🧳 **Paklijst** — interactieve checklist met voortgangsbalk (vinkjes worden op je toestel bewaard)
- 🧩 **Spel** — 2 speelbare kruiswoordpuzzels (Griekenland & Samen beter) met controleren/oplossen

## Zo deel je hem intern (aanbevolen)
Een PWA moet via **https** geserveerd worden om te installeren en offline te werken.
Zet de hele map op een interne static-host, bijvoorbeeld:
- Interne webserver / SharePoint / Netlify / Vercel / GitHub Pages (privé), of
- Een map achter je bedrijfs-VPN met https.

Deel daarna één link. Op de telefoon:
- **iPhone (Safari):** Deel-knop → *Zet op beginscherm*
- **Android (Chrome):** menu ⋮ → *App installeren* / *Toevoegen aan startscherm*

De app draait daarna full-screen met eigen icoon en werkt offline (belangrijk zonder data op Mykonos).

## Lokaal testen op je laptop
```bash
cd hackweek-mykonos-app
python3 -m http.server 8000
# open http://localhost:8000
```
Op je telefoon in hetzelfde wifi-netwerk: `http://<laptop-ip>:8000`
(service worker/offline werkt alleen via https of localhost).

## Nog invullen
Zoek in `index.html` op `«` voor de open plekken:
- Commissieleden, deelnemers, vluchtgegevens (heen/terug), bestuurders
- Hackprojecten (titels + beschrijvingen)

## Bestanden
```
index.html            app-shell + alle content + ingebedde puzzeldata
app.css               styling (donker, Aegeïsch thema)
app.js               navigatie, aftelklok, paklijst, kruiswoordpuzzels, offline-registratie
manifest.webmanifest  maakt de app installeerbaar
sw.js                 service worker (offline caching)
icons/                app-iconen (192/512/apple-touch/favicon)
```

De kruiswoordpuzzels zijn programmatisch gegenereerd en zitten ingebed in `index.html`.
