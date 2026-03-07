// ── Lecture file registry ──────────────────────────────────────────────────
const LECTURE_FILES = {
    'lecture1.json': 'Lecture 1 – Databases & File Systems',
    'lecture2.json': 'Lecture 2 – Data Modeling & Data Models',
    'lecture3.json': 'Lecture 3 – ER Model & Attributes'
};

// Raw data cache so we don't re-fetch on every section switch
let lectureCache = {};

// Currently loaded lecture filename
let currentLectureFile = null;

// Pending section to load after user picks a lecture
let pendingSection = null;

// The active dataset (normalised to front/back/choices format)
let flashcardsData = { identification: [], multipleChoice: [] };

let currentSection = 'identification';
let currentIndex = 0;
let isFlipped = false;
let shuffledCards = [];
let cardStats = {};

let scores = {
    identification: { correct: 0, total: 0 },
    multipleChoice: { correct: 0, total: 0 }
};

// ── Normalise JSON from new format (question/answer) to internal format ─────
function normaliseData(raw) {
    const norm = { identification: [], multipleChoice: [] };

    (raw.identification || []).forEach(item => {
        norm.identification.push({
            id: item.id,
            front: item.question || item.front || '',
            back:  item.answer  || item.back  || ''
        });
    });

    (raw.multipleChoice || []).forEach(item => {
        norm.multipleChoice.push({
            id:      item.id,
            front:   item.question || item.front || '',
            choices: item.choices || [],
            answer:  item.answer  || ''
        });
    });

    return norm;
}

// ── Modal helpers ───────────────────────────────────────────────────────────
function showModal(section) {
    pendingSection = section;
    const subtitle = section === 'identification'
        ? 'Identification mode — pick a lecture to study'
        : 'Multiple Choice mode — pick a lecture to study';
    document.getElementById('modal-subtitle').textContent = subtitle;
    document.getElementById('modal-overlay').classList.add('active');
}

function hideModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}

function showLoading() {
    const el = document.getElementById('loading-overlay');
    if (el) el.classList.add('active');
}

function hideLoading() {
    const el = document.getElementById('loading-overlay');
    if (el) el.classList.remove('active');
}

// ── Fetch + cache a lecture JSON file ──────────────────────────────────────
async function fetchLecture(filename) {
    if (lectureCache[filename]) return lectureCache[filename];
    const resp = await fetch(filename);
    if (!resp.ok) throw new Error(`Could not load ${filename}`);
    const raw = await resp.json();
    const data = normaliseData(raw);
    lectureCache[filename] = data;
    return data;
}

// ── Load a lecture and switch to the given section ─────────────────────────
async function loadLecture(filename, section) {
    hideModal();
    showLoading();

    try {
        const data = await fetchLecture(filename);
        flashcardsData = data;
        currentLectureFile = filename;

        // Reset scores for both sections whenever a new lecture is loaded
        scores.identification = { correct: 0, total: 0 };
        scores.multipleChoice = { correct: 0, total: 0 };

        // Update header badge
        const badge = document.getElementById('lecture-badge');
        if (badge) badge.textContent = LECTURE_FILES[filename] || filename;

        loadSection(section);
    } catch (err) {
        alert('Failed to load lecture: ' + err.message);
    } finally {
        hideLoading();
    }
}

// ── App init ───────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    loadStats();
    setupEventListeners();

    // Add loading overlay to card-container dynamically
    const cc = document.querySelector('.card-container');
    if (cc) {
        const lo = document.createElement('div');
        lo.id = 'loading-overlay';
        lo.className = 'loading-overlay';
        lo.textContent = 'Loading…';
        cc.appendChild(lo);
    }

    // Show the modal straight away for the default section
    showModal('identification');
}

function setupEventListeners() {
    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // Section navigation — always show lecture picker first
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            showModal(e.target.dataset.section);
        });
    });

    // Card flip
    document.getElementById('flashcard').addEventListener('click', flipCard);

    // Navigation buttons
    document.getElementById('prev-btn').addEventListener('click', previousCard);
    document.getElementById('next-btn').addEventListener('click', nextCard);

    // Shuffle and reset
    document.getElementById('shuffle-btn').addEventListener('click', shuffleCards);
    document.getElementById('reset-btn').addEventListener('click', resetCards);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') previousCard();
        if (e.key === 'ArrowRight') nextCard();
        if (e.key === ' ') { e.preventDefault(); flipCard(); }
        if (e.key === 'Escape') hideModal();
    });


    // Change Lecture button — opens modal keeping the current section
    document.getElementById("change-lecture-btn").addEventListener("click", () => {
        showModal(currentSection);
    });
    // Modal — lecture buttons
    document.querySelectorAll('.lecture-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            loadLecture(btn.dataset.file, pendingSection);
        });
    });

    // Modal — cancel
    document.getElementById('modal-cancel').addEventListener('click', () => {
        hideModal();
        // If no lecture loaded yet keep modal closable without crashing
        if (!currentLectureFile) {
            // Re-mark first nav button as active
            document.querySelectorAll('.nav-btn')[0].classList.add('active');
        }
    });

    // Close modal on backdrop click
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
        if (e.target === document.getElementById('modal-overlay')) hideModal();
    });

    // Load theme preference
    loadThemePreference();
}

