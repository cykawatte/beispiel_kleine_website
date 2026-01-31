# Musterbetrieb Website

Moderne, mobile-first Website für ein deutsches Kleinunternehmen. HTML, CSS, Vanilla JavaScript.

## Struktur

```
muster_kleine_website/
├── index.html              # Startseite
├── leistungen.html         # Leistungen
├── ueber-uns.html          # Über uns
├── galerie.html            # Galerie mit Filter
├── kontakt.html            # Kontaktformular
├── impressum.html          # Impressum (Platzhalter)
├── datenschutz.html        # Datenschutz (Platzhalter)
├── sitemap.xml             # SEO Sitemap
├── robots.txt              # Robots
└── assets/
    ├── css/styles.css      # Design System
    ├── js/main.js          # Navigation, Animationen, Formular
    ├── js/gallery.js       # Galerie-Filter, Lightbox
    └── img/favicon.svg     # Favicon
```

## Inhalte bearbeiten

### Texte ändern
Suchen und ersetzen in allen HTML-Dateien:
- `Musterbetrieb` → Ihr Firmenname
- `Musterstraße 123` → Ihre Adresse
- `12345 Musterstadt` → Ihre PLZ/Stadt
- `+49 123 456 789 00` → Ihre Telefonnummer
- `info@musterbetrieb.de` → Ihre E-Mail

### Farben anpassen
In `assets/css/styles.css`:
```css
:root {
  --color-primary: #2563eb;      /* Hauptfarbe */
  --color-primary-dark: #1d4ed8;
  --color-secondary: #0f172a;
  --color-accent: #f59e0b;
}
```

### Bilder ersetzen
- Galerie: `src`-Attribute in `galerie.html` ändern
- Empfohlene Größe: 600x600px (Galerie), 800x600px (Service)

## SEO-Checkliste

- [ ] Meta-Titel anpassen (max. 60 Zeichen)
- [ ] Meta-Beschreibungen anpassen (max. 155 Zeichen)
- [ ] Open Graph URLs aktualisieren
- [ ] Sitemap-Domain ersetzen
- [ ] Alt-Texte für Bilder prüfen
- [ ] Bei Google Search Console anmelden

## Deployment

### Netlify (empfohlen)
1. https://netlify.com → Account erstellen
2. "Add new site" → "Deploy manually"
3. Ordner per Drag & Drop hochladen

### Einfacher Webspace (FTP)
1. Alle Dateien ins Root-Verzeichnis hochladen
2. SSL-Zertifikat aktivieren

## DSGVO

### Enthalten
- Impressum-Platzhalter
- Datenschutz-Platzhalter
- Einwilligungs-Checkbox im Formular
- Keine Tracking-Scripts

### Noch zu erledigen
1. **Impressum**: Echte Firmendaten eintragen
2. **Datenschutz**: An tatsächliche Datenverarbeitung anpassen
3. **Google Maps**: Nur mit Einwilligung laden oder Platzhalter belassen
4. **Bei Analytics**: Cookie-Banner implementieren

### Cookie-Banner
Nicht enthalten, da keine Tracking-Cookies. Bei Bedarf: Cookiebot, Klaro (Open Source)

## Kontaktformular

Aktuell: Simulation. Für echte Funktion:

**Formspree:**
```html
<form action="https://formspree.io/f/YOUR_ID" method="POST">
```

**Netlify Forms:**
```html
<form name="contact" netlify>
```

## Browser-Support

Chrome, Firefox, Safari, Edge (je letzte 2 Versionen), iOS Safari, Chrome Android.
IE wird nicht unterstützt.
