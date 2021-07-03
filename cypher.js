let form = document.forms['input'];

let numWords = 5;
let numLetters = 2;


function generateRepeatProfile(word) {
    wordArr = word.split("");
    let usedLetters = [];
    let repeatProfile = [];
    let unique = true;
    for (let i = 0; i < word.length; i++) {
        repeatProfile[i] = 'U';
    }
    for (let wordIndex = 0; wordIndex < wordArr.length; wordIndex++) {
        unique = true;
        for (let usedIndex = 0; usedIndex < usedLetters.length; usedIndex++) {
            if (wordArr[wordIndex] == usedLetters[usedIndex]) {
                unique = false;
            }
        }
        if (unique) {
            usedLetters.push(wordArr[wordIndex]);
        }
    }

    for (let wordIndex = 0; wordIndex < wordArr.length; wordIndex++) {
        unique = true;
        for (let usedIndex = 0; usedIndex < usedLetters.length; usedIndex++) {
            if (wordArr[wordIndex] == usedLetters[usedIndex]) {
                repeatProfile[wordIndex] = String(usedIndex);
            }
        }
    }

    return repeatProfile.join("");
}
//this is from http://sealevel.info/test_file_read.html
function loadFile(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) {
        result = xmlhttp.responseText;
    }
    return result;
}

function getLengthDict(length) {
    let fullDict = loadFile('https://www.souder.ca/Cypher/words_alpha.txt');

    let partialDictArr = [];

    fullDictArr = fullDict.split(/\r?\n/);

    for (let index = 0; index < fullDictArr.length; index++) {
        if (fullDictArr[index].length == length) {
            partialDictArr.push(fullDictArr[index]);
        }
    }

    return partialDictArr;

}

function generatePartialKeys(cypheredword, matchingDict) {
    let alphaArr = 'abcdefghijklmnopqrstuvwxyz'.split("");
    let keyArrs = [];

    for (let i = 0; i < matchingDict.length; i++) {
        let keyArr = [];

        for (let j = 0; j < alphaArr.length; j++) {
            keyArr.push("");
        }

        realWordAsArr = matchingDict[i].split("");

        for (let j = 0; j < alphaArr.length; j++) {
            for (let k = 0; k < realWordAsArr.length; k++) {
                if (realWordAsArr[k] == alphaArr[j]) {
                    keyArr[j] = cypheredword[k];
                }
            }
        }
        keyArrs.push(keyArr);
    }

    return keyArrs;
}

function getIndexOfChar(array, char) {
    let positions = [];
    for (let i = 0; i < array.length; i++) {
        if (array[i] == char) {
            positions.push(i);
        }
    }
    return positions;
}

function filterPartialKeys(partialkeys, knownKey, knownLetter) {
    let filteredkeys = [];
    let alphaArr = 'abcdefghijklmnopqrstuvwxyz'.split("");
    if (getIndexOfChar(partialkeys[0], knownKey).length==0) {
        filteredkeys = partialkeys
    }
    for (let i = 0; i < partialkeys.length; i++) {
        alphaLoc=getIndexOfChar(alphaArr, knownLetter);
        partialLoc = getIndexOfChar(partialkeys[i], knownKey)
        if (alphaLoc[0] == partialLoc[0]) {
            filteredkeys.push(partialkeys[i]);
        }
    }
    return filteredkeys;
}

function comparePartialKeys(key1, key2) {
    let alphaArr = 'abcdefghijklmnopqrstuvwxyz'.split("");
    let comboKey = [];
    for (let i = 0; i < 26; i++) {
        comboKey.push("");
    }
    for (let i = 0; i < key1.length; i++) {
        if (key1[i] == key2[i]) {
            comboKey[i] = key1[i];
        }
        else if (key1[i] == "") {
            comboKey[i] = key2[i];
        }
        else if (key2[i] == "") {
            comboKey[i] = key1[i];
        }
        else {
            return -1;
        }
    }

    for(let i=0;i<alphaArr.length;i++){
        if(getIndexOfChar(comboKey,alphaArr[i]).length>1){
            return -1;
        }
    }

    return comboKey;
}

function comparePartialKeySets(keySet1, keySet2) {
    let newKeySet = [];
    for (let i = 0; i < keySet1.length; i++) {
        for (let j = 0; j < keySet2.length; j++) {
            let comboKey = comparePartialKeys(keySet1[i], keySet2[j])
            if (comboKey != -1) {
                newKeySet.push(comboKey);
            }
        }
    }
    return newKeySet;
}

function allWordsUpToForPrint(wordNumber){
    let str="";
    for(let i=1;i<=wordNumber;i++){
        str+=(String((i))+"+");
    }
    str+=(String(wordNumber+1));

    return str;
}

function addSpace(keyArray){
    for(let i=0;i<keyArray.length;i++){
        if(keyArray[i]==""){
            keyArray[i]="&nbsp";
        }
    }
    return keyArray;
}
function decryptLetter(letter,key){
    let alphaArr = 'abcdefghijklmnopqrstuvwxyz'.split("");
    for(let i=0;i<key.length;i++){
        if(key[i]==letter){
            return alphaArr[i];
        }
    }
}

