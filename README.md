Vigenere Verschlüsselung
=
* [Systemvorausetzungen](#anchor-requirements)
* [Verwendung](#anchor-usage)
* [Funktionsweise](#anchor-func)
* [Beispiele](#anchor-example)

<a name="anchor-requirements"></a>
Systemvorausetzungen
=
Um Das Skript ausführen zu können wird Node.js benötigt. Die neueste Version des Programms kann [hier](https://nodejs.org/en/download/) heruntergeladen werden.

<a name="anchor-usage"></a>
Verwendung
=
Um das Skript mit dem standardmäßigen Geheimtext auszuführen werden keine weiteren Argumente benötigt.
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
1. [mehrmals auftretende Blöcke bestimmt,](#anchor-func-blocks)
1. [anhand dieser Blöcken die Schlüssellänge bestimmt,](#anchor-func-keylength)
1. [mit der Schlüssellänge der Geheimtext in n Texte aufgeteilt,](#anchor-func-seperate)
1. [mit allen Caeser-Code verschlüsselten Texten das Schlüsselwort bestimmt,](#anchor-func-caeserCrack)
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
Es werden alle vorhandenen Blöcke mit der Blocklänge ``cl`` im Text gesucht.
```Javascript
25  for(let i = 0; i < text.length-cl; i+=cl){
26    const block = text.substr(i, cl)
```
> Wie man im Code erkennen kann, werden nicht wirklich alle Blöcke mit der Länge ``cl`` gesucht ``i+=cl``. Der korrekte Ausdruck wäre hier ``i++`` um alle Blöcke zu erfassen. Verbesserung im Quellcode ist in Bearbeitung.

Solange der derzeitig zu suchende Block noch mindestens einmal im Geheimtext vorhanden ist, soll das nächste Vorkommen des Blockes in das dem Block zugehörigen Array in ``commons`` hinzugefügt werden. Die Variable ``lastIndex`` wird nach jedem gefundenen Block auf seinen zugehörigen Index im Geheimtext gesetzt, damit beim nächsten Durchgang erst ab diesem Index gesucht wird.
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

<a name="anchr-func-keylength"></a>
### Schlüssellänge bestimmen
