let flashcardsData = {
  "identification": [
    {"id": 1, "front": "What term refers to raw facts without context?", "back": "Data"},
    {"id": 2, "front": "What term refers to processed data that reveals meaning?", "back": "Information"},
    {"id": 3, "front": "What is data about data called?", "back": "Metadata"},
    {"id": 4, "front": "What system manages database structure and controls access to data?", "back": "DBMS"},
    {"id": 5, "front": "What term describes duplication of data?", "back": "Data redundancy"},
    {"id": 6, "front": "What term describes lack of uniformity across data?", "back": "Data inconsistency"},
    {"id": 7, "front": "What term describes difficulty accessing scattered data across files?", "back": "Data isolation"},
    {"id": 8, "front": "What transaction property means \"all or nothing\"?", "back": "Atomicity"},
    {"id": 9, "front": "What type of independence allows file structure changes without affecting data access?", "back": "Structural independence"},
    {"id": 10, "front": "What type of database supports only one user at a time?", "back": "Single-user database"},
    {"id": 11, "front": "What type of database distributes data across multiple sites?", "back": "Distributed database"},
    {"id": 12, "front": "What database supports daily business operations?", "back": "Operational database"},
    {"id": 13, "front": "What database is used for tactical or strategic decision-making?", "back": "Data warehouse"},
    {"id": 14, "front": "What DBMS component stores metadata definitions?", "back": "Data dictionary"},
    {"id": 15, "front": "What nonprocedural query language is the de facto standard for relational databases?", "back": "SQL"},
    {"id": 16, "front": "What operational-level system captures production data?", "back": "TPS (Transaction Processing Systems)"},
    {"id": 17, "front": "What tactical-level system summarizes operational data?", "back": "MIS (Management Information Systems)"},
    {"id": 18, "front": "What strategic-level system supports non-routine decisions?", "back": "DSS"},
    {"id": 19, "front": "What database design phase identifies entities and relationships?", "back": "Logical design"},
    {"id": 20, "front": "What term refers to anything about which data is collected?", "back": "Entity"},
    {"id": 21, "front": "What term describes how entities are associated?", "back": "Relationship"},
    {"id": 22, "front": "What rule restricts allowable data values?", "back": "Constraint"},
    {"id": 23, "front": "Which data model was proposed in 1970 by E. F. Codd?", "back": "Relational model"},
    {"id": 24, "front": "Which conceptual model was introduced by Chen in 1976?", "back": "ER model"},
    {"id": 25, "front": "What type of entity depends on another entity for existence?", "back": "Weak entity"},
    {"id": 26, "front": "What key uniquely identifies each entity instance?", "back": "Primary key"},
    {"id": 27, "front": "What key references a primary key in another table?", "back": "Foreign key"},
    {"id": 28, "front": "What term defines the minimum and maximum number of related entity occurrences?", "back": "Cardinality"},
    {"id": 29, "front": "What relationship occurs when an entity relates to itself?", "back": "Recursive relationship"},
    {"id": 30, "front": "What entity type is used to implement M:N relationships?", "back": "Associative entity"}
  ],
  "multipleChoice": [
    {"id": 1, "front": "Which file system component represents a logically connected set of fields forming a single complete entry?", "choices": ["A) Field", "B) Record", "C) File", "D) Column"], "answer": "B) Record"},
    {"id": 2, "front": "Which file system component is defined as a group of characters with specific meaning?", "choices": ["A) Record", "B) File", "C) Field", "D) Schema"], "answer": "C) Field"},
    {"id": 3, "front": "Which file system component is a collection of related records?", "choices": ["A) File", "B) Field", "C) Column", "D) Tuple"], "answer": "A) File"},
    {"id": 4, "front": "Which dependency occurs when data access changes due to modifications in storage characteristics?", "choices": ["A) Structural dependence", "B) Data dependence", "C) Logical independence", "D) Physical independence"], "answer": "B) Data dependence"},
    {"id": 5, "front": "Which database type runs on a personal computer and supports only one user?", "choices": ["A) Workgroup database", "B) Enterprise database", "C) Desktop database", "D) Centralized database"], "answer": "C) Desktop database"},
    {"id": 6, "front": "Which database type supports multiple users simultaneously within an organization?", "choices": ["A) Multiuser database", "B) Desktop database", "C) Centralized database", "D) Semi-structured database"], "answer": "A) Multiuser database"},
    {"id": 7, "front": "Which database location model stores data at a single site?", "choices": ["A) Enterprise database", "B) Workgroup database", "C) Centralized database", "D) Production database"], "answer": "C) Centralized database"},
    {"id": 8, "front": "Which type of data exists in its original raw state (e.g., emails, videos)?", "choices": ["A) Structured data", "B) Semi-structured data", "C) Unstructured data", "D) Relational data"], "answer": "C) Unstructured data"},
    {"id": 9, "front": "Which type of data includes formats such as XML or JSON?", "choices": ["A) Structured data", "B) Semi-structured data", "C) Transactional data", "D) Atomic data"], "answer": "B) Semi-structured data"},
    {"id": 10, "front": "Which phase of database design focuses on understanding data needs and objectives?", "choices": ["A) Physical database design", "B) Information requirements phase", "C) Logical abstraction phase", "D) Implementation phase"], "answer": "B) Information requirements phase"},
    {"id": 11, "front": "Which phase maps the logical design to actual storage devices?", "choices": ["A) Conceptual modeling", "B) Requirements analysis", "C) Physical database design", "D) Normalization phase"], "answer": "C) Physical database design"},
    {"id": 12, "front": "Which data model uses an upside-down tree structure?", "choices": ["A) Network model", "B) Hierarchical model", "C) Object-oriented model", "D) Multidimensional model"], "answer": "B) Hierarchical model"},
    {"id": 13, "front": "Which data model allows records to have multiple parents?", "choices": ["A) Network model", "B) Hierarchical model", "C) Multidimensional model", "D) Conceptual model"], "answer": "A) Network model"},
    {"id": 14, "front": "Which model combines data and behavior into self-contained objects?", "choices": ["A) Multidimensional model", "B) Network model", "C) Object-oriented model", "D) Conceptual model"], "answer": "C) Object-oriented model"},
    {"id": 15, "front": "Which modeling language is commonly used in object-oriented data modeling?", "choices": ["A) SQL", "B) XML", "C) UML", "D) ERD"], "answer": "C) UML"},
    {"id": 16, "front": "Which data model is optimized for complex analytical queries in data warehouses?", "choices": ["A) Network model", "B) Multidimensional model", "C) Hierarchical model", "D) File model"], "answer": "B) Multidimensional model"},
    {"id": 17, "front": "Which type of database is designed for large-scale, distributed environments?", "choices": ["A) Production database", "B) NoSQL database", "C) Centralized database", "D) Desktop database"], "answer": "B) NoSQL database"},
    {"id": 18, "front": "Which term refers to a user-specific view of data defined by external schemas?", "choices": ["A) Conceptual view", "B) Physical view", "C) External model", "D) Internal model"], "answer": "C) External model"},
    {"id": 19, "front": "Which abstraction level represents the global organization-wide view of data?", "choices": ["A) Internal model", "B) Physical model", "C) Conceptual model", "D) User model"], "answer": "C) Conceptual model"},
    {"id": 20, "front": "Which abstraction level maps the conceptual design to DBMS structures?", "choices": ["A) Internal model", "B) External model", "C) Enterprise model", "D) Logical model"], "answer": "A) Internal model"},
    {"id": 21, "front": "Which type of entity is independent and always has a unique identifier?", "choices": ["A) Weak type", "B) Strong type", "C) Associative type", "D) Composite type"], "answer": "B) Strong type"},
    {"id": 22, "front": "Which attribute type must always have a value?", "choices": ["A) Optional attribute", "B) Derived attribute", "C) Required attribute", "D) Multivalued attribute"], "answer": "C) Required attribute"},
    {"id": 23, "front": "Which attribute type may be left empty?", "choices": ["A) Composite attribute", "B) Optional attribute", "C) Simple attribute", "D) Identifier"], "answer": "B) Optional attribute"},
    {"id": 24, "front": "Which attribute type can be subdivided into smaller components?", "choices": ["A) Simple attribute", "B) Derived attribute", "C) Composite attribute", "D) Multivalued attribute"], "answer": "C) Composite attribute"},
    {"id": 25, "front": "Which attribute type cannot be subdivided?", "choices": ["A) Composite attribute", "B) Simple attribute", "C) Multivalued attribute", "D) Derived attribute"], "answer": "B) Simple attribute"},
    {"id": 26, "front": "Which key is unique and minimal but not chosen as the primary key?", "choices": ["A) Composite key", "B) Candidate key", "C) Alternate key", "D) Foreign key"], "answer": "C) Alternate key"},
    {"id": 27, "front": "Which key consists of more than one attribute?", "choices": ["A) Candidate key", "B) Composite key", "C) Identifier", "D) Alternate key"], "answer": "B) Composite key"},
    {"id": 28, "front": "Which participation requires an entity occurrence to have a corresponding related entity?", "choices": ["A) Optional participation", "B) Partial participation", "C) Mandatory participation", "D) Unary participation"], "answer": "C) Mandatory participation"},
    {"id": 29, "front": "Which relationship degree involves three entities?", "choices": ["A) Unary", "B) Binary", "C) Ternary", "D) Recursive"], "answer": "C) Ternary"},
    {"id": 30, "front": "Which entity type acts as a bridge to connect entities in many-to-many relationships and may contain additional attributes?", "choices": ["A) Strong entity", "B) Composite entity", "C) Bridge entity", "D) Entity instance"], "answer": "C) Bridge entity"}
  ],
  "essay": [
    {"id": 1, "front": "Explain how poor data management practices in traditional file-processing environments negatively affect organizational decision-making. In your answer, discuss the chain reaction from data storage issues to managerial consequences.", "back": "Key Points: Explanation of duplication and update problems leading to unreliable information; Loss of a 'single version of truth' and conflicting reports; Increased programming complexity and maintenance burden; Impact on reporting accuracy and business decisions"},
    {"id": 2, "front": "Discuss how a well-designed data environment improves both operational efficiency and strategic effectiveness within an organization.", "back": "Key Points: Reduced duplication and improved consistency; Faster access to accurate information; Improved reporting quality; Long-term cost-effectiveness and scalability considerations"},
    {"id": 3, "front": "Analyze how abstraction in database architecture supports both usability and system flexibility. Explain how separating user views from storage mechanisms benefits organizations.", "back": "Key Points: Concept of layered abstraction; Separation between user perspective and storage representation; Improved security and simplicity; Reduced impact of structural changes on applications"},
    {"id": 4, "front": "Evaluate the role of business policies in shaping database structure. How do organizational rules influence the way data entities and associations are modeled?", "back": "Key Points: Policies define structure and constraints; Translation of organizational language into formal structure; Influence on participation rules and ownership; Importance for communication between technical and non-technical stakeholders"},
    {"id": 5, "front": "Compare early data modeling approaches with more modern modeling philosophies in terms of flexibility, complexity, and real-world representation.", "back": "Key Points: Tree-like versus graph-based versus table-based thinking; Limitations of rigid structures; Increased flexibility over time; Abstraction improvements and user simplicity"},
    {"id": 6, "front": "Explain why integrity enforcement is especially critical in transaction-heavy environments. Discuss the risks if enforcement mechanisms fail.", "back": "Key Points: Importance of consistency in high-volume updates; Risk of partial updates or interrupted processes; Preservation of trust in stored information; Long-term impact on operational reliability"},
    {"id": 7, "front": "Discuss the importance of modeling skills in the database development lifecycle. Why is modeling considered foundational rather than optional?", "back": "Key Points: Modeling as the blueprint stage; Iterative and progressive refinement; Facilitates stakeholder communication; Prevents structural errors before implementation"},
    {"id": 8, "front": "Examine how database systems support multi-user environments while maintaining system reliability and performance.", "back": "Key Points: Need for controlled concurrent access; Protection of shared resources; Performance considerations; Organizational productivity benefits"},
    {"id": 9, "front": "Discuss how analytical data environments differ in purpose and structure from operational data environments. Focus on intent and workload characteristics rather than naming systems.", "back": "Key Points: Day-to-day processing vs. long-term analysis; Query complexity differences; Performance optimization goals; Decision-support implications"},
    {"id": 10, "front": "Analyze how improper structural planning during system development can lead to long-term performance and maintenance problems.", "back": "Key Points: Poor structure leading to inefficiency; Increased maintenance complexity; Higher risk of errors; Impact on scalability and system slowdowns"}
  ]
};

