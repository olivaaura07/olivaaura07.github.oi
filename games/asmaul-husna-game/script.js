const asmaulHusnaData = [
    { name: "Ar-Rahman", meaning: "Yang Maha Pengasih" },
    { name: "Ar-Rahim", meaning: "Yang Maha Penyayang" },
    { name: "Al-Malik", meaning: "Yang Maha Merajai" },
    { name: "Al-Quddus", meaning: "Yang Maha Suci" },
    { name: "As-Salaam", meaning: "Yang Maha Memberi Kesejahteraan" },
    { name: "Al-Mu'min", meaning: "Yang Maha Memberi Keamanan" },
    { name: "Al-Muhaimin", meaning: "Yang Maha Pemelihara" },
    { name: "Al-Aziz", meaning: "Yang Maha Perkasa" },
    { name: "Al-Jabbar", meaning: "Yang Maha Gagah" },
    { name: "Al-Mutakabbir", meaning: "Yang Maha Megah" },
    { name: "Al-Khaliq", meaning: "Yang Maha Pencipta" },
    { name: "Al-Bari'", meaning: "Yang Maha Melepaskan" },
    { name: "Al-Musawwir", meaning: "Yang Maha Membentuk Rupa" },
    { name: "Al-Ghaffar", meaning: "Yang Maha Pengampun" },
    { name: "Al-Qahhar", meaning: "Yang Maha Memaksa" },
    { name: "Al-Wahhab", meaning: "Yang Maha Pemberi Karunia" },
    { name: "Ar-Razzaq", meaning: "Yang Maha Pemberi Rezeki" },
    { name: "Al-Fattah", meaning: "Yang Maha Pembuka Rahmat" },
    { name: "Al-'Alim", meaning: "Yang Maha Mengetahui" },
    { name: "Al-Qabidh", meaning: "Yang Maha Menyempitkan" }
];

const GAME_DURATION = 60; // Total game time in seconds (optional mode) OR per question.
// Let's go with per-question timer or total game? 
// User request: "halaman kuis dengan timer dan skor yang ditampilkan secara langsung"
// User requested: "Setiap jawaban benar akan menambah skor, sedangkan jawaban salah atau kehabisan waktu tidak menambah skor."
// This implies a per-question limit or a global limit. Let's do a simple 10 questions per game, 15 seconds per question to make it relaxed but paced.

const QUESTIONS_PER_GAME = 10;
const TIME_PER_QUESTION = 15;

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let timer;
let timeLeft;

const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const scoreText = document.getElementById('score');
const timerText = document.getElementById('timer');
const progressBar = document.getElementById('progress');
const finalScoreText = document.getElementById('final-score');
const evaluationText = document.getElementById('evaluation-text');
const audioBtn = document.getElementById('audio-btn');

document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', startGame);
audioBtn.addEventListener('click', () => playAudio(currentQuestion.name));


function startGame() {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...asmaulHusnaData];
    startScreen.classList.remove('active');
    startScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    resultScreen.classList.remove('active'); // ensure hidden
    quizScreen.classList.remove('hidden');
    quizScreen.classList.add('active');

    getNewQuestion();
}

function getNewQuestion() {
    if (availableQuestions.length === 0 || questionCounter >= QUESTIONS_PER_GAME) {
        return endGame();
    }

    questionCounter++;
    // Update Progress Bar
    const progressPercent = (questionCounter / QUESTIONS_PER_GAME) * 100;
    progressBar.style.width = `${progressPercent}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    questionText.innerText = currentQuestion.name;

    // Play Audio
    setTimeout(() => playAudio(currentQuestion.name), 500); // Small delay for better UX

    // Generate Options
    const answers = generateOptions(currentQuestion);

    optionsContainer.innerHTML = '';
    answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer;
        button.classList.add('option-btn');
        button.addEventListener('click', (e) => selectAnswer(e, answer === currentQuestion.meaning));
        optionsContainer.appendChild(button);
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;

    startTimer();
    scoreText.innerText = score;
}

function generateOptions(correctQuestion) {
    // Get 3 wrong answers
    const wrongAnswers = asmaulHusnaData
        .filter(item => item.name !== correctQuestion.name)
        .sort(() => 0.5 - Math.random()) // Shuffle
        .slice(0, 3)
        .map(item => item.meaning);

    const allAnswers = [...wrongAnswers, correctQuestion.meaning];
    return allAnswers.sort(() => 0.5 - Math.random()); // Shuffle correct answer in
}

function selectAnswer(e, isCorrect) {
    if (!acceptingAnswers) return;
    acceptingAnswers = false;
    clearInterval(timer);

    const selectedBtn = e.target;

    // Play Click Sound Effect
    playFeedbackSound(isCorrect);

    if (isCorrect) {
        selectedBtn.classList.add('correct');
        score += 10;
        scoreText.innerText = score;
    } else {
        selectedBtn.classList.add('wrong');
        // Highlight correct answer
        const buttons = optionsContainer.getElementsByTagName('button');
        for (let btn of buttons) {
            if (btn.innerText === currentQuestion.meaning) {
                btn.classList.add('correct');
            }
        }
    }

    setTimeout(() => {
        getNewQuestion();
    }, 1500);
}

function startTimer() {
    timeLeft = TIME_PER_QUESTION;
    timerText.innerText = timeLeft;
    clearInterval(timer); // clear any existing timer

    timer = setInterval(() => {
        timeLeft--;
        timerText.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            acceptingAnswers = false;
            // Time out - show correct answer then move on
            const buttons = optionsContainer.getElementsByTagName('button');
            let foundCorrect = false;
            for (let btn of buttons) {
                if (btn.innerText === currentQuestion.meaning) {
                    btn.classList.add('correct');
                } else {
                    btn.classList.add('wrong'); // Mark others somewhat to indicate time up? Or just show correct.
                }
            }
            setTimeout(() => {
                getNewQuestion();
            }, 1500);
        }
    }, 1000);
}

function endGame() {
    quizScreen.classList.remove('active');
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    resultScreen.classList.add('active');

    finalScoreText.innerText = score;

    // Evaluation Logic
    const maxScore = QUESTIONS_PER_GAME * 10;
    if (score === maxScore) {
        evaluationText.innerText = "Masya Allah! Sempurna!";
    } else if (score >= maxScore * 0.7) {
        evaluationText.innerText = "Alhamdulillah, Bagus sekali!";
    } else if (score >= maxScore * 0.4) {
        evaluationText.innerText = "Bagus, tingkatkan lagi ya!";
    } else {
        evaluationText.innerText = "Jangan menyerah, ayo belajar lagi!";
    }
}

function playAudio(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-SA'; // Arabic accent/language for Asmaul Husna
        utterance.rate = 0.9; // Slightly slower
        window.speechSynthesis.speak(utterance);
    } else {
        console.log("Web Speech API not supported.");
    }
}

function playFeedbackSound(isCorrect) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const audioCtx = new AudioContext();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (isCorrect) {
        // Success sound (Ding!)
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5);
    } else {
        // Wrong sound (Low buzz)
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + 0.2);

        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
    }
}
