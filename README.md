# Corona-Intensivpatienten (DIVI)

Neben der täglichen Zahl der Corona-Neuinfektionen ist auch die Zahl der Menschen, welche sich wegen Covid-19 in intensivmedizinischer Behandlung befinden, ein wichtiger Indikator für Entwicklung der Corona-Pandemie in Deutschland. Diese API stellte die jeweils aktuelle Zahl der Covid-19-Intensivpatienten sowie die Zahl der verfügbaren Intensivbetten bereit.

## Daten

Das [DIVI-Intensivregister](https://www.intensivregister.de/#/index) ist eine wichtige Datenquelle für verschiedene Indikatoren zur Auslastung des Krankenhaussystems durch die Corona-Pandemie. Seit dem 16. April 2020 sind alle relevanten Krankenhäuser zur täglichen Meldung an das Intensivregister verpflichtet. Die „Deutsche Interdisziplinären Vereinigung für Intensiv- und Notfallmedizin“, kurz DIVI, ist für die Verwaltung und Aufbereitung dieser Daten zuständig.

Für die API verwenden wir die Zeitreihen-Übersicht des DIVI-Intensivregisters. Diese Ansicht bietet Diagramme zu vier verschieden Indikatoren, welche jeweils für Deutschland und die sechzehn Bundesländern bereitgestellt werden. Die Diagramme werden mit dem Diagramm-Tool [Datawrapper](https://www.datawrapper.de/) erstellt, woraus die Daten extrahiert werden: <https://www.intensivregister.de/#/aktuelle-lage/zeitreihen>

>Die Daten des Intensivregister können nach [vorheriger Absprache](mailto:presse@divi.de) und unter Verwendung des Quellenhinweis „DIVI-Intensivregister“, zumindest für journalistische Zwecke, frei verwendet werden.

## API

Für die Verwendung der Daten in Apps und interaktiven Grafiken (Datawrapper) stellen wir einen API bereit, die das Abfragen der DIVI-Daten aus dem Register „Zeitreihen“ nach bestimmten Parametern ermöglicht.

**URL:** <https://europe-west3-brdata-corona.cloudfunctions.net/diviApi/>

### Parameter

Welche Daten abgefragt werden können mit einem sogenannten [Query-String](https://de.wikipedia.org/wiki/Query-String) festgelegt werden. Ein Beispiel dafür wie das funktioniert gibt es weiter unten.

Der Parameter `area` ist verpflichtend und legt fest, für welches Gebiet Daten zurückgegeben werden sollen:

- `DE`: Deutschland
- `BW`: Baden-Württemberg
- `BY`: Bayern
- `BE`: Berlin
- `BB`: Brandenburg
- `HB`: Bremen
- `HH`: Hamburg
- `HE`: Hessen
- `MV`: Mecklenburg-Vorpommern
- `NI`: Niedersachsen
- `NW`: Nordrhein-Westfalen
- `RP`: Rheinland-Pfalz
- `SL`: Saarland
- `SN`: Sachsen
- `ST`: Sachsen-Anhalt
- `SH`: Schleswig-Holstein
- `TH`: Thüringen

Der Parameter `indicator` ist verpflichtend und legt fest, welcher Indikator abgefragt werden soll:

- `Meldebereiche`: Anzahl meldender Meldebereiche
- `Patienten`: Anzahl gemeldeter intensivmedizinisch behandelter COVID-19-Fälle
- `Bettenstatus`: Gesamtzahl gemeldeter Intensivbetten (Betreibbare Betten und Notfallreserve)
- `Bettenanteil`: Anzahl gemeldeter intensivmedizinisch behandelter COVID-19-Fälle an Anzahl belegter Intensivbetten
- `Betriebssituation`: Anzahl der Intensivbereiche nach gemeldeter Betriebssituation
- `Intensivkapazitäten`: Anzahl der freien betreibbaren Behandlungskapazitäten zur invasiven Beatmung

Der Parameter `filetype` ist optional und legt fest in welchem Format die Daten zurückgegeben werden sollen:

- `json` (default): JavaScript Object Array (JSON)
- `csv`: Tabelle (CSV)

### Beispiel

Anzahl der Covid-19-Intensivpatienten (`indicator=Patienten`) in Bayern (`area=BY`) als CSV-Tabelle (`filetype=csv`) abfragen:

```text
https://europe-west3-brdata-corona.cloudfunctions.net/diviApi/query?area=BY&indicator=Patienten&filetype=csv
```

Die Abfrage liefert einen Liste aller verfügbaren Daten zum gewählten Indikator und Gebiet:

```text
date,faelleCovidAktuell
"2020-10-30T11:15:00.000Z",179
"2020-10-29T11:15:00.000Z",167
"2020-10-28T11:15:00.000Z",147
"2020-10-27T11:15:00.000Z",129
"2020-10-26T11:15:00.000Z",122
...
"2020-03-24T11:15:00.000Z",123
"2020-03-23T11:15:00.000Z",94
"2020-03-22T11:15:00.000Z",82
"2020-03-21T11:15:00.000Z",67
"2020-03-20T11:15:00.000Z",61
```

Eine Abfrage ohne den Parameter `filetype=csv` würde die gleichen Daten im JSON-Format liefern:

```javascript
[
  { "date": "2020-10-30T11:15:00.000Z", "faelleCovidAktuell": 179 },
  { "date": "2020-10-29T11:15:00.000Z", "faelleCovidAktuell": 167 },
  { "date": "2020-10-28T11:15:00.000Z", "faelleCovidAktuell": 147 },
  { "date": "2020-10-27T11:15:00.000Z", "faelleCovidAktuell": 129 },
  { "date": "2020-10-26T11:15:00.000Z", "faelleCovidAktuell": 122 },
  // ...
  { "date": "2020-03-24T11:15:00.000Z", "faelleCovidAktuell": 123 },
  { "date": "2020-03-23T11:15:00.000Z", "faelleCovidAktuell": 94 },
  { "date": "2020-03-22T11:15:00.000Z", "faelleCovidAktuell": 82 },
  { "date": "2020-03-21T11:15:00.000Z", "faelleCovidAktuell": 67 },
  { "date": "2020-03-20T11:15:00.000Z", "faelleCovidAktuell": 61 }
]
```

Die Namen und Anzahl der Attribute, hier `faelleCovidAktuell`, sind vom jeweils gewählten Indikator abhängig.

## Verwendung

1. Repository klonen `git clone https://...`
2. Erforderliche Module installieren `npm install`
3. Entwicklungsserver starten `npm watch`

Um die Module installieren und die Entwicklerwerkzeuge nutzen zu können, muss vorher die JavaScript-Runtime [Node.js](https://nodejs.org/en/download/) installiert werden. Informationen für Entwickler finden sich weiter [unten](#user-content-entwickeln).

## Datenquelle anbinden

Welche Datawrapper-Diagramme – und damit auch welche Daten – von der Seite des Intensivregister verwendet werden sollen, wird in der Datei `charts.json` festgelegt. Hier ein Beispiel für das Diagramm und die Daten der Intensivpatienten in Deutschland:

```json
{
  "chartId": "WvhXR",
  "indicator": "Patienten",
  "area": "Deutschland",
  "areaId": "DE"
}
```

Die `chartId` ist die jeweilige ID des Datawrapper-Diagramms, aus der die Daten extrahiert werden sollen. Der `indicator` bezeichnet die Art der Statistik und die `areaId` gibt an für welches Land die Daten gelten. Die `area` ist moment nur ein dekoratives Attribut für Menschen die sich nicht alle Bundeslandkürzel merken können.

## Deployment

Diese Anleitung geht davon aus, dass bereits ein Google Cloud-Konto vorhanden und ein Rechnungskonto eingerichtet ist. Außerdem sollte das Google Cloud-Kommandzeilenwerkzeug [installiert](https://cloud.google.com/sdk/install) und mit einem Benutzerkonto [verknüpft](https://cloud.google.com/sdk/docs/initializing) sein.

### Projekt anlegen

Neues Projekt mit der ID `brdata-corona` erstellen. Der Parameter `--name` ist optional.

```console
$ gcloud projects create brdata-corona --name=30-BRData-corona
```

Das Projekt als aktuelles Arbeitsprojekt festlegen:

```console
$ gcloud config set project brdata-corona
```

### API deployen

Google Cloud Function für das aktuelle Projekt aktivieren:

```console
$ gcloud services enable cloudfunctions.googleapis.com
```

Rechenzentrum *europe-west3* (Frankfurt) als Ziel für das Funktions-Deployment festlegen:

```console
$ gcloud config set functions/region europe-west3
```

Seit neuestem muss zudem Google Cloud Build aktiviert werden:

```console
& gcloud services enable cloudbuild.googleapis.com
```

API-Funktion deployen: In diesem Beispiel wird der nicht authentifizierte Zugriff von außerhalb erlaubt, um den Datenaustausch zwischen API und beispielsweise einer Web-App zu ermöglichen:

```console
$ gcloud functions deploy diviApi --runtime=nodejs10 --trigger-http --allow-unauthenticated
```

### Lokale Entwicklungsumgebung

Um das Skript `index.js` lokal zu testen, verwendet man am besten das Google Functions Framework. Das Functions Framework kann mit dem Befehl `npm run watch` gestartet werden. Das hat den Vorteil, dass das Skript jedes Mal neu geladen wird, sobald man Änderungen am Code vornimmt.

Man kann das Functions Framework aber auch manuell installieren und ausführen:

```console
$ npm i -g @google-cloud/functions-framework
```

Funktion *diviApi* starten:

```console
$ functions-framework --target=diviApi
```

API-Anfrage stellen (Beispiel):

```console
$ curl -X GET 'http://localhost:8080?area=BY&indicator=Patienten'
```

## Verbesserungsvorschläge

- Daten nach Datum filterbar machen (Parameter `date`)