let currentSection = 'identification';
let currentIndex = 0; // Index into shuffledCards for the currently displayed card
let isFlipped = false;
let shuffledCards = [];

// History stack for navigation (allows revisiting previously shown cards)
let cardHistory = [];
let historyPosition = -1;

// Track per-card performance so we can weight the selection probabilities
let cardStats = {};

let scores = {
    identification: { correct: 0, total: 0 },
    multipleChoice: { correct: 0, total: 0 },
    essay: { correct: 0, total: 0 }
};
let answered = {};
let identificationAnswered = {};

document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    loadStats();
    setupEventListeners();
    loadSection('identification');
}

function setupEventListeners() {
    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

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

    // Load theme preference
    loadThemePreference();
}

function loadSection(section) {
    currentSection = section;
    isFlipped = false;
    shuffledCards = [...flashcardsData[section]];
    answered = {};
    identificationAnswered = {};
    scores[section].correct = 0;
    scores[section].total = shuffledCards.length;

    // Reset navigation history and pick a card based on performance weights.
    cardHistory = [];
    historyPosition = -1;

    document.getElementById('footer-text').textContent = 'Click the card to reveal the answer';
    document.getElementById('footer-hint').style.display = 'none';

    if (shuffledCards.length > 0) {
        selectNextCard();
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
        document.getElementById('current-card').textContent = '0';
        document.getElementById('total-cards').textContent = '0';
        document.getElementById('prev-btn').disabled = true;
        document.getElementById('next-btn').disabled = true;
        return;
    }

    const card = shuffledCards[currentIndex];
    const isMC = currentSection === 'multipleChoice';
    const isID = currentSection === 'identification';

    // Update card content
    document.getElementById('front-text').textContent = card.front;
    document.getElementById('back-text').textContent = isMC ? `Answer: ${card.answer}` : card.back;

    // Reset flip
    document.getElementById('flashcard').classList.remove('flipped');
    isFlipped = false;

    // Update progress (show where you are in the session history)
    document.getElementById('current-card').textContent = historyPosition + 1;
    document.getElementById('total-cards').textContent = shuffledCards.length;

    // Update button states
    document.getElementById('prev-btn').disabled = historyPosition <= 0;
    document.getElementById('next-btn').disabled = shuffledCards.length === 0;

    // Update score display
    updateScoreDisplay();

    // Clear containers
    document.getElementById('choices-container').innerHTML = '';
    document.getElementById('feedback-container').innerHTML = '';
    document.getElementById('footer-hint').style.display = 'none';

    // Show choices for multiple choice
    if (isMC) {
        displayChoices(card);
    }
    
    // Show feedback hint for identification if flipped
    if (isID && isFlipped && identificationAnswered[card.id] === undefined) {
        showIdentificationFeedback(card);
    }
}

