# Growlog

Pflegetagebuch für bis zu zwei Pflanzen, als Web-App für den iPhone-Home-Bildschirm. Läuft offline, alle Daten bleiben auf dem Handy.

## Auf dem iPhone installieren

1. Die Adresse der App in Safari öffnen.
2. Auf **Teilen** tippen, dann **Zum Home-Bildschirm**.
3. Die App ab jetzt über das Icon starten. Sie funktioniert auch ohne Internet.

## Was die App kann

- **Gießen** mit Menge von oben und von unten, optional mit Dünger.
- **Düngen**, **Umgebung geändert** (Beleuchtung, Topfgröße, Lampenabstand), **Meilenstein** (Samen gesetzt, gekeimt, Vegetation, Blüte, Ernte), **Foto**, **Notiz**.
- Startseite mit Tageszähler seit Keimung, Blütetag und „zuletzt gegossen“ pro Pflanze.
- Verlauf mit Filtern, Gießgrafik pro Woche, Durchgänge abschließen und archivieren.
- Sicherung exportieren und importieren (eine JSON-Datei inklusive Fotos).

## Sicherung

Unter **Mehr** → **Sicherung exportieren** erzeugt die App eine Datei und öffnet das Teilen-Blatt. Dort **In Dateien sichern** wählen und in iCloud Drive ablegen. Ein Import ersetzt alle Daten in der App.

## Entwicklung

Reines HTML, CSS und JavaScript ohne Build-Schritt.

```
node --test logic.test.mjs     # Tests der Rechenlogik
python -m http.server 8765     # lokal ausprobieren unter http://127.0.0.1:8765/
```

Nach jeder Änderung an den Dateien in `sw.js` die Konstante `CACHE` hochzählen (z. B. `growlog-v2`), damit installierte Apps die neue Version laden.