function loadSection(section) {
    currentSection = section;
    isFlipped = false;
    shuffledCards = [...(flashcardsData[section] || [])];
    scores[section] = scores[section] || { correct: 0, total: 0 };
    scores[section].correct = 0;
    scores[section].total = shuffledCards.length;

    document.getElementById('footer-text').textContent = 'Click the card to reveal the answer';
    document.getElementById('footer-hint').style.display = 'none';

    if (shuffledCards.length > 0) {
        currentIndex = getWeightedRandomCardIndex();
        updateCard();
    } else {
        updateCard();
    }
}

function updateCard() {
    if (shuffledCards.length === 0) {
        document.getElementById('front-text').textContent = 'No cards available.';
        document.getElementById('back-text').textContent = '';
        document.getElementById('choices-container').innerHTML = '';
        document.getElementById('feedback-container').innerHTML = '';
        document.getElementById('footer-hint').style.display = 'none';
        document.getElementById('prev-btn').disabled = true;
        document.getElementById('next-btn').disabled = true;
        return;
    }

    const card = shuffledCards[currentIndex];
    const isMC = currentSection === 'multipleChoice';
    const isID = currentSection === 'identification';

    const flashcardEl = document.getElementById('flashcard');
    const cardInnerEl = flashcardEl.querySelector('.card-inner');
    if (cardInnerEl) cardInnerEl.style.transition = 'none';

    flashcardEl.classList.remove('flipped');
    isFlipped = false;

    document.getElementById('front-text').textContent = card.front;
    document.getElementById('back-text').textContent = isMC ? `Answer: ${card.answer}` : card.back;

    if (cardInnerEl) {
        requestAnimationFrame(() => { cardInnerEl.style.transition = ''; });
    }

    document.getElementById('prev-btn').disabled = true;
    document.getElementById('next-btn').disabled = shuffledCards.length === 0;

    updateScoreDisplay();

    document.getElementById('choices-container').innerHTML = '';
    document.getElementById('feedback-container').innerHTML = '';
    document.getElementById('footer-hint').style.display = 'none';

    if (isMC) displayChoices(card);
    if (isID && isFlipped) showIdentificationFeedback(card);
}

function displayChoices(card) {
    const container = document.getElementById('choices-container');
    container.innerHTML = '';
    const cardId = card.id;
    let answeredThisCard = false;

    card.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = choice;

        btn.addEventListener('click', () => {
            if (answeredThisCard) return;
            answeredThisCard = true;

            const isCorrect = choice === card.answer;
            updateCardStats(currentSection, cardId, isCorrect);
            if (isCorrect) scores[currentSection].correct++;

            document.querySelectorAll('.choice-btn').forEach(b => {
                b.disabled = true;
                b.classList.remove('selected');
                if (isCorrect && b === btn) b.classList.add('correct');
                else if (!isCorrect && b === btn) b.classList.add('incorrect');
                else if (b.textContent === card.answer) b.classList.add('correct');
            });

            updateScoreDisplay();
            document.getElementById('footer-text').textContent =
                isCorrect ? '✓ Correct!' : '✗ Incorrect. The correct answer is ' + card.answer;
        });

        container.appendChild(btn);
    });
}

function updateScoreDisplay() {
    const score = scores[currentSection] || { correct: 0, total: 0 };
    document.getElementById('correct-count').textContent = score.correct;
    document.getElementById('total-count').textContent = score.total;
    const pct = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    document.getElementById('score-percentage').textContent = pct + '%';
}

function showIdentificationFeedback(card) {
    const container = document.getElementById('feedback-container');
    const hint = document.getElementById('footer-hint');

    container.innerHTML = '';
    hint.style.display = currentSection === 'identification' && isFlipped ? 'block' : 'none';

    const yesBtn = document.createElement('button');
    yesBtn.className = 'feedback-btn correct-btn';
    yesBtn.textContent = '✓ Yes, I got it right';
    yesBtn.addEventListener('click', () => {
        updateCardStats(currentSection, card.id, true);
        scores[currentSection].correct++;
        updateScoreDisplay();
        disableFeedbackButtons();
        hint.textContent = '✓ Great job! Moving on...';
    });

    const noBtn = document.createElement('button');
    noBtn.className = 'feedback-btn incorrect-btn';
    noBtn.textContent = '✗ No, I got it wrong';
    noBtn.addEventListener('click', () => {
        updateCardStats(currentSection, card.id, false);
        updateScoreDisplay();
        disableFeedbackButtons();
        hint.textContent = '✗ Keep practicing!';
    });

    container.appendChild(yesBtn);
    container.appendChild(noBtn);
}

function disableFeedbackButtons() {
    document.querySelectorAll('.feedback-btn').forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.6';
        btn.style.cursor = 'not-allowed';
    });
}

