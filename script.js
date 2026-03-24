// ── Lecture file registry ──────────────────────────────────────────────────
const LECTURE_FILES = {
    'lecture1.json':          'Lecture 1 – Databases & File Systems',
    'lecture2.json':          'Lecture 2 – Data Modeling & Data Models',
    'lecture3.json':          'Lecture 3 – ER Model & Attributes',
    'lecture4.json':          'Lecture 4 – Advanced Data Modeling',
    'lecture5.json':          'Lecture 5 – The Relational Database Model',
    'lecture1_extended.json': 'Lecture 1 – Extended Reviewer',
    'lecture2_extended.json': 'Lecture 2 – Extended Reviewer',
    'lecture3_extended.json': 'Lecture 3 – Extended Reviewer'
};

// Human-readable labels for known section keys
const SECTION_LABELS = {
    identification:            'Identification',
    multipleChoice:            'Multiple Choice',
    modifiedTrueOrFalse:       'True or False',
    codeSnippetInterpretation: 'Code Snippets',
    problemSolving:            'Problem Solving'
};

let lectureCache       = {};
let currentLectureFile = null;

// flashcardsData: dynamic object
//   { [sectionKey]: { label, isMultipleChoice, cards:[{id,front,back?,choices?,answer?,explanation?}] } }
let flashcardsData = {};

let currentSection = null;
let currentIndex   = 0;
let isFlipped      = false;
let shuffledCards  = [];
let cardStats      = {};

// Spaced repetition toggle
let spacedRepetitionEnabled = true;

// ── Sequential-mode answered tracking ─────────────────────────────────────
// Stores card IDs that have already been answered this session.
// Only used when spacedRepetitionEnabled === false.
let answeredCardIds = new Set();

// ── Spaced-repetition answered tracking ────────────────────────────────────
// srAnsweredCardIds – all card IDs answered at least once this SR session
//   (used to block the re-answer bug when navigating back & reflipping).
// srCorrectCardIds  – card IDs that were answered CORRECTLY at least once;
//   each card counts only once toward the "Correct" score.
let srAnsweredCardIds = new Set();
let srCorrectCardIds  = new Set();

// scores: dynamic — { [sectionKey]: { correct, wrong, total } }
let scores = {};

// ── Section key → human label ──────────────────────────────────────────────
function sectionKeyToLabel(key) {
    if (SECTION_LABELS[key]) return SECTION_LABELS[key];
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, s => s.toUpperCase())
        .trim();
}

function isMCSectionKey(key) {
    return key === 'multipleChoice' || key === 'modifiedTrueOrFalse';
}

// ── Normalise a single item into an internal card object ──────────────────
function normaliseItem(item) {
    if (item.statement_I !== undefined) {
        const front =
            `Statement I: ${item.statement_I || ''}\n\n` +
            `Statement II: ${item.statement_II || ''}`;
        const opts    = item.options || {};
        const choices = ['A', 'B', 'C', 'D']
            .filter(k => opts[k] !== undefined)
            .map(k => `${k}) ${opts[k]}`);
        return { id: item.id, front, choices, answer: item.answer || '', explanation: item.explanation || '' };
    }
    if (Array.isArray(item.choices)) {
        return { id: item.id, front: item.question || item.front || '', choices: item.choices, answer: item.answer || '', explanation: item.explanation || '' };
    }
    if (item.snippet !== undefined) {
        return { id: item.id, front: `${item.snippet}\n\n${item.question || ''}`.trim(), back: item.answer || item.back || '' };
    }
    return { id: item.id, front: item.question || item.front || '', back: item.answer || item.back || '' };
}

