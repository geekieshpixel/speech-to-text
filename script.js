document.addEventListener('DOMContentLoaded', function () {
    const startStopBtn = document.getElementById('start-stop-btn');
    const pauseResumeBtn = document.getElementById('pause-resume-btn');
    const clearBtn = document.getElementById('clear-btn');
    const downloadBtn = document.getElementById('download-btn');
    const textOutput = document.getElementById('text-output');
    const wordCount = document.getElementById('word-count');
    const languageSelect = document.getElementById('language-select');
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    let recognition;
    let isRecognizing = false;
    let isPaused = false;

    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = function () {
            isRecognizing = true;
            startStopBtn.textContent = 'Stop Recognition';
            pauseResumeBtn.disabled = false;
        };

        recognition.onresult = function (event) {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    textOutput.value += event.results[i][0].transcript + ' ';
                    updateWordCount();
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
            pauseResumeBtn.textContent = 'Pause Recognition';
            pauseResumeBtn.disabled = true;
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

    pauseResumeBtn.addEventListener('click', function () {
        if (isPaused) {
            recognition.start();
            pauseResumeBtn.textContent = 'Pause Recognition';
        } else {
            recognition.stop();
            pauseResumeBtn.textContent = 'Resume Recognition';
        }
        isPaused = !isPaused;
    });

    clearBtn.addEventListener('click', function () {
        textOutput.value = '';
        updateWordCount();
    });

    downloadBtn.addEventListener('click', function () {
        const blob = new Blob([textOutput.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transcription.txt';
        a.click();
        URL.revokeObjectURL(url);
    });

    languageSelect.addEventListener('change', function () {
        recognition.lang = languageSelect.value;
    });

    darkModeToggle.addEventListener('change', function () {
        document.body.classList.toggle('dark-mode');
    });

    // new dark mode toggle button
    const checkbox = document.getElementById("checkbox")
    checkbox.addEventListener("change", () => {
        document.body.classList.toggle('dark-mode');
    })

    function updateWordCount() {
        const text = textOutput.value.trim();
        const words = text.split(/\s+/).filter(word => word.length > 0);
        wordCount.textContent = `Word Count: ${words.length}`;
    }
});