function displayChoices(card) {
    const container = document.getElementById('choices-container');
    container.innerHTML = '';
    const cardId = card.id;

    card.choices.forEach((choice, idx) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = choice;
        
        // Check if this card has been answered
        const isAnswered = answered[cardId] !== undefined;
        
        if (isAnswered) {
            // Show result for answered questions
            const isCorrect = answered[cardId];
            if (isCorrect) {
                btn.classList.add('correct');
            } else if (choice === card.answer) {
                // Show correct answer even if user was wrong
                btn.classList.add('correct');
            } else if (choice.startsWith(answered[cardId])) {
                // Highlight the user's wrong answer
                btn.classList.add('incorrect');
            }
            btn.disabled = true;
        } else {
            // Allow clicking if not answered yet
            btn.addEventListener('click', () => {
                const isCorrect = choice === card.answer;
                
                // Mark as answered
                answered[cardId] = isCorrect ? true : choice.charAt(0);

                // Update stats (used for weighted selection)
                updateCardStats(currentSection, cardId, isCorrect);
                
                // Update score
                if (isCorrect) {
                    scores[currentSection].correct++;
                }
                
                // Update all buttons to show result
                document.querySelectorAll('.choice-btn').forEach(b => {
                    b.disabled = true;
                    b.classList.remove('selected');
                    
                    if (isCorrect && b === btn) {
                        b.classList.add('correct');
                    } else if (!isCorrect && b === btn) {
                        b.classList.add('incorrect');
                    } else if (b.textContent === card.answer) {
                        b.classList.add('correct');
                    }
                });
                
                // Update score display
                updateScoreDisplay();
                
                // Update footer text
                document.getElementById('footer-text').textContent = 
                    isCorrect ? '✓ Correct!' : '✗ Incorrect. The correct answer is ' + card.answer;
            });
        }
        
        container.appendChild(btn);
    });
}

