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
    nextBtn.innerText = 'Next';
    const nextUrl = nextBtn.dataset.nextUrl;

    if (!nextClickedOnce) {
        nextClickedOnce = true;
        let allCorrect = true;

     if (quizType === "grouped") {
        const selected = document.querySelectorAll(".btn-option.selected");
        if (selected.length > 0) {
            allCorrect = Array.from(selected).every((b) => b.dataset.correct === "true");
            selected.forEach((b) => {
                b.classList.add(b.dataset.correct === "true" ? "correct" : "incorrect");
            });
        } else {
            allCorrect = false;
        }
    
        // Always mark the correct answers in green
        document.querySelectorAll(".btn-option").forEach((btn) => {
            if (btn.dataset.correct === "true") {
                btn.classList.add("correct");
            }
            btn.classList.add("disabled");
            btn.style.pointerEvents = "none";
        });
    }
    
         else if (quizType === "single") {
            const selected = document.querySelector(".btn-option.selected");
            if (selected) {
                allCorrect = selected.dataset.correct === "true";
                selected.classList.add(allCorrect ? "correct" : "incorrect");
            } else {
                allCorrect = false;
            }
        
            // Always mark the correct answer in green
            document.querySelectorAll(".btn-option").forEach((btn) => {
                if (btn.dataset.correct === "true") {
                    btn.classList.add("correct");
                }
        
                btn.classList.add("disabled");
                btn.style.pointerEvents = "none";
            });
        /* ---------- DRAG-AND-DROP FEEDBACK ---------- */
/* ---------- DRAG-AND-DROP  FEEDBACK  ---------- */
} else if (quizType === "dragdrop") {

    // loop over every drop zone we expect an answer for
    for (const zoneId in correctMap) {
        const zone        = document.querySelector(
            `.drop-zone[data-video-id="${zoneId}"]`
        );
        const correctId   = correctMap[zoneId];
        const placedId    = placements[zoneId];  // undefined if user left blank

        const correctCard = document.getElementById(correctId);   // real card

        // ----- 1. USER DROPPED SOMETHING ----------------------------------
        if (placedId) {
            const placedCard = document.getElementById(placedId);

            // freeze it
            placedCard.setAttribute("draggable", "false");

            // is it right?
            if (placedId === correctId) {
                placedCard.classList.add("correct");              // ✅ green
            } else {
                allCorrect = false;
                placedCard.classList.add("incorrect");            // ❌ red

                // add a small green label under the wrong card
                appendCorrectLabel(zone, correctCard, "correct answer");
            }

        // ----- 2. USER LEFT ZONE BLANK -------------------------------------
        } else {
            allCorrect = false;
            appendCorrectLabel(zone, correctCard, "correct answer");
        }
    }

    /* lock the interface */
    document.querySelectorAll(".answer-card").forEach((c) =>
        c.setAttribute("draggable", "false")
    );
    document.querySelectorAll(".drop-zone").forEach((z) =>
        (z.style.pointerEvents = "none")
    );
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


// helper: place the correct answer label *below* the drop zone
function appendCorrectLabel(zone, cardEl, labelText) {
    if (!zone || !cardEl) return;

    const container = zone.parentElement;

    // create label
    const label = document.createElement("div");
    label.textContent = `(${labelText}: ${cardEl.dataset.label || cardEl.textContent})`;
    label.classList.add("correct-label");

    // insert it *after* the drop zone
    container.insertBefore(label, zone.nextSibling);
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