// ── Master normaliser — handles ALL three JSON formats ────────────────────
//
//   FORMAT A  flat/legacy:  { identification:[…], multipleChoice:[…], modifiedTrueOrFalse:[…] }
//   FORMAT B  sections array: { sections:[{type, questions:[…]}] }
//   FORMAT C  sections object: { sections:{ sectionName:[…], … } }
//
function normaliseData(raw) {
    const result = {};

    // FORMAT B
    if (Array.isArray(raw.sections)) {
        raw.sections.forEach(sec => {
            const key   = sec.type || 'unknown';
            const items = sec.questions || sec.items || [];
            if (!items.length) return;
            const isMC = isMCSectionKey(key) || (items[0] && Array.isArray(items[0].choices)) || (items[0] && items[0].statement_I !== undefined);
            result[key] = { label: sectionKeyToLabel(key), isMultipleChoice: isMC, cards: items.map(normaliseItem) };
        });
        return result;
    }

    // FORMAT C
    if (raw.sections && typeof raw.sections === 'object' && !Array.isArray(raw.sections)) {
        Object.entries(raw.sections).forEach(([key, items]) => {
            if (!Array.isArray(items) || !items.length) return;
            const isMC = isMCSectionKey(key) || Array.isArray(items[0].choices) || items[0].statement_I !== undefined;
            result[key] = { label: sectionKeyToLabel(key), isMultipleChoice: isMC, cards: items.map(normaliseItem) };
        });
        return result;
    }

    // FORMAT A
    if (Array.isArray(raw.identification) && raw.identification.length) {
        result.identification = { label: 'Identification', isMultipleChoice: false, cards: raw.identification.map(normaliseItem) };
    }
    const mcItems = [...(raw.multipleChoice || []), ...(raw.modifiedTrueOrFalse || [])];
    if (mcItems.length) {
        result.multipleChoice = { label: 'Multiple Choice', isMultipleChoice: true, cards: mcItems.map(normaliseItem) };
    }

    if (!Object.keys(result).length) {
        console.warn('[normaliseData] No sections produced. Raw keys:', Object.keys(raw).join(', '));
    }
    return result;
}

// ── Modal helpers ──────────────────────────────────────────────────────────
function showModal()   { document.getElementById('modal-overlay').classList.add('active'); }
function hideModal()   { document.getElementById('modal-overlay').classList.remove('active'); }
function showLoading() { const el = document.getElementById('loading-overlay'); if (el) el.classList.add('active'); }
function hideLoading() { const el = document.getElementById('loading-overlay'); if (el) el.classList.remove('active'); }

// ── Fetch + cache ──────────────────────────────────────────────────────────
async function fetchLecture(filename) {
    if (lectureCache[filename]) return lectureCache[filename];
    const resp = await fetch(filename);
    if (!resp.ok) throw new Error(`Could not load "${filename}" (HTTP ${resp.status})`);
    const data = normaliseData(await resp.json());
    lectureCache[filename] = data;
    return data;
}

// ── Load a lecture ─────────────────────────────────────────────────────────
async function loadLecture(filename) {
    hideModal();
    showLoading();
    try {
        const data = await fetchLecture(filename);
        if (!Object.keys(data).length) throw new Error('No recognisable sections found in this file.');

        flashcardsData     = data;
        currentLectureFile = filename;

        scores = {};
        Object.keys(flashcardsData).forEach(k => { scores[k] = { correct: 0, wrong: 0, total: 0 }; });

        const badge = document.getElementById('lecture-badge');
        if (badge) badge.textContent = LECTURE_FILES[filename] || filename;

        renderNavButtons();
        const firstKey = Object.keys(flashcardsData)[0];
        if (firstKey) loadSection(firstKey);
    } catch (err) {
        alert('Failed to load lecture:\n' + err.message);
    } finally {
        hideLoading();
    }
}

// ── Render dynamic nav buttons ─────────────────────────────────────────────
function renderNavButtons() {
    const container = document.getElementById('nav-buttons');
    container.innerHTML = '';
    Object.keys(flashcardsData).forEach(key => {
        const btn = document.createElement('button');
        btn.className       = 'nav-btn';
        btn.dataset.section = key;
        btn.textContent     = flashcardsData[key].label;
        btn.addEventListener('click', () => loadSection(key));
        container.appendChild(btn);
    });
}

function setActiveNavBtn(sectionKey) {
    document.querySelectorAll('#nav-buttons .nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === sectionKey);
    });
}

// ── App init ───────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    loadStats();
    loadSRPreference();
    setupEventListeners();

    const cc = document.querySelector('.card-container');
    if (cc) {
        const lo = document.createElement('div');
        lo.id = 'loading-overlay'; lo.className = 'loading-overlay'; lo.textContent = 'Loading…';
        cc.appendChild(lo);
    }
    showModal();
}