function updateScoreDisplay() {
    const score = scores[currentSection];
    document.getElementById('correct-count').textContent = score.correct;
    document.getElementById('total-count').textContent = score.total;
    const percentage = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    document.getElementById('score-percentage').textContent = percentage + '%';
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
        identificationAnswered[card.id] = true;
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
        identificationAnswered[card.id] = false;
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
    
    // Show feedback for identification cards when flipped to back
    if (currentSection === 'identification') {
        const currentCard = shuffledCards[currentIndex];
        if (isFlipped && identificationAnswered[currentCard.id] === undefined) {
            showIdentificationFeedback(currentCard);
        } else {
            document.getElementById('feedback-container').innerHTML = '';
            document.getElementById('footer-hint').style.display = 'none';
        }
    }
}

function previousCard() {
    if (historyPosition > 0) {
        historyPosition--;
        currentIndex = cardHistory[historyPosition];
        updateCard();
    }
}

function nextCard() {
    if (historyPosition < cardHistory.length - 1) {
        historyPosition++;
        currentIndex = cardHistory[historyPosition];
        updateCard();
    } else {
        selectNextCard();
    }
}

function shuffleCards() {
    // Shuffle the deck order, but preserve performance-based weighting when picking the next card.
    shuffledCards = [...flashcardsData[currentSection]];
    for (let i = shuffledCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
    }

    cardHistory = [];
    historyPosition = -1;
    selectNextCard();
}

