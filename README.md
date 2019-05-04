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
Um das Skript mit dem standardmäßigen Geheimtext ausführen werden keine weiteren Argumente benötigt.
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
Die Funktion ``decryptText`` bereitet Anfangs den Geheimtext zur Entschlüsselung vor. Dazu wird der Text in Großbuchstaben konvertiert und alle Zeichen außer Buchstaben entfernt.
```Javascript
text = text.toUpperCase()
text = text.replace(/\W/g, "")
```
Anschließend werden nacheinander
1. [mehrmals auftretene Blöcke bestimmt,](#anchor-func-blocks)
1. [anhand dieser Blöcken die Schlüssellänge bestimmt,](#anchor-func-keylength)
1. [mit der Schlüssellänge der Geheimtext in n Texte aufgeteilt,](#anchor-func-seperate)
1. [mit allen Caeser-Code verschlüsselten Texten das Schlüsselwort bestimmt,](#anchor-func-caeserCrack)
1. [Mit diesem Schlüsselwort der Geheimtext entschlüsselt.](#anchor-func-textDecode)

<a name="anchor-func-blocks"></a>
### Blöcke bestimmen
Um die Blöcke zu bestimmen werden alle möglichen Blockgrößen (2 - Textlänge / 2) ausprobiert.
```Javascript
for(let cl = 2; cl <= text.length/2; cl++){
```
