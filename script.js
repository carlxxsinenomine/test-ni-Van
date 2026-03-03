let flashcardsData = {};
let currentSection = 'identification';
let currentIndex = 0;
let isFlipped = false;
let shuffledCards = [];

// Load JSON data
fetch('flashcards.json')
    .then(response => response.json())
    .then(data => {
        flashcardsData = data;
        initializeApp();
    })
    .catch(error => console.error('Error loading flashcards:', error));

function initializeApp() {
    setupEventListeners();
    loadSection('identification');
}

function setupEventListeners() {
    // Section navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            loadSection(e.target.dataset.section);
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
        if (e.key === ' ') {
            e.preventDefault();
            flipCard();
        }
    });
}

function loadSection(section) {
    currentSection = section;
    currentIndex = 0;
    isFlipped = false;
    shuffledCards = [...flashcardsData[section]];
    updateCard();
}

function updateCard() {
    const card = shuffledCards[currentIndex];
    const isMC = currentSection === 'multipleChoice';

    // Update card content
    document.getElementById('front-text').textContent = card.front;
    document.getElementById('back-text').textContent = isMC ? `Answer: ${card.answer}` : card.back;

    // Reset flip
    document.getElementById('flashcard').classList.remove('flipped');
    isFlipped = false;

    // Update progress
    document.getElementById('current-card').textContent = currentIndex + 1;
    document.getElementById('total-cards').textContent = shuffledCards.length;

    // Update button states
    document.getElementById('prev-btn').disabled = currentIndex === 0;
    document.getElementById('next-btn').disabled = currentIndex === shuffledCards.length - 1;

    // Default choices container display
    document.getElementById('choices-container').innerHTML = '';

    // Show choices for multiple choice
    if (isMC) {
        displayChoices(card);
    }
}

function displayChoices(card) {
    const container = document.getElementById('choices-container');
    container.innerHTML = '';

    card.choices.forEach((choice, idx) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = choice;
        btn.addEventListener('click', () => {
            // Remove all selections
            document.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
            // Add selection to clicked button
            btn.classList.add('selected');
        });
        container.appendChild(btn);
    });
}

function flipCard() {
    const card = document.getElementById('flashcard');
    card.classList.toggle('flipped');
    isFlipped = !isFlipped;
}

function previousCard() {
    if (currentIndex > 0) {
        currentIndex--;
        updateCard();
    }
}

function nextCard() {
    if (currentIndex < shuffledCards.length - 1) {
        currentIndex++;
        updateCard();
    }
}

function shuffleCards() {
    for (let i = shuffledCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
    }
    currentIndex = 0;
    updateCard();
}

function resetCards() {
    currentIndex = 0;
    isFlipped = false;
    shuffledCards = [...flashcardsData[currentSection]];
    updateCard();
}
