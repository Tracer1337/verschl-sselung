Vigenere Entschlüsselung
=
* [Systemvorausetzungen](#anchor-requirements)
* [Verwendung](#anchor-usage)
* [Funktionsweise](#anchor-func)
* [Beispiele](#anchor-examples)

<a name="anchor-requirements"></a>
Systemvorausetzungen
=
Um Das Skript ausführen zu können wird Node.js benötigt. Die neueste Version des Programms kann [hier](https://nodejs.org/en/download/) heruntergeladen werden.

<a name="anchor-usage"></a>
Verwendung
=
Um das Skript mit dem standardmäßigen Geheimtext auszuführen, werden keine weiteren Argumente benötigt.
```
node Vigenere.js
```
Alternativ kann ein anderer Geheimtext entschlüsselt werden, indem man ihn als erstes Argument einfügt.
```
node Vigenere.js "<Geheimtext>"
```

<a name="anchor-func"></a>
Funktionsweise
=
Die Funktion ``decryptText`` bereitet Anfangs den Geheimtext zur Entschlüsselung vor. Dazu wird der Text in Großbuchstaben konvertiert und auf Buchstaben reduziert.
```Javascript
text = text.toUpperCase()
text = text.replace(/\W/g, "")
```
Anschließend werden nacheinander
1. [Mehrmals auftretende Blöcke bestimmt,](#anchor-func-blocks)
1. [Anhand dieser Blöcken die Schlüssellänge bestimmt,](#anchor-func-keylength)
1. [Mit der Schlüssellänge der Geheimtext in n Texte aufgeteilt,](#anchor-func-seperate)
1. [Mit allen Caeser-Code verschlüsselten Texten das Schlüsselwort bestimmt,](#anchor-func-caeserCrack)
1. [Mit diesem Schlüsselwort der Geheimtext entschlüsselt.](#anchor-func-textDecode)

<a name="anchor-func-blocks"></a>
### Blöcke bestimmen
```Javascript
22  const findBlocks = text => {
23    const commons = {}
24    for(let cl = 2; cl <= text.length/2; cl++){
25      for(let i = 0; i < text.length-cl; i+=cl){
26        const block = text.substr(i, cl)
27        let lastIndex = i
28        commons[block] = []
29        while(text.indexOf(block, lastIndex+cl) !== -1){
30          const index = text.indexOf(block, lastIndex+cl)
31          commons[block].push(index - lastIndex)
32          lastIndex = index
33        }
34        if(commons[block].length === 0)
35          delete commons[block]
36      }
37    }
38    return commons
39  }
```
Um die Blöcke zu bestimmen werden alle möglichen Blockgrößen (2 - Textlänge / 2) ausprobiert.
```Javascript
24  for(let cl = 2; cl <= text.length/2; cl++){
```
Es werden alle vorhandenen Blöcke mit der Blocklänge ``cl`` im Text gesucht und die lokale Konstante ``block``, die den aktuellen zu suchenden String repräsentiert, bei jedem Durchlauf auf den Abschnitt ab Index ``i`` mit der Länge ``cl`` aus dem Geheimtext gesetzt.
Die Variable ``lastIndex`` erhält den Initialwert des Indexes des zu suchenden Blockes, da dieser auch gleichzeitig das letzte gefundene Vorkommen dieser Zeichenkette ist.
```Javascript
25  for(let i = 0; i < text.length-cl; i+=cl){
26    const block = text.substr(i, cl)
27    let lastIndex = i
```
> Wie man im Code erkennen kann, werden nicht wirklich alle Blöcke mit der Länge ``cl`` gesucht ``i+=cl``. Der korrekte Ausdruck wäre hier ``i++`` um alle Blöcke zu erfassen. Verbesserung im Quellcode ist in Bearbeitung.

Solange der derzeitig zu suchende Block noch mindestens einmal im Geheimtext vorhanden ist, soll der Abstand zwischem dem letzten und dem neue gefundenen Vorkommens in das zugehörige Array in ``commons`` hinzugefügt werden. Die Variable ``lastIndex`` wird nach jedem gefundenen Block auf seinen zugehörigen Index im Geheimtext gesetzt, damit beim nächsten Durchgang erst ab diesem Index gesucht wird.
```Javascript
29  while(text.indexOf(block, lastIndex+cl) !== -1){
30    const index = text.indexOf(block, lastIndex+cl)
31    commons[block].push(index - lastIndex)
32    lastIndex = index
33  }
```
Zum Schluss werden alle leeren Blöcke, also alle die, die nur einmal vorkamen, aus ``commons`` entfernt und ``commons`` wird zurückgegeben.
```Javascript
34  if(commons[block].length === 0)
35    delete commons[block]
...
38    return commons
```

<a name="anchor-func-keylength"></a>
### Schlüssellänge bestimmen
```Javascript
41  const findDivisor = blocks => {
42    const nrs = []
43    for(let block in blocks)
44      nrs.push(...blocks[block])
45  
46    return getMostFrequent(nrs.map((n, i, nrs) => {
47      if(i == nrs.length-1) return
48      return gcd(n,nrs[i+1])
49    }))
50  }
```
Diese Funktion bestimmt den größten gemeinsamen Teiler aller Zahlen, die mit ``blocks`` mit dem Aufbau
```
[Objekt] = {
  [String]: [Array: Integer],
  ...
}
```
übergeben wurden.
Dafür werden zuerst alle Zahlen in ein Array extrahiert.
```Javascript
42  const nrs = []
43  for(let block in blocks)
44    nrs.push(...blocks[block])
```
Anschließend werden von allen aufeinderfolgenden Zahlen die größten geimeinsamen Teiler mit Hilfe der Funktion [``gcd``](https://stackoverflow.com/questions/17445231/js-how-to-find-the-greatest-common-divisor) bestimmt.
> Der auskommentierte Teil ist für die Bestimmung der Teiler unwichtig.
```Javascript
46    /*return getMostFrequent(*/nrs.map((n, i, nrs) => {
47      if(i == nrs.length-1) return
48      return gcd(n,nrs[i+1])
49    })/*)*/
```
Die Funktion gibt den am häufigsten vorkommenden Teiler mit Hilfe der Funktion [``getMostFrequent``](https://www.w3resource.com/javascript-exercises/javascript-array-exercise-8.php) zurück.
```Javascript
46    return getMostFrequent(nrs.map((n, i, nrs) => {
...
```

<a name="anchor-func-seperate"></a>
### Geheimtext aufteilen
```Javascript
52  const seperateText = (text, n) => {
53    const newTexts = new Array(n).fill(0).map(() => [])
54    for(let i = 0; i < text.length; i++)
55      newTexts[i%n].push(text[i])
56    return newTexts.map(array => array.join(""))
57  }
```
Es werden zuerst ``n`` Arrays erstellt (in diesem Fall ist ``n`` die Schlüssellänge) und diese Arrays mit den zugehörigen Buchstaben des Geheimtextes gefüllt, sodass ``n`` Arrays mit Caeser-Code verschlüsselten Texten entstehen.

<a name="anchor-func-caeserCrack"></a>
### Schlüsselwort bestimmen
Dieser Abschnit beinhaltet zwei wesentliche Funktionen.
Darunter zum einen die Funktion(en) zur Bestimmung des Schlüssels eines mit Caeser-Code verschlüsselten Textes
```Javascript
67  const findKey = text => {
68    const lf = frequencyAnalysis(text)
69    let max = Object.keys(lf)[0]
70    for(let letter in lf)
71      if(lf[letter] > lf[max])
72        max = letter
73    return Math.abs(alphabetPos(max) - alphabetPos("e"))
74  }
75  
76  const findKeyChar = text => String.fromCharCode(findKey(text)+65)
```
und zum anderen eine Funktion, die die absoluten Häufigkeiten der Zeichen einer Zeichenkette bestimmt und zurückgibt (Häufigkeitsanalyse).
```Javascript
59  const frequencyAnalysis = text => {
60    const letters = text.split("").reduce((res, letter) => {
61      !res[letter] ? res[letter] = 1 : res[letter]++
62      return res
63    }, {})
64    return letters
65  }
```
Zur Bestimmung eines Schlüssels (``findKey``) wird zunächst der übergebene Text durch die Funktion ``frequencyAnalysis`` auf die Vorkommen der Buchstaben analysiert.
```Javascript
68  const lf = frequencyAnalysis(text)
```
Von diesen Häufigkeiten wird der höchste Wert (also der am häufigsten vorkommende Buchstabe im Text) bestimmt.
```Javascript
69  let max = Object.keys(lf)[0]
70  for(let letter in lf)
71    if(lf[letter] > lf[max])
72      max = letter
```
Zurückgegeben wird der Abstand des häufigsten Buchstabens ``max`` zum Buchstaben "e" im Alphabet.
```Javascript
73  return Math.abs(alphabetPos(max) - alphabetPos("e"))
```
Die Funktion ``findKeyChar`` ermittelt den Schlüssel eines Caeser-Textes, gibt diesen aber als Buchstaben zurück (der Schlüssel des Vigenere-Verfahrens besteht aus Buchstaben, nicht aus Zahlen).
```Javascript
76  const findKeyChar = text => String.fromCharCode(findKey(text)+65)
```
Der entgültige Schlüssel wird bestimmt, indem von allen mit Caeser-Code verschlüsselten Texten der Schlüssel-Buchstabe bestimmt wird, und diese zu einer Zeichenkette zusammengefügt werden.
```Javascript
89  const key = seperatedTexts.map(text => findKeyChar(text)).join("")
```

<a name="anchor-func-textDecode"></a>
### Geheimtext entschlüsseln
```Javascript
78  const decryptChar = (char, key) => {
79    char = char.toUpperCase()
80    return String.fromCharCode(char.charCodeAt(0) - key < 65 ? char.charCodeAt(0) + 26 - key : char.charCodeAt(0) - key)
81  }
...
90  //return {
91  //  key,
92    text: text.split("").map((letter, i) => decryptChar(letter, alphabetPos(key[i%key.length]))).join("")
94  //}
```
> Der auskommentierte Teil ist für die Entschlüsselung des Geheimtextes unwichtig.

Da das Schlüsselwort nun bekannt ist, kann der Geheimtext einfach entschlüsselt werden, indem jeder Buchstabe des Geheimtextes mit dem dazugehörigen Buchstaben des Schlüsselwortes entschlüsselt wird.
Der entsprechende Schlüssel-Buchstabe ist derjenige, der über dem zu entschlüsselnden Buchstaben stehen würde, würde mann das Schlüsselwort sich wiederholend über den Geheimtext legen.

Die Funktion ``decryptChar`` dient hierbei zur Entschlüsselung eines einzelnen Buchstabens bei gegebenem Schlüssel, indem sie den Buchstaben zurückgiebt, der im Alphabet ``key`` Plätze hinter dem zu entschlüsselnden Buchstaben liegt.
```Javascript
80  return String.fromCharCode(char.charCodeAt(0) - key < 65 ? char.charCodeAt(0) + 26 - key : char.charCodeAt(0) - key)
```

Der Klartext wird mitsamt des Schlüssels von der Funktion ``decryptText`` zurückgegeben.
```Javascript
90  return {
91    key,
92    text: text.split("").map((letter, i) => decryptChar(letter, alphabetPos(key[i%key.length]))).join("")
93  }
```
Beim Ausführen des Skriptes wird die Funktion ``decryptText`` mit dem vorgegebenen Text in ``text.json`` oder optional mit einem als Kommandozeilen-Parameter übergebenen Text aufgerufen und das Ergebnis (Klartext und Schlüssel) ausgegeben.
```Javascript
96  const decrypted = decryptText(gt)
97  console.log(`Klartext:\n${decrypted.text}\n\nSchlüssel:\n${decrypted.key}`)
```

<a name="anchor-examples"></a>
Beispiele
=
Mit dem vorgebenenen Text aus ``text.json`` als Eingabe, ergibt sich folgende Ausgabe:
```
Klartext:
DERRABEUNDDERFUCHSANEINEMMORGENSASSEINRABEMITEINEMGESTOHLENENSTUECKKAESEIMSCHNABELAUFEINEMASTWOERINRUHESEINEBEUTEVERZEHRENWOLLTEZUFRIEDENKRAECHZTEDERRABEUEBERSEINENKAESEDIESHOERTEEINVORBEIZIEHENDERFUCHSERDACHTENACHWIEERANDENKAESEKOMMENKOENNTEENDLICHHATTEEREINEHINTERLISTIGEIDEEFREUNDLICHBEGANNDERFUCHSDENRABENZULOBENOHRABEWASBISTDUFUEREINWUNDERBARERVOGELWENNDEINGESANGEBENSOSCHOENISTWIEDEINGEFIEDERDANNSOLLTEMANDICHZUMKOENIGALLERVOEGELKROENENDASSCHMEICHELTEDEMRABENUNDDASHERZSCHLUGIHMVORFREUDEHOEHERSTOLZRISSERSEINENSCHNABELAUFUNDBEGANNZUKRAECHZENDABEIENTFIELIHMDASKOESTLICHESTUECKKAESEDARAUFHATTEDERFUCHSNURGEWARTETSCHNELLSCHNAPPTEERSICHDIEBEUTEUNDMACHTESICHGLEICHANSFRESSENDARIEFDERRABEEMPOERTHEDASWARGEMEINDOCHDERFUCHSLACHTENURUEBERDENTOERICHTENRABEN

Schlüssel:
TASSE
```
