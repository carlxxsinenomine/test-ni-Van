# IM Flashcards

A lightweight, browser-based flashcard app for studying Information Management concepts.

## 📁 Project Structure

- `index.html` – app UI (card view, navigation buttons, mode selection).
- `styles.css` – styling for the flashcard app.
- `script.js` – app logic (card selection, navigation, scoring, and adaptive repetition).
- `flashcards.json` – (optional / unused) additional data source (not currently used by the app).

## 🧠 Architecture Overview

### 1) Data Model
- Flashcards are stored in a JavaScript object in `script.js` (`flashcardsData`) with three sections:
  - `identification` – definition-style cards (front/back).
  - `multipleChoice` – multiple-choice questions with choices and a correct answer.
  - `essay` – prompt/answer pairs for freeform study.

### 2) UI & Navigation
- The UI is a single-page app driven by DOM manipulation.
- Users can switch between sections via navigation buttons.
- Keyboard navigation is supported (←/→ to move, space to flip).
- In multiple-choice mode, selecting an option immediately shows correctness feedback.
- In identification mode, the user flips the card and then self-reports if they got it right.

### 3) Adaptive Card Selection (Spaced Repetition Lite)
- The app tracks performance per card in `localStorage` as `flashcardStats`.
- Each card stores:
  - `correct`: times answered correctly
  - `wrong`: times answered incorrectly
- Next card selection is weighted so:
  - Cards that are answered incorrectly more often have higher selection probability.
  - Cards answered correctly many times become less likely but still appear occasionally.

### 4) Persistence
- Performance stats are stored in `localStorage` so progress persists across browser sessions.

## ▶️ Running the App
1. Open `index.html` in a modern browser.
2. Click a section button (Identification / Multiple Choice / Essay).
3. Navigate using the `Next` / `Previous` buttons or keyboard arrows.

## ✅ Committing & Pushing to GitHub
This project is already linked to a remote (`origin/main`).

To push local changes:
```bash
git add README.md script.js
git commit -m "Add adaptive repetition and README"
git push
```

---

If you'd like, I can also add a "reset progress" button to clear stored stats (in case you want a fresh start).