function flipCard() {
    const card = document.getElementById('flashcard');
    card.classList.toggle('flipped');
    isFlipped = !isFlipped;

    if (currentSection === 'identification') {
        const currentCard = shuffledCards[currentIndex];
        if (isFlipped) showIdentificationFeedback(currentCard);
        else {
            document.getElementById('feedback-container').innerHTML = '';
            document.getElementById('footer-hint').style.display = 'none';
        }
    }
}

function previousCard() { /* disabled — weighted random selection drives navigation */ }

function nextCard() { selectNextCard(); }

function shuffleCards() {
    shuffledCards = [...(flashcardsData[currentSection] || [])];
    for (let i = shuffledCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
    }
    selectNextCard();
}

function resetCards() {
    isFlipped = false;
    scores[currentSection] = { correct: 0, total: shuffledCards.length };
    document.getElementById('footer-text').textContent = 'Click the card to reveal the answer';
    document.getElementById('footer-hint').style.display = 'none';
    document.getElementById('feedback-container').innerHTML = '';
    shuffledCards = [...(flashcardsData[currentSection] || [])];
    selectNextCard();
}

function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme-preference', newTheme);
}

function loadThemePreference() {
    const html = document.documentElement;
    const preference = localStorage.getItem('theme-preference');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = preference || (systemDark ? 'dark' : 'light');
    html.setAttribute('data-theme', theme);
}

function loadStats() {
    const stored = localStorage.getItem('flashcardStats');
    if (stored) {
        try { cardStats = JSON.parse(stored); } catch (e) { cardStats = {}; }
    }
}

function saveStats() {
    localStorage.setItem('flashcardStats', JSON.stringify(cardStats));
}

function getCardStats(section, cardId) {
    cardStats[section] = cardStats[section] || {};
    cardStats[section][cardId] = cardStats[section][cardId] || {
        correct: 0,
        wrong: 0,
        streak: 0  // consecutive correct answers in a row
    };
    return cardStats[section][cardId];
}

function updateCardStats(section, cardId, isCorrect) {
    const stats = getCardStats(section, cardId);
    if (isCorrect) {
        stats.correct += 1;
        stats.streak  = (stats.streak || 0) + 1;  // build streak
    } else {
        stats.wrong  += 1;
        stats.streak  = 0;                         // any wrong resets streak
    }
    saveStats();
}

/*
 * Improved spaced-repetition weight algorithm
 * ─────────────────────────────────────────────
 * Weight determines how likely a card is to be picked next.
 * Higher weight  →  appears more often.
 * Lower weight   →  appears less often.
 *
 * Rules:
 *  1. Unseen cards  →  neutral weight (1.0).
 *  2. Each wrong answer adds +2.0 to weight (strong boost).
 *  3. Accuracy (correct / total) progressively lowers weight.
 *  4. Streak multiplier dominates once the user is on a roll:
 *       streak 0  →  ×1.0   (just got it wrong — full weight)
 *       streak 1  →  ×0.55  (got it once — slight relief)
 *       streak 2  →  ×0.25  (getting it — moderate cool-down)
 *       streak 3  →  ×0.08  (comfortable — strong cool-down)
 *       streak 4+ →  ×0.03  (mastered — nearly invisible)
 *  5. Current card is excluded (weight = 0) to prevent repeats.
 *  6. Floor of 0.05 keeps every card reachable.
 */
function getWeightedRandomCardIndex() {
    const weights = shuffledCards.map((card, idx) => {
        // Never pick the card that was just shown
        if (idx === currentIndex) return 0;

        const stats    = getCardStats(currentSection, card.id);
        const correct  = stats.correct || 0;
        const wrong    = stats.wrong   || 0;
        const streak   = stats.streak  || 0;
        const total    = correct + wrong;

        // Card has never been seen — neutral
        if (total === 0) return 1.0;

        const accuracy = correct / total;

        // Base: start at 1, each wrong answer inflates weight
        let weight = 1.0 + (wrong * 2.0);

        // Accuracy drag: pulls weight down as ratio improves
        weight *= (1 - accuracy * 0.65);

        // Streak multiplier — the longer the correct run, the less we show it
        const streakMultiplier =
            streak >= 4 ? 0.03 :
            streak === 3 ? 0.08 :
            streak === 2 ? 0.25 :
            streak === 1 ? 0.55 :
            1.0; // streak 0 = last answer was wrong

        weight *= streakMultiplier;

        return Math.max(0.05, weight);
    });

    const totalWeight = weights.reduce((sum, w) => sum + w, 0);

    // Edge case: all weights are 0 (single-card deck) — pick any
    if (totalWeight === 0) return Math.floor(Math.random() * shuffledCards.length);

    const random = Math.random() * totalWeight;
    let cumulative = 0;
    for (let i = 0; i < weights.length; i++) {
        cumulative += weights[i];
        if (random < cumulative) return i;
    }
    return weights.length - 1;
}

function selectNextCard() {
    currentIndex = getWeightedRandomCardIndex();
    updateCard();
}
