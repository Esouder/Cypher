let form = document.forms['input'];
let numWords = 3;


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
    let fullDict=loadFile('words_alpha.txt');
    fullDictArr=fullDict.split("/n")
    document.getElementById("response").innerHTML = fullDictArr[1];
}

function solveButtonPress() {
    let cypheredWords = [];

    for (let i = 1; i <= numWords; i++) {
        cypheredWords.push(document.getElementById("word" + i).value.toLowerCase());

    }

    for (let i = 0; i < numWords; i++) {
        document.getElementById("response").innerHTML += "<p> Word " + i + " has repeation profile " + generateRepeatProfile(cypheredWords[i]) + "<\p>";
    }

    getLengthDict(1);








    //document.getElementById("response").innerHTML = "<br><br><br><h1>You have selected: "+String(cypheredWords)+"</p1>";



}

function addButtonPress() {
    numWords++;
    document.getElementById("cyphered_words").innerHTML += '<label for="word' + numWords + '" id="word' + numWords + 'label">Word ' + numWords + ': </label><input type="text" id="word' + numWords + '"> <br id="br' + numWords + '">';
}

function delButtonPress() {
    let form = document.getElementById("cyphered_words");
    document.getElementById("word" + String(numWords)).remove();
    document.getElementById("word" + String(numWords) + "label").remove();
    document.getElementById("br" + String(numWords)).remove();

    numWords--;
}