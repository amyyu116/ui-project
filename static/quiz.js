let alreadyScored = false;
let nextClickedOnce = false;
let quizType;
let placements = {};
let correctMap = {};

// Shared scoring function
function incrementScore() {
    fetch("/update-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ increment: 1 }),
    })
        .then((r) => r.json())
        .then((data) => {
            document.getElementById("score-display").textContent = data.score;
        })
        .catch((err) => console.error("Score update failed:", err));
}

function verifyAnswers() {
    const nextBtn = document.getElementById("next-button");
    const nextUrl = nextBtn.dataset.nextUrl;

    if (!nextClickedOnce) {
        nextClickedOnce = true;
        let allCorrect = true;

        // answer verification
        if (quizType === "grouped") {
            const picks = Array.from(
                document.querySelectorAll(".btn-option.selected")
            );
            allCorrect = picks.every((b) => b.dataset.correct === "true");
            picks.forEach((b) => {
                b.classList.add(
                    b.dataset.correct === "true" ? "correct" : "incorrect"
                );
            });
        } else if (quizType === "single") {
            const selected = document.querySelector(".btn-option.selected");
            if (selected) {
                allCorrect = selected.dataset.correct === "true";
                selected.classList.add(allCorrect ? "correct" : "incorrect");
            } else {
                allCorrect = false;
            }
        } else if (quizType === "dragdrop") {
            for (const v in placements) {
                const card = document.getElementById(placements[v]);
                if (placements[v] === correctMap[v]) {
                    card.classList.add("correct");
                } else {
                    card.classList.add("incorrect");
                    allCorrect = false;
                }
            }
        }

        if (allCorrect && !alreadyScored) {
            alreadyScored = true;
            incrementScore();
        }

        return; // Wait for second click
    }

    // Second click: go to next page
    if (nextUrl) {
        window.location.href = nextUrl;
    } else {
        console.warn("No next URL specified.");
    }
}

function enableNext() {
    const nextBtn = document.getElementById("next-button");
    if (nextBtn) {
        nextBtn.disabled = false;

        // Replace old event listeners
        const newBtn = nextBtn.cloneNode(true);
        newBtn.dataset.nextUrl = nextBtn.dataset.nextUrl;
        nextBtn.parentNode.replaceChild(newBtn, nextBtn);
        newBtn.addEventListener("click", verifyAnswers);
    }
}

// ---- GROUPED MULTIPLE-CHOICE ----
function initGrouped(groups) {
    document.querySelectorAll(".btn-option").forEach((btn) => {
        btn.addEventListener("click", () => {
            const group = btn.dataset.group;

            document
                .querySelectorAll(`.btn-option[data-group="${group}"]`)
                .forEach((b) =>
                    b.classList.remove("selected", "correct", "incorrect")
                );
            btn.classList.add("selected");

            const picks = groups.map((group) =>
                document.querySelector(
                    `.btn-option.selected[data-group="${group}"]`
                )
            );

            if (picks.every(Boolean)) {
                enableNext();
            }
        });
    });
}

// ---- SINGLE MULTIPLE-CHOICE ----
function initSingleChoice() {
    document.querySelectorAll(".btn-option").forEach((btn) => {
        btn.addEventListener("click", () => {
            document
                .querySelectorAll(".btn-option")
                .forEach((b) =>
                    b.classList.remove("selected", "correct", "incorrect")
                );
            btn.classList.add("selected");
            enableNext();
        });
    });
}

// ---- DRAG AND DROP ----
function initDragAndDrop(correctMapInput) {
    correctMap = correctMapInput;
    placements = {};

    document.querySelectorAll(".answer-card").forEach((card) => {
        card.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", card.id);
        });
    });

    document.querySelectorAll(".drop-zone").forEach((zone) => {
        zone.addEventListener("dragover", (e) => e.preventDefault());
        zone.addEventListener("drop", (e) => {
            e.preventDefault();
            const id = e.dataTransfer.getData("text/plain");
            const card = document.getElementById(id);
            if (!card) return;

            if (zone.firstElementChild) {
                document
                    .getElementById("answer-bank")
                    .appendChild(zone.firstElementChild);
            }

            zone.textContent = "";
            zone.appendChild(card);
            zone.classList.add("filled");
            card.classList.remove("correct", "incorrect");

            const videoId = zone.dataset.videoId;
            placements[videoId] = id;

            evaluateDragAndDrop();
        });
    });

    document
        .getElementById("answer-bank")
        .addEventListener("dragover", (e) => e.preventDefault());
    document.getElementById("answer-bank").addEventListener("drop", (e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("text/plain");
        const card = document.getElementById(id);
        if (!card) return;

        e.currentTarget.appendChild(card);
        card.classList.remove("correct", "incorrect");

        for (const v in placements) {
            if (placements[v] === id) delete placements[v];
        }

        document.querySelectorAll(".drop-zone").forEach((z) => {
            if (!z.firstElementChild) {
                z.textContent = "drop here";
                z.classList.remove("filled");
            }
        });

        document.getElementById("next-button").disabled = true;
    });
}

function evaluateDragAndDrop() {
    if (Object.keys(placements).length !== Object.keys(correctMap).length)
        return;
    enableNext();
}

// ---- MAIN INIT FUNCTION ----
function initQuiz(config) {
    quizType = config.type;

    if (quizType === "grouped") {
        initGrouped(config.groups);
    } else if (quizType === "single") {
        initSingleChoice();
    } else if (quizType === "dragdrop") {
        initDragAndDrop(config.correctMap);
    }
}