function setupEventListeners() {
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.getElementById('flashcard').addEventListener('click', flipCard);
    document.getElementById('prev-btn').addEventListener('click', previousCard);
    document.getElementById('next-btn').addEventListener('click', nextCard);
    document.getElementById('shuffle-btn').addEventListener('click', shuffleCards);
    document.getElementById('reset-btn').addEventListener('click', resetCards);

    document.getElementById('sr-toggle').addEventListener('change', (e) => {
        spacedRepetitionEnabled = e.target.checked;
        applySpacedRepetitionChange();
    });

    document.addEventListener('keydown', (e) => {
        // ArrowLeft only works in SR mode (prev disabled in sequential)
        if (e.key === 'ArrowLeft' && spacedRepetitionEnabled) previousCard();
        if (e.key === 'ArrowRight') nextCard();
        if (e.key === ' ') { e.preventDefault(); flipCard(); }
        if (e.key === 'Escape') hideModal();
    });

    document.getElementById('change-lecture-btn').addEventListener('click', showModal);

    document.querySelectorAll('.lecture-btn').forEach(btn => {
        btn.addEventListener('click', () => loadLecture(btn.dataset.file));
    });

    document.getElementById('json-upload').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const raw  = JSON.parse(ev.target.result);
                const data = normaliseData(raw);
                if (!Object.keys(data).length) {
                    alert('No recognisable sections found.\n\nSupported formats:\n• Flat: { identification:[…], multipleChoice:[…] }\n• Sections array: { sections:[{type, questions:[…]}] }\n• Sections object: { sections:{ sectionName:[…] } }');
                    return;
                }
                const key = `upload:${file.name}`;
                lectureCache[key]  = data;
                LECTURE_FILES[key] = `📄 ${file.name.replace('.json', '')}`;
                const filenameEl = document.getElementById('upload-filename');
                if (filenameEl) { filenameEl.textContent = `✓ Loaded: ${file.name}`; filenameEl.style.display = 'block'; }
                loadLecture(key);
            } catch (err) { alert('Could not parse the JSON file:\n' + err.message); }
        };
        reader.onerror = () => alert('Failed to read the file.');
        reader.readAsText(file);
        e.target.value = '';
    });

    document.getElementById('modal-cancel').addEventListener('click', hideModal);
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
        if (e.target === document.getElementById('modal-overlay')) hideModal();
    });

    loadThemePreference();
}

// ── Spaced repetition ──────────────────────────────────────────────────────
function loadSRPreference() {
    if (localStorage.getItem('sr-preference') === '0') spacedRepetitionEnabled = false;
    const cb = document.getElementById('sr-toggle');
    if (cb) cb.checked = spacedRepetitionEnabled;
    syncSRStatusUI();
}

function applySpacedRepetitionChange() {
    syncSRStatusUI();
    answeredCardIds.clear();
    srAnsweredCardIds.clear();
    srCorrectCardIds.clear();
    if (currentSection) scores[currentSection] = { correct: 0, wrong: 0, total: shuffledCards.length };

    if (shuffledCards.length > 0) {
        currentIndex = spacedRepetitionEnabled ? getWeightedRandomCardIndex() : 0;
        isFlipped    = false;
        document.getElementById('feedback-container').innerHTML = '';
        document.getElementById('footer-hint').style.display   = 'none';
        document.getElementById('footer-text').textContent     = 'Click the card to reveal the answer';
        updateCard();
    } else {
        updateScoreDisplay();
    }
    localStorage.setItem('sr-preference', spacedRepetitionEnabled ? '1' : '0');
}

function syncSRStatusUI() {
    const el = document.getElementById('sr-status');
    if (!el) return;
    el.textContent = spacedRepetitionEnabled ? 'ON' : 'OFF';
    el.className   = `sr-status ${spacedRepetitionEnabled ? 'sr-on' : 'sr-off'}`;
}