function resetCards() {
    isFlipped = false;
    answered = {};
    identificationAnswered = {};
    scores[currentSection].correct = 0;
    scores[currentSection].total = shuffledCards.length;
    document.getElementById('footer-text').textContent = 'Click the card to reveal the answer';
    document.getElementById('footer-hint').style.display = 'none';
    document.getElementById('feedback-container').innerHTML = '';

    shuffledCards = [...flashcardsData[currentSection]];

    cardHistory = [];
    historyPosition = -1;
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
        try {
            cardStats = JSON.parse(stored);
        } catch (e) {
            cardStats = {};
        }
    }
}

function saveStats() {
    localStorage.setItem('flashcardStats', JSON.stringify(cardStats));
}

function getCardStats(section, cardId) {
    cardStats[section] = cardStats[section] || {};
    cardStats[section][cardId] = cardStats[section][cardId] || { correct: 0, wrong: 0 };
    return cardStats[section][cardId];
}

function updateCardStats(section, cardId, isCorrect) {
    const stats = getCardStats(section, cardId);
    if (isCorrect) {
        stats.correct += 1;
    } else {
        stats.wrong += 1;
    }
    saveStats();
}

function getWeightedRandomCardIndex() {
    // Higher weight for cards the user has missed more often.
    // Lower weight for cards the user answers correctly most of the time.
    const weights = shuffledCards.map(card => {
        const stats = getCardStats(currentSection, card.id);
        const correct = stats.correct || 0;
        const wrong = stats.wrong || 0;
        // Base weight ensures every card can appear at least sometimes.
        // Increase weight for wrong answers, decrease for correct answers.
        const weight = Math.max(0.2, 1 + wrong - (correct * 0.5));
        return weight;
    });

    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const random = Math.random() * totalWeight;
    let cumulative = 0;

    for (let i = 0; i < weights.length; i++) {
        cumulative += weights[i];
        if (random < cumulative) {
            return i;
        }
    }

    return weights.length - 1;
}

function addCardToHistory(cardIndex) {
    // If we went back in history and then choose a new card, drop forward history.
    if (historyPosition < cardHistory.length - 1) {
        cardHistory = cardHistory.slice(0, historyPosition + 1);
    }

    cardHistory.push(cardIndex);
    historyPosition = cardHistory.length - 1;
    currentIndex = cardIndex;
    updateCard();
}

function getCurrentCardIndexFromHistory() {
    return cardHistory[historyPosition];
}

function selectNextCard() {
    const nextIndex = getWeightedRandomCardIndex();
    addCardToHistory(nextIndex);
}
