let alreadyScored = false;

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

function enableNext() {
    const nextBtn = document.getElementById("next-button");
    if (nextBtn) nextBtn.disabled = false;
}

function initGrouped(groups) {
    document.querySelectorAll(".btn-option").forEach((btn) => {
        btn.addEventListener("click", () => {
            const group = btn.dataset.group;

            // Deselect others in group
            document
                .querySelectorAll(`.btn-option[data-group="${group}"]`)
                .forEach((b) => b.classList.remove("selected"));
            btn.classList.add("selected");

            // Check if all groups are answered
            const picks = groups.map((group) =>
                document.querySelector(
                    `.btn-option.selected[data-group="${group}"]`
                )
            );

            if (picks.every(Boolean)) {
                const correct = picks.every(
                    (b) => b.dataset.correct === "true"
                );

                picks.forEach((b) => {
                    b.classList.add(
                        b.dataset.correct === "true" ? "correct" : "incorrect"
                    );
                });

                if (correct && !alreadyScored) {
                    alreadyScored = true;
                    fetch("/update-score", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ increment: 1 }),
                    })
                        .then((r) => r.json())
                        .then((data) => {
                            document.getElementById(
                                "score-display"
                            ).textContent = data.score;
                        })
                        .catch((err) =>
                            console.error("Could not update score:", err)
                        );
                }

                document.getElementById("next-button").disabled = false;
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

            const correct = btn.dataset.correct === "true";
            btn.classList.add(correct ? "correct" : "incorrect");

            if (correct && !alreadyScored) {
                alreadyScored = true;
                incrementScore();
            }

            enableNext();
        });
    });
}

// ---- DRAG AND DROP ----
function initDragAndDrop(correctMap) {
    const placements = {};

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

            // Return existing card to bank
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

            evaluateDragAndDrop(correctMap, placements);
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

function evaluateDragAndDrop(correctMap, placements) {
    if (Object.keys(placements).length !== Object.keys(correctMap).length)
        return;

    let allCorrect = true;
    for (const v in placements) {
        const card = document.getElementById(placements[v]);
        if (placements[v] === correctMap[v]) {
            card.classList.add("correct");
        } else {
            card.classList.add("incorrect");
            allCorrect = false;
        }
    }

    if (allCorrect && !alreadyScored) {
        alreadyScored = true;
        incrementScore();
    }

    enableNext();
}

// ---- INIT FUNCTION: Call based on page type ----
function initQuiz(config) {
    if (config.type === "grouped") {
        initGrouped(config.groups);
    } else if (config.type === "single") {
        initSingleChoice();
    } else if (config.type === "dragdrop") {
        initDragAndDrop(config.correctMap);
    }
}