// ── Section loader ─────────────────────────────────────────────────────────
function loadSection(sectionKey) {
    const sectionData = flashcardsData[sectionKey];
    if (!sectionData) return;

    currentSection  = sectionKey;
    isFlipped       = false;
    shuffledCards   = [...(sectionData.cards || [])];
    answeredCardIds = new Set();
    srAnsweredCardIds = new Set();
    srCorrectCardIds  = new Set();

    scores[sectionKey] = { correct: 0, wrong: 0, total: shuffledCards.length };

    setActiveNavBtn(sectionKey);

    document.getElementById('footer-text').textContent      = 'Click the card to reveal the answer';
    document.getElementById('footer-hint').style.display    = 'none';
    document.getElementById('feedback-container').innerHTML = '';

    if (shuffledCards.length > 0) {
        currentIndex = spacedRepetitionEnabled ? getWeightedRandomCardIndex() : 0;
    }
    updateCard();
}

// ── Remaining cards (sequential mode) ─────────────────────────────────────
function getRemainingCount() {
    return shuffledCards.filter(c => !answeredCardIds.has(c.id)).length;
}

// Find the next unanswered card index after `fromIndex` (wraps once).
// Returns -1 if all cards are answered.
function getNextUnansweredIndex(fromIndex) {
    const total = shuffledCards.length;
    for (let offset = 1; offset <= total; offset++) {
        const idx  = (fromIndex + offset) % total;
        if (!answeredCardIds.has(shuffledCards[idx].id)) return idx;
    }
    return -1;
}

// ── Card renderer ──────────────────────────────────────────────────────────
function updateCard() {
    const sectionData = flashcardsData[currentSection] || {};
    const isMC        = sectionData.isMultipleChoice || false;

    if (shuffledCards.length === 0) {
        updateScoreDisplay();
        updateProgressBadge();
        document.getElementById('front-text').textContent       = 'No cards found in this section.';
        document.getElementById('back-text').textContent        = '';
        document.getElementById('choices-container').innerHTML  = '';
        document.getElementById('feedback-container').innerHTML = '';
        document.getElementById('footer-hint').style.display    = 'none';
        document.getElementById('prev-btn').disabled            = true;
        document.getElementById('next-btn').disabled            = true;
        return;
    }

    // Sequential mode: all cards answered → show completion screen
    if (!spacedRepetitionEnabled && answeredCardIds.size >= shuffledCards.length) {
        showCompletionScreen();
        return;
    }

    const card        = shuffledCards[currentIndex];
    const flashcardEl = document.getElementById('flashcard');
    const cardInnerEl = flashcardEl.querySelector('.card-inner');

    if (cardInnerEl) cardInnerEl.style.transition = 'none';
    flashcardEl.classList.remove('flipped');
    isFlipped = false;

    document.getElementById('front-text').textContent = card.front;
    document.getElementById('back-text').textContent  = isMC
        ? `Answer: ${card.answer}`
        : (card.back || '');

    // MC mode: shorter card so choices fit comfortably below
    flashcardEl.classList.toggle('mc-mode', isMC);
    flashcardEl.style.cursor = isMC ? 'default' : 'pointer';

    if (cardInnerEl) requestAnimationFrame(() => { cardInnerEl.style.transition = ''; });

    // ── Prev button:
    //   SR ON  → enabled (weighted random, can always go back)
    //   SR OFF → always disabled (sequential, no going back)
    document.getElementById('prev-btn').disabled = !spacedRepetitionEnabled || shuffledCards.length === 0;
    document.getElementById('next-btn').disabled = shuffledCards.length === 0;

    updateScoreDisplay();
    updateProgressBadge();

    document.getElementById('choices-container').innerHTML   = '';
    document.getElementById('feedback-container').innerHTML  = '';
    document.getElementById('footer-hint').style.display    = 'none';
    document.getElementById('footer-text').textContent      = isMC
        ? 'Choose the correct answer.'
        : 'Click the card to reveal the answer';

    if (isMC) displayChoices(card);
}

// ── Completion screen (sequential mode, all cards answered) ───────────────
function showCompletionScreen() {
    const flashcardEl = document.getElementById('flashcard');
    flashcardEl.classList.remove('flipped');
    flashcardEl.classList.remove('mc-mode');
    flashcardEl.style.cursor = 'default';

    const score = scores[currentSection] || { correct: 0, wrong: 0, total: 0 };
    const pct   = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    const emoji = pct === 100 ? '🏆' : pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '📚';

    document.getElementById('front-text').textContent =
        `${emoji} All done!\n\n` +
        `You answered all ${score.total} cards.\n` +
        `Correct: ${score.correct}   Wrong: ${score.wrong}\n` +
        `Score: ${pct}%\n\n` +
        `Press Reset to try again.`;
    document.getElementById('back-text').textContent        = '';
    document.getElementById('choices-container').innerHTML  = '';
    document.getElementById('feedback-container').innerHTML = '';
    document.getElementById('footer-hint').style.display    = 'none';
    document.getElementById('footer-text').textContent      = 'Press Reset to start over.';
    document.getElementById('prev-btn').disabled            = true;
    document.getElementById('next-btn').disabled            = true;

    updateProgressBadge();
    updateScoreDisplay();
}

// ── Progress badge (sequential mode only) ─────────────────────────────────
function updateProgressBadge() {
    const badge   = document.getElementById('progress-badge');
    const wrapper = document.getElementById('score-progress-item');
    if (!badge || !wrapper) return;

    if (spacedRepetitionEnabled || !currentSection || !shuffledCards.length) {
        wrapper.style.display = 'none';
        return;
    }

    const remaining = getRemainingCount();
    const total     = shuffledCards.length;
    const done      = total - remaining;

    wrapper.style.display = '';
    badge.textContent     = `${done} / ${total} done`;
    badge.className       = `progress-badge ${remaining === 0 ? 'progress-badge--done' : ''}`;
}

// ── Multiple-choice renderer ───────────────────────────────────────────────
function displayChoices(card) {
    const container = document.getElementById('choices-container');
    container.innerHTML = '';
    let answered = false;

    card.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className   = 'choice-btn';
        btn.textContent = choice;

        btn.addEventListener('click', () => {
            if (answered) return;
            answered = true;

            const isCorrect = choice === card.answer;
            updateCardStats(currentSection, card.id, isCorrect);

            if (spacedRepetitionEnabled) {
                if (isCorrect) {
                    // Always increment raw correct counter.
                    scores[currentSection].correct++;
                    // Mastery progress only on first correct answer.
                    if (!srCorrectCardIds.has(card.id)) {
                        srCorrectCardIds.add(card.id);
                    }
                } else {
                    // Always increment raw wrong counter.
                    scores[currentSection].wrong = (scores[currentSection].wrong || 0) + 1;
                }
                srAnsweredCardIds.add(card.id);
            } else {
                if (isCorrect) scores[currentSection].correct++;
                else           scores[currentSection].wrong = (scores[currentSection].wrong || 0) + 1;
            }

            // Mark card as answered in sequential mode
            if (!spacedRepetitionEnabled) {
                answeredCardIds.add(card.id);
                updateProgressBadge();
            }

            document.querySelectorAll('.choice-btn').forEach(b => {
                b.disabled = true;
                b.classList.remove('selected');
                if (isCorrect && b === btn)             b.classList.add('correct');
                else if (!isCorrect && b === btn)        b.classList.add('incorrect');
                else if (b.textContent === card.answer)  b.classList.add('correct');
            });

            updateScoreDisplay();

            let msg = isCorrect
                ? '✓ Correct!'
                : `✗ Incorrect. The correct answer is: ${card.answer}`;
            if (card.explanation) msg += `\n\n💡 ${card.explanation}`;
            document.getElementById('footer-text').textContent = msg;

            if (!spacedRepetitionEnabled) {
                document.getElementById('next-btn').classList.add('next-btn--ready');
            }
        });

        container.appendChild(btn);
    });
}

// ── Score display ──────────────────────────────────────────────────────────
function updateScoreDisplay() {
    const score = (currentSection && scores[currentSection])
        ? scores[currentSection]
        : { correct: 0, wrong: 0, total: 0 };

    if (spacedRepetitionEnabled) {
        // Show unique-correct / total so the user can see their mastery progress
        const uniqueCorrect = srCorrectCardIds.size;
        const totalCards    = shuffledCards.length;
        document.getElementById('correct-count').textContent = `${uniqueCorrect} / ${totalCards}`;
    } else {
        document.getElementById('correct-count').textContent = score.correct;
    }

    document.getElementById('wrong-count').textContent   = score.wrong || 0;
    document.getElementById('total-count').textContent   = score.total;

    const pct = score.total > 0
        ? Math.round((score.correct / score.total) * 100)
        : 0;
    document.getElementById('score-percentage').textContent = pct + '%';

    const wrongItem = document.getElementById('score-wrong-item');
    const totalItem = document.getElementById('score-total-item');
    const pctItem   = document.getElementById('score-percentage-item');

    if (spacedRepetitionEnabled) {
        if (wrongItem) wrongItem.style.display = '';
        if (totalItem) totalItem.style.display = 'none';
        if (pctItem)   pctItem.style.display   = 'none';
    } else {
        if (wrongItem) wrongItem.style.display = 'none';
        if (totalItem) totalItem.style.display = '';
        if (pctItem)   pctItem.style.display   = '';
    }
}

// ── Flip-card feedback (identification / problemSolving / code snippets …) ─
function showIdentificationFeedback(card) {
    const container = document.getElementById('feedback-container');
    const hint      = document.getElementById('footer-hint');
    container.innerHTML = '';
    hint.style.display  = isFlipped ? 'block' : 'none';

    const yesBtn = document.createElement('button');
    yesBtn.className   = 'feedback-btn correct-btn';
    yesBtn.textContent = '✓ Yes, I got it right';
    yesBtn.addEventListener('click', () => {
        updateCardStats(currentSection, card.id, true);

        if (spacedRepetitionEnabled) {
            // Always bump the raw correct counter so the user sees feedback.
            scores[currentSection].correct++;
            // Mastery progress (X / Y) only advances on the FIRST correct answer.
            if (!srCorrectCardIds.has(card.id)) {
                srCorrectCardIds.add(card.id);
            }
            srAnsweredCardIds.add(card.id);
        } else {
            scores[currentSection].correct++;
        }

        markCardAnswered(card);
        updateScoreDisplay();
        disableFeedbackButtons();
        hint.textContent = '✓ Got it! Press Next to continue.';
        if (!spacedRepetitionEnabled) {
            document.getElementById('next-btn').classList.add('next-btn--ready');
        }
    });

    const noBtn = document.createElement('button');
    noBtn.className   = 'feedback-btn incorrect-btn';
    noBtn.textContent = '✗ No, I got it wrong';
    noBtn.addEventListener('click', () => {
        updateCardStats(currentSection, card.id, false);

        if (spacedRepetitionEnabled) {
            // Always bump the raw wrong counter.
            scores[currentSection].wrong = (scores[currentSection].wrong || 0) + 1;
            srAnsweredCardIds.add(card.id);
        } else {
            scores[currentSection].wrong = (scores[currentSection].wrong || 0) + 1;
        }

        markCardAnswered(card);
        updateScoreDisplay();
        disableFeedbackButtons();
        hint.textContent = '✗ Keep at it! Press Next to continue.';
        if (!spacedRepetitionEnabled) {
            document.getElementById('next-btn').classList.add('next-btn--ready');
        }
    });

    container.appendChild(yesBtn);
    container.appendChild(noBtn);
}

// Mark a card as answered and update progress badge (sequential mode only)
function markCardAnswered(card) {
    if (!spacedRepetitionEnabled) {
        answeredCardIds.add(card.id);
        updateProgressBadge();
    }
}

function disableFeedbackButtons() {
    document.querySelectorAll('.feedback-btn').forEach(btn => {
        btn.disabled = true; btn.style.opacity = '0.6'; btn.style.cursor = 'not-allowed';
    });
}

// ── Card flip ──────────────────────────────────────────────────────────────
function flipCard() {
    if (flashcardsData[currentSection]?.isMultipleChoice) return;

    const cardEl = document.getElementById('flashcard');
    cardEl.classList.toggle('flipped');
    isFlipped = !isFlipped;

    if (isFlipped) showIdentificationFeedback(shuffledCards[currentIndex]);
    else {
        document.getElementById('feedback-container').innerHTML = '';
        document.getElementById('footer-hint').style.display   = 'none';
    }
}

// ── Navigation ─────────────────────────────────────────────────────────────
function previousCard() {
    // Previous is only available in SR (weighted-random) mode
    if (!spacedRepetitionEnabled || shuffledCards.length === 0) return;
    // In SR mode there's no true "previous" history; we just go back one index
    currentIndex = (currentIndex - 1 + shuffledCards.length) % shuffledCards.length;
    updateCard();
}

function nextCard() {
    if (shuffledCards.length === 0) return;

    // Clear the "ready" glow on the Next button
    document.getElementById('next-btn').classList.remove('next-btn--ready');

    if (spacedRepetitionEnabled) {
        selectNextCard();
    } else {
        const next = getNextUnansweredIndex(currentIndex);
        if (next === -1) {
            showCompletionScreen();
        } else {
            currentIndex = next;
            updateCard();
        }
    }
}

// ── Shuffle & reset ────────────────────────────────────────────────────────
function shuffleCards() {
    shuffledCards = [...(flashcardsData[currentSection]?.cards || [])];
    for (let i = shuffledCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
    }
    answeredCardIds   = new Set();
    srAnsweredCardIds = new Set();
    srCorrectCardIds  = new Set();
    document.getElementById('next-btn').classList.remove('next-btn--ready');
    if (spacedRepetitionEnabled) selectNextCard();
    else { currentIndex = 0; updateCard(); }
}

function resetCards() {
    isFlipped         = false;
    answeredCardIds   = new Set();
    srAnsweredCardIds = new Set();
    srCorrectCardIds  = new Set();
    if (currentSection) scores[currentSection] = { correct: 0, wrong: 0, total: shuffledCards.length };
    document.getElementById('footer-text').textContent      = 'Click the card to reveal the answer';
    document.getElementById('footer-hint').style.display    = 'none';
    document.getElementById('feedback-container').innerHTML = '';
    document.getElementById('next-btn').classList.remove('next-btn--ready');
    shuffledCards = [...(flashcardsData[currentSection]?.cards || [])];

    if (spacedRepetitionEnabled) selectNextCard();
    else { currentIndex = 0; updateCard(); }
}

// ── Theme ──────────────────────────────────────────────────────────────────
function toggleTheme() {
    const html     = document.documentElement;
    const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme-preference', newTheme);
}

function loadThemePreference() {
    const html       = document.documentElement;
    const preference = localStorage.getItem('theme-preference');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    html.setAttribute('data-theme', preference || (systemDark ? 'dark' : 'light'));
}

// ── Persistent card stats ──────────────────────────────────────────────────
function loadStats() {
    const stored = localStorage.getItem('flashcardStats');
    if (stored) try { cardStats = JSON.parse(stored); } catch { cardStats = {}; }
}

function saveStats() { localStorage.setItem('flashcardStats', JSON.stringify(cardStats)); }

function getCardStats(section, cardId) {
    cardStats[section]         = cardStats[section]         || {};
    cardStats[section][cardId] = cardStats[section][cardId] || { correct: 0, wrong: 0, streak: 0 };
    return cardStats[section][cardId];
}

function updateCardStats(section, cardId, isCorrect) {
    const s = getCardStats(section, cardId);
    if (isCorrect) { s.correct++; s.streak = (s.streak || 0) + 1; }
    else           { s.wrong++;   s.streak = 0; }
    saveStats();
}

// ── Weighted-random SR algorithm ──────────────────────────────────────────
function getWeightedRandomCardIndex() {
    const weights = shuffledCards.map((card, idx) => {
        if (idx === currentIndex) return 0;
        const s       = getCardStats(currentSection, card.id);
        const correct = s.correct || 0;
        const wrong   = s.wrong   || 0;
        const streak  = s.streak  || 0;
        const total   = correct + wrong;
        if (total === 0) return 1.0;
        const accuracy = correct / total;
        let weight = 1.0 + (wrong * 2.0);
        weight *= (1 - accuracy * 0.65);
        const sm = streak >= 4 ? 0.03 : streak === 3 ? 0.08 : streak === 2 ? 0.25 : streak === 1 ? 0.55 : 1.0;
        return Math.max(0.05, weight * sm);
    });

    const total = weights.reduce((sum, w) => sum + w, 0);
    if (total === 0) return Math.floor(Math.random() * shuffledCards.length);

    let cumulative = 0;
    const rand = Math.random() * total;
    for (let i = 0; i < weights.length; i++) {
        cumulative += weights[i];
        if (rand < cumulative) return i;
    }
    return weights.length - 1;
}

function selectNextCard() {
    currentIndex = getWeightedRandomCardIndex();
    updateCard();
}
// Test