$(document).ready(function () {
    let accPoints = 0;

    let selections = {
        sound: null,
        case: null,
    };

    // --- QUIZ 1 ---
    $(".btn-option").click(function () {
        let $this = $(this);
        let group = $this.data("group");
        let isCorrect = $this.data("correct");

        selections[group] = {
            id: $this.attr("id"),
            isCorrect: isCorrect,
        };

        // Deselect others in the group
        $(`.btn-option[data-group=${group}]`).removeClass("selected");
        $this.addClass("selected");

        // Save to sessionStorage
        sessionStorage.setItem("quiz1Selections", JSON.stringify(selections));

        // Enable Next if both answered
        if (selections.sound && selections.case) {
            $("#next-button").prop("disabled", false);
        }
    });

    if (window.location.pathname.includes("/quiz/1")) {
        let stored = sessionStorage.getItem("quiz1Selections");
        if (stored) {
            let parsed = JSON.parse(stored);
            for (let group in parsed) {
                let { id } = parsed[group];
                $(`#${id}`).addClass("selected");
            }

            // Enable next button if both are answered
            if (parsed.sound && parsed.case) {
                $("#next-button").prop("disabled", false);
            }
        }
    }

    // --- QUIZ 2 ---
    if (window.location.pathname.includes("/quiz/2")) {
        $("#next-button").prop("disabled", false); // Always enabled

        // Load selections
        let stored = sessionStorage.getItem("quiz1Selections");
        if (stored) {
            let parsed = JSON.parse(stored);

            // Highlight correct answers
            $(".btn-option[data-correct=true]").addClass("correct");

            for (let group in parsed) {
                let { id, isCorrect } = parsed[group];
                let $btn = $(`#${id}`);
                if (isCorrect === false || isCorrect === "false") {
                    $btn.addClass("incorrect");
                } else {
                    accPoints += 1;
                }
            }
        }
    }

    // --- QUIZ 3 ---
    if (window.location.pathname.includes("/quiz/3")) {
        let quiz3Selections = {};

        $(".btn-option").click(function () {
            let $this = $(this);
            let group = $this.data("group");
            let isCorrect = $this.data("correct");

            quiz3Selections[group] = {
                id: $this.attr("id"),
                isCorrect: isCorrect,
            };

            // Deselect all in this group
            $(`.btn-option[data-group=${group}]`).removeClass("selected");
            $this.addClass("selected");

            // Save to sessionStorage
            sessionStorage.setItem(
                "quiz3Selections",
                JSON.stringify(quiz3Selections)
            );

            // Enable Next after one selection (since it's one question)
            $("#next-button").prop("disabled", false);
        });

        // Restore previous selection if returning to this page
        let stored = sessionStorage.getItem("quiz3Selections");
        if (stored) {
            let parsed = JSON.parse(stored);
            for (let group in parsed) {
                let { id } = parsed[group];
                $(`#${id}`).addClass("selected");
                $("#next-button").prop("disabled", false);
            }
        }
    }

    // --- QUIZ 4 ---
    if (window.location.pathname.includes("/quiz/4")) {
        $("#next-button").prop("disabled", false); // Always enabled

        let stored = sessionStorage.getItem("quiz3Selections");
        let quizPoints = parseInt(sessionStorage.getItem("quizPoints") || "0");

        // Always highlight the correct answer(s)
        $(".btn-option[data-correct=true]").addClass("correct");

        if (stored) {
            let parsed = JSON.parse(stored);
            for (let group in parsed) {
                let { id, isCorrect } = parsed[group];
                let $btn = $(`#${id}`);

                if (isCorrect === false || isCorrect === "false") {
                    $btn.addClass("incorrect");
                } else if (isCorrect === true || isCorrect === "true") {
                    // Only increment if not already done
                    accPoints += 1;
                }
            }
        }

        if (!sessionStorage.getItem("quiz4Scored")) {
            sessionStorage.setItem("quizPoints", quizPoints.toString());
            sessionStorage.setItem("quiz4Scored", "true");
        }
    }

    // --- QUIZ 5 ---
    if (window.location.pathname.includes("/quiz/5")) {
        let quiz5Selections = {};

        $(".btn-option").click(function () {
            let $this = $(this);
            let group = $this.data("group");
            let isCorrect = $this.data("correct");

            quiz5Selections[group] = {
                id: $this.attr("id"),
                isCorrect: isCorrect,
            };

            // Deselect all in this group
            $(`.btn-option[data-group=${group}]`).removeClass("selected");
            $this.addClass("selected");

            // Save to sessionStorage
            sessionStorage.setItem(
                "quiz5Selections",
                JSON.stringify(quiz5Selections)
            );

            // Enable Next after one selection (since it's one question)
            $("#next-button").prop("disabled", false);
        });

        // Restore previous selection if returning to this page
        if (window.location.pathname.includes("/quiz/5")) {
            let stored = sessionStorage.getItem("quiz5Selections");
            if (stored) {
                let parsed = JSON.parse(stored);
                for (let group in parsed) {
                    let { id } = parsed[group];
                    $(`#${id}`).addClass("selected");
                }
            }
        }
    }

    // --- QUIZ 6 ---

    if (window.location.pathname.includes("/quiz/6")) {
        $("#next-button").prop("disabled", false); // Always enabled

        let stored = sessionStorage.getItem("quiz5Selections");
        let quizPoints = parseInt(sessionStorage.getItem("quizPoints") || "0");

        // Always highlight the correct answer(s)
        $(".btn-option[data-correct=true]").addClass("correct");

        if (stored) {
            let parsed = JSON.parse(stored);
            for (let group in parsed) {
                let { id, isCorrect } = parsed[group];
                let $btn = $(`#${id}`);

                if (isCorrect === false || isCorrect === "false") {
                    $btn.addClass("incorrect");
                } else if (isCorrect === true || isCorrect === "true") {
                    // Only increment if not already done
                    accPoints += 1;
                }
            }
        }
    }

    // --- QUIZ 7 ---
    if (window.location.pathname.includes("/quiz/7")) {
        let quiz7Selections = {};

        $(".btn-option").click(function () {
            let $this = $(this);
            let group = $this.data("group");
            let isCorrect = $this.data("correct");

            quiz7Selections[group] = {
                id: $this.attr("id"),
                isCorrect: isCorrect,
            };

            // Deselect all in this group
            $(`.btn-option[data-group=${group}]`).removeClass("selected");
            $this.addClass("selected");

            // Save to sessionStorage
            sessionStorage.setItem(
                "quiz7Selections",
                JSON.stringify(quiz7Selections)
            );

            // Enable Next after one selection (since it's one question)
            $("#next-button").prop("disabled", false);
        });

        // Restore previous selection if returning to this page
        if (window.location.pathname.includes("/quiz/7")) {
            let stored = sessionStorage.getItem("quiz7Selections");
            if (stored) {
                let parsed = JSON.parse(stored);
                for (let group in parsed) {
                    let { id } = parsed[group];
                    $(`#${id}`).addClass("selected");
                }
            }
        }
    }

    // --- QUIZ 8 ---

    if (window.location.pathname.includes("/quiz/8")) {
        $("#next-button").prop("disabled", false); // Always enabled

        let stored = sessionStorage.getItem("quiz7Selections");
        let quizPoints = parseInt(sessionStorage.getItem("quizPoints") || "0");

        // Always highlight the correct answer(s)
        $(".btn-option[data-correct=true]").addClass("correct");

        if (stored) {
            let parsed = JSON.parse(stored);
            for (let group in parsed) {
                let { id, isCorrect } = parsed[group];
                let $btn = $(`#${id}`);

                if (isCorrect === false || isCorrect === "false") {
                    $btn.addClass("incorrect");
                } else if (isCorrect === true || isCorrect === "true") {
                    // Only increment if not already done
                    accPoints += 1;
                }
            }
        }
    }

    // --- QUIZ 9 ---
    if (window.location.pathname.includes("/quiz/9")) {
        let quiz9Selections = {};

        // Correct answers for Quiz 9 (matching the options in the <select> element)
        const correctAnswers = {
            v1: "a3", // First video correct answer
            v2: "a1", // Second video correct answer
            v3: "a2", // Third video correct answer
        };

        // When an answer is selected
        $(".match-select").change(function () {
            let videoId = $(this).data("video-id");
            let selectedAnswer = $(this).val();

            // Save selected answer in the quiz9Selections object
            quiz9Selections[videoId] = selectedAnswer;

            // Enable Next button only after all selections are made
            let allAnswered =
                Object.keys(quiz9Selections).length ===
                Object.keys(correctAnswers).length;
            $("#next-button").prop("disabled", !allAnswered);

            // Save to sessionStorage for Quiz 9
            sessionStorage.setItem(
                "quiz9Selections",
                JSON.stringify(quiz9Selections)
            );

            // Update the "Your answer:" display for the current video
            $(`.user-answer-${videoId}`).text(selectedAnswer); // This updates the user's answer display
        });

        // Restore previous selections if returning to this page
        let storedQuiz9Selections = sessionStorage.getItem("quiz9Selections");
        if (storedQuiz9Selections) {
            let parsed = JSON.parse(storedQuiz9Selections);
            for (let videoId in parsed) {
                // Restore the selected value in the dropdown
                $(`.match-select[data-video-id=${videoId}]`).val(
                    parsed[videoId]
                );

                // Update the "Your answer:" display
                $(`.user-answer-${videoId}`).text(parsed[videoId]);
            }
        }
    }
    // --- QUIZ 10 ---
    if (window.location.pathname.includes("/quiz/10")) {
        // Correct answers for Quiz 10 (for reference)
        const correctAnswers = {
            v1: "a3", // Correct answer for video 1
            v2: "a1", // Correct answer for video 2
            v3: "a2", // Correct answer for video 3
        };

        // Retrieve stored selections from Quiz 9 (sessionStorage)
        let storedQuiz9Selections = sessionStorage.getItem("quiz9Selections");

        if (storedQuiz9Selections) {
            // Parse the stored selections (Quiz 9 answers)
            let parsedSelections = JSON.parse(storedQuiz9Selections);

            // Loop through all stored answers
            for (let videoId in parsedSelections) {
                let userAnswer = parsedSelections[videoId];
                let correctAnswer = correctAnswers[videoId];

                // Get the element where we will show the correct answer
                let correctAnswerElement = $(`#correct-answer-${videoId}`);

                // If the user's answer is correct, color the correct answer green, else red
                if (userAnswer === correctAnswer) {
                    correctAnswerElement.addClass("correct"); // Green for correct
                } else {
                    correctAnswerElement.addClass("incorrect"); // Red for incorrect
                }
            }
        }
    }

    // --- QUIZ 11 ---
    if (window.location.pathname.includes("/quiz/11")) {
        // Retrieve the total score from sessionStorage
        let accPoints = parseInt(sessionStorage.getItem("accPoints") || "0");

        // Display the total score
        $("#final-score").text(accPoints);
    }
});
