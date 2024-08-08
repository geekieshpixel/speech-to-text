document.addEventListener('DOMContentLoaded', function () {
    const startStopBtn = document.getElementById('start-stop-btn');
    const textOutput = document.getElementById('text-output');
    let recognition;
    let isRecognizing = false;

    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = function () {
            isRecognizing = true;
            startStopBtn.textContent = 'Stop Recognition';
        };

        recognition.onresult = function (event) {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    textOutput.value += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
        };

        recognition.onerror = function (event) {
            console.error('Speech recognition error', event.error);
        };

        recognition.onend = function () {
            isRecognizing = false;
            startStopBtn.textContent = 'Start Recognition';
        };
    } else {
        startStopBtn.disabled = true;
        textOutput.value = 'Speech recognition not supported in this browser.';
    }

    startStopBtn.addEventListener('click', function () {
        if (isRecognizing) {
            recognition.stop();
        } else {
            recognition.start();
        }
    });
});