function decryptWord(cypheredWord,key){
    
    let decryptedWord = "";
    for(let i=0;i<cypheredWord.length;i++){
        codeLetter = cypheredWord.charAt(i);
        realLetter = decryptLetter(codeLetter,key);
        decryptedWord+=realLetter;
    }
    return decryptedWord;
}



function solveButtonPress() {
    let alphaArr = 'abcdefghijklmnopqrstuvwxyz'.split("");
    let cypheredWords = [];
    let knownLetters = [];
    let knownKeys = [];
    let cypheredRepeatProfiles = []
    let customLengthDicts = [];
    let wordsWithMatchingRPs = [];
    let partialkeys = [];

    document.getElementById("response").innerHTML = "";


    for (let i = 1; i <= numWords; i++) {
        cypheredWords.push(document.getElementById("word" + i).value.toLowerCase());

    }
    for (let i = 1; i <= numLetters; i++) {
        knownLetters.push(document.getElementById("letter" + i).value.toLowerCase());
        knownKeys.push(document.getElementById("letter" + i + "key").value.toLowerCase());


    }

    for (let i = 0; i < numWords; i++) {
        cypheredRepeatProfiles.push(generateRepeatProfile(cypheredWords[i]));

    }

    for (let wordNumber = 0; wordNumber < numWords; wordNumber++) {
        wordLength = cypheredWords[wordNumber].length;

        //get a custom dict of all words of length matching the target word.
        customLengthDicts.push(getLengthDict(wordLength));

        wordsWithMatchingRPs.push([]);
        for (let dictIndex = 0; dictIndex < customLengthDicts[wordNumber].length; dictIndex++) {
            let dictWordRP = generateRepeatProfile(customLengthDicts[wordNumber][dictIndex]);
            if (cypheredRepeatProfiles[wordNumber] == dictWordRP) {
                wordsWithMatchingRPs[wordNumber].push(customLengthDicts[wordNumber][dictIndex]);
            }
        }

        partialkeys[wordNumber] = generatePartialKeys(cypheredWords[wordNumber], wordsWithMatchingRPs[wordNumber])

        for (let i = 0; i < numLetters; i++) {
            partialkeys[wordNumber] = filterPartialKeys(partialkeys[wordNumber], knownKeys[i], knownLetters[i]);
        }

        document.getElementById("response").innerHTML += "<p> Word " + (wordNumber+1) + " has uniqueness profile " + cypheredRepeatProfiles[wordNumber] + " with " + (wordsWithMatchingRPs[wordNumber]).length + " matches, filtered to " + partialkeys[wordNumber].length + " matches based on known letters <\p>";



    }
    let newKeySet = partialkeys[0];
    for (let wordNumber = 1; wordNumber < numWords; wordNumber++) {
        newKeySet = comparePartialKeySets(newKeySet, partialkeys[wordNumber]);
        document.getElementById("response").innerHTML +="<p>Combining keys from word " + allWordsUpToForPrint(wordNumber)+ " and word "+(wordNumber+1)+" yields "+newKeySet.length+" possible keys</p>";
    }

    for(let i=0;i<newKeySet.length;i++){
        newKeySet[i]=addSpace(newKeySet[i]);
    }
    document.getElementById("response").innerHTML += "<br>Final keys:<br>";
    for (let i = 0; i < newKeySet.length; i++) {
        for(let j=0;j<newKeySet[i].length;j++){
            document.getElementById("response").innerHTML += " | "+newKeySet[i][j];
        }
        document.getElementById("response").innerHTML += " |<br>";
        for(let j=0;j<newKeySet[i].length;j++){
            document.getElementById("response").innerHTML += " | "+alphaArr[j];
        }
        document.getElementById("response").innerHTML += " |<br><br>";

    }

    if(newKeySet.length==1){
        document.getElementById("response").innerHTML += "<br>Decrypted Words:<br>";
        for(let i=0;i<numWords;i++){
            document.getElementById("response").innerHTML += "<h3>"+decryptWord(cypheredWords[i],newKeySet[0])+"</h3>";
        }
    }










    //document.getElementById("response").innerHTML = "<br><br><br><h1>You have selected: "+String(cypheredWords)+"</p1>";



}

function addButtonPress() {
    numWords++;
    document.getElementById("cyphered_words").innerHTML += '<label for="word' + numWords + '" id="word' + numWords + 'label">Word ' + numWords + ': </label><input type="text" id="word' + numWords + '"> <br id="br' + numWords + '">';
}

function addLetterButtonPress() {
    numLetters++;
    document.getElementById("known_letters").innerHTML += '<input type="text" id="letter' + numLetters + 'key" size=1><label for="letter' + numLetters + '" id="letter' + numLetters + 'label">stands for</label><input type="text" id="letter' + numLetters + '" size=1><br id="brl' + numLetters + '">';
}

function delButtonPress() {
    let form = document.getElementById("cyphered_words");
    document.getElementById("word" + String(numWords)).remove();
    document.getElementById("word" + String(numWords) + "label").remove();
    document.getElementById("br" + String(numWords)).remove();

    numWords--;
}

function delLetterButtonPress() {
    document.getElementById("letter" + String(numLetters) + "key").remove();
    document.getElementById("letter" + String(numLetters) + "label").remove();
    document.getElementById("letter" + String(numLetters)).remove();
    document.getElementById("brl" + String(numLetters)).remove();

    numLetters--;
}