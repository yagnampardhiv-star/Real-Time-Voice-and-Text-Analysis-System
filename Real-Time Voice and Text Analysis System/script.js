/* =================================
   GET HTML ELEMENTS
================================= */

const textInput = document.getElementById("textInput");

const wordCount = document.getElementById("wordCount");
const charCount = document.getElementById("charCount");
const sentenceCount = document.getElementById("sentenceCount");

const wordsResult = document.getElementById("wordsResult");
const charactersResult = document.getElementById("charactersResult");
const sentencesResult = document.getElementById("sentencesResult");

const sentiment = document.getElementById("sentiment");
const sentimentEmoji = document.getElementById("sentimentEmoji");
const sentimentBar = document.getElementById("sentimentBar");
const sentimentDescription = document.getElementById("sentimentDescription");

const keywords = document.getElementById("keywords");

const micButton = document.getElementById("micButton");
const statusText = document.getElementById("status");


/* =================================
   POSITIVE AND NEGATIVE WORDS
================================= */

const positiveWords = [
    "good",
    "great",
    "excellent",
    "amazing",
    "happy",
    "love",
    "beautiful",
    "wonderful",
    "awesome",
    "best",
    "success",
    "successful",
    "perfect",
    "nice",
    "fantastic",
    "enjoy",
    "enjoyed",
    "helpful",
    "positive",
    "thank",
    "thanks"
];

const negativeWords = [
    "bad",
    "terrible",
    "horrible",
    "sad",
    "hate",
    "angry",
    "worst",
    "poor",
    "problem",
    "failure",
    "failed",
    "negative",
    "difficult",
    "disappointed",
    "disappointing",
    "wrong",
    "error",
    "awful",
    "pain",
    "boring"
];


/* =================================
   ANALYZE TEXT
================================= */

function analyzeText() {

    const text = textInput.value.trim();

    /* Word Count */

    let words = [];

    if (text.length > 0) {
        words = text.split(/\s+/);
    }

    const totalWords = words.length;

    /* Character Count */

    const totalCharacters = text.length;


    /* Sentence Count */

    let totalSentences = 0;

    if (text.length > 0) {

        const sentences = text.match(/[.!?]+/g);

        totalSentences = sentences
            ? sentences.length
            : 1;
    }


    /* Update statistics */

    wordCount.textContent = totalWords;
    charCount.textContent = totalCharacters;
    sentenceCount.textContent = totalSentences;

    wordsResult.textContent = totalWords;
    charactersResult.textContent = totalCharacters;
    sentencesResult.textContent = totalSentences;


    /* Sentiment */

    detectSentiment(text);


    /* Keywords */

    findKeywords(text);
}


/* =================================
   SENTIMENT ANALYSIS
================================= */

function detectSentiment(text) {

    if (text.length === 0) {

        sentiment.textContent = "Neutral";

        sentimentEmoji.textContent = "😐";

        sentimentBar.style.width = "50%";

        sentimentDescription.textContent =
            "Enter text to detect sentiment.";

        return;
    }


    const words = text
        .toLowerCase()
        .replace(/[.,!?]/g, "")
        .split(/\s+/);


    let positiveScore = 0;
    let negativeScore = 0;


    words.forEach(function(word) {

        if (positiveWords.includes(word)) {
            positiveScore++;
        }

        if (negativeWords.includes(word)) {
            negativeScore++;
        }

    });


    /* Positive */

    if (positiveScore > negativeScore) {

        sentiment.textContent = "Positive";

        sentimentEmoji.textContent = "😊";

        sentimentBar.style.width = "85%";

        sentimentDescription.textContent =
            "Your text expresses a positive tone.";

    }


    /* Negative */

    else if (negativeScore > positiveScore) {

        sentiment.textContent = "Negative";

        sentimentEmoji.textContent = "😟";

        sentimentBar.style.width = "25%";

        sentimentDescription.textContent =
            "Your text expresses a negative tone.";

    }


    /* Neutral */

    else {

        sentiment.textContent = "Neutral";

        sentimentEmoji.textContent = "😐";

        sentimentBar.style.width = "50%";

        sentimentDescription.textContent =
            "Your text has a mostly neutral tone.";

    }
}


/* =================================
   KEYWORD EXTRACTION
================================= */

function findKeywords(text) {

    if (text.length === 0) {

        keywords.innerHTML =
            '<span class="empty-keyword">Keywords will appear here</span>';

        return;
    }


    const stopWords = [

        "the",
        "is",
        "a",
        "an",
        "and",
        "or",
        "of",
        "to",
        "in",
        "on",
        "for",
        "with",
        "this",
        "that",
        "it",
        "are",
        "was",
        "were",
        "i",
        "you",
        "we",
        "they",
        "he",
        "she",
        "my",
        "your",
        "our",
        "their",
        "am",
        "be",
        "have",
        "has",
        "had",
        "can",
        "will",
        "very"
    ];


    const words = text
        .toLowerCase()
        .replace(/[.,!?;:()]/g, "")
        .split(/\s+/);


    const frequency = {};


    words.forEach(function(word) {

        if (
            word.length > 3 &&
            !stopWords.includes(word)
        ) {

            if (frequency[word]) {

                frequency[word]++;

            } else {

                frequency[word] = 1;

            }

        }

    });


    const sortedWords = Object
        .entries(frequency)
        .sort(function(a, b) {
            return b[1] - a[1];
        })
        .slice(0, 8);


    if (sortedWords.length === 0) {

        keywords.innerHTML =
            '<span class="empty-keyword">No keywords found</span>';

        return;
    }


    keywords.innerHTML = "";


    sortedWords.forEach(function(item) {

        const keyword = document.createElement("span");

        keyword.className = "keyword";

        keyword.textContent = item[0];

        keywords.appendChild(keyword);

    });
}


/* =================================
   VOICE RECOGNITION
================================= */

let recognition;

if (
    "webkitSpeechRecognition" in window ||
    "SpeechRecognition" in window
) {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    recognition = new SpeechRecognition();


    recognition.continuous = true;

    recognition.interimResults = true;

    recognition.lang = "en-US";


    recognition.onstart = function() {

        micButton.classList.add("recording");

        micButton.innerHTML =
            "🔴 <span>Listening...</span>";

        statusText.textContent = "Listening";

    };


    recognition.onresult = function(event) {

        let finalText = "";

        let interimText = "";


        for (
            let i = event.resultIndex;
            i < event.results.length;
            i++
        ) {

            const transcript =
                event.results[i][0].transcript;


            if (event.results[i].isFinal) {

                finalText += transcript + " ";

            } else {

                interimText += transcript;

            }

        }


        if (finalText) {

            textInput.value += finalText;

        }


        /* Analyze live text */

        if (interimText) {

            const currentText =
                textInput.value + interimText;

            analyzeTemporaryText(currentText);

        } else {

            analyzeText();

        }

    };


    recognition.onerror = function(event) {

        console.log(
            "Speech recognition error:",
            event.error
        );

        statusText.textContent = "Error";

    };


    recognition.onend = function() {

        micButton.classList.remove("recording");

        micButton.innerHTML =
            "🎤 <span>Start Voice</span>";

        statusText.textContent = "Ready";

        analyzeText();

    };

}


/* =================================
   START VOICE RECOGNITION
================================= */

function startVoiceRecognition() {

    if (!recognition) {

        alert(
            "Speech recognition is not supported in this browser. Please use Google Chrome."
        );

        return;
    }


    try {

        recognition.start();

    } catch (error) {

        recognition.stop();

    }
}


/* =================================
   TEMPORARY LIVE ANALYSIS
================================= */

function analyzeTemporaryText(text) {

    const oldValue = textInput.value;

    textInput.value = text;

    analyzeText();

    textInput.value = oldValue;
}


/* =================================
   CLEAR TEXT
================================= */

function clearText() {

    textInput.value = "";

    analyzeText();

    statusText.textContent = "Ready";
}


/* =================================
   COPY TEXT
================================= */

function copyText() {

    if (textInput.value.trim() === "") {

        alert("There is no text to copy.");

        return;
    }


    navigator.clipboard.writeText(
        textInput.value
    );


    alert("Text copied successfully!");
}


/* =================================
   SCROLL TO ANALYZER
================================= */

function scrollToAnalyzer() {

    document
        .getElementById("analyzer")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =================================
   INITIAL ANALYSIS
================================= */

analyzeText();