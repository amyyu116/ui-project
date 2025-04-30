$(document).ready(function () {

    // reset quiz responses when quiz is restarted (not from "back" nav buttons)
    if (window.location.search.includes("restart=true")) {
        sessionStorage.clear();
        sessionStorage.setItem("quizPoints", "0");
        console.log("Session cleared.")
        $.ajax({
            url: '/restart-quiz',
            method: 'GET',
            success: function () {
                window.location.href = "/quiz/1";
            }
        });
        return;
    }

    let accPoints = parseInt(sessionStorage.getItem("quizPoints") || "0");

    // log answers in server
    function saveAnswers(page, answers, points = null) {
        if (points !== null) {
            sessionStorage.setItem("quizPoints", points.toString());
        }
        $.ajax({
            url: '/save-response',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                page: page,
                answers: answers,
                accPoints: points || accPoints
            }),
            success: function (response) {
                console.log('Saved successfully:', response);
            },
            error: function (error) {
                console.error('Error saving:', error);
            }
        });
    }

    // add green/red highlight for correct/incorrect answers
    function highlight(selections) {
        $(".btn-option[data-correct=true]").addClass("correct"); 

        for (let group in selections) {
            if (selections[group]) {
                let { id, isCorrect } = selections[group];
                let $btn = $(`#${id}`);
                if (isCorrect === false || isCorrect === "false") {
                    $btn.addClass("incorrect");
                } else {
                    $btn.addClass("correct");
                }
            }
        }
    }

    // --- QUIZ 1 ---
    if (window.location.pathname.includes("/quiz/1")) {
        let selections = {
            sound: null,
            case: null,
        };

        // display answers if found in storage

        let stored = sessionStorage.getItem("quiz1Selections");
        if (stored) {
            selections = JSON.parse(stored);
            for (let group in selections) {
                if (selections[group] && selections[group].id) {
                    $(`#${selections[group].id}`).addClass("selected");
                }
            }
            
            if (selections.sound && selections.case) {
                $("#next-button").prop("disabled", false);
            }
        }

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
            saveAnswers("1", selections);
            // Enable Next if both answered
            if (selections.sound && selections.case) {
                $("#next-button").prop("disabled", false);
            }
        });
    }

    // --- QUIZ 2 ---
    if (window.location.pathname.includes("/quiz/2")) {
        $("#next-button").prop("disabled", false); // Always enabled
        
        let stored = sessionStorage.getItem("quiz1Selections");
        if (stored) {
            let parsed = JSON.parse(stored);
            highlight(parsed);

            if (!sessionStorage.getItem("quiz2Scored")) {
                let points = 0;
                for (let group in parsed) {
                    if (parsed[group].isCorrect === true || parsed[group].isCorrect === "true") {
                        points += 1;
                    }
                }
                accPoints += points;
                sessionStorage.setItem("quizPoints", accPoints.toString());
                sessionStorage.setItem("quiz2Scored", "true");
                saveAnswers("2", parsed, accPoints);
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

            
            $(`.btn-option[data-group=${group}]`).removeClass("selected");
            $this.addClass("selected");

            sessionStorage.setItem(
                "quiz3Selections",
                JSON.stringify(quiz3Selections)
            );
            saveAnswers("3", quiz3Selections);

            $("#next-button").prop("disabled", false);
        });

        
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
        $("#next-button").prop("disabled", false); 
        
        let stored = sessionStorage.getItem("quiz3Selections");


        if (stored) {
            let parsed = JSON.parse(stored);
            highlight(parsed);

            if (!sessionStorage.getItem("quiz4Scored")) {
                let points = 0;
                for (let group in parsed) {
                    if (parsed[group].isCorrect === true || parsed[group].isCorrect === "true") {
                        points += 1;
                    }
                }
                accPoints += points;
                sessionStorage.setItem("quizPoints", accPoints.toString());
                sessionStorage.setItem("quiz4Scored", "true");
                saveAnswers("4", parsed, accPoints);
            }
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

           
            $(`.btn-option[data-group=${group}]`).removeClass("selected");
            $this.addClass("selected");

            sessionStorage.setItem(
                "quiz5Selections",
                JSON.stringify(quiz5Selections)
            );
            saveAnswers("5", quiz5Selections);

            $("#next-button").prop("disabled", false);
        });

        let stored = sessionStorage.getItem("quiz5Selections");
        if (stored) {
            let parsed = JSON.parse(stored);
            for (let group in parsed) {
                $(`#${parsed[group].id}`).addClass("selected");
            }
            $("#next-button").prop("disabled", false);
        }
    }

    // --- QUIZ 6 ---

    if (window.location.pathname.includes("/quiz/6")) {
        $("#next-button").prop("disabled", false); 

        let stored = sessionStorage.getItem("quiz5Selections");

        if (stored) {
            let parsed = JSON.parse(stored);
            highlight(parsed);

            if (!sessionStorage.getItem("quiz6Scored")) {
                let points = 0;
                for (let group in parsed) {
                    if (parsed[group].isCorrect === true || parsed[group].isCorrect === "true") {
                        points += 1;
                    }
                }
                accPoints += points;
                sessionStorage.setItem("quizPoints", accPoints.toString());
                sessionStorage.setItem("quiz6Scored", "true");
                saveAnswers("6", parsed, accPoints);
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

            $(`.btn-option[data-group=${group}]`).removeClass("selected");
            $this.addClass("selected");

            sessionStorage.setItem(
                "quiz7Selections",
                JSON.stringify(quiz7Selections)
            );
            saveAnswers("7", quiz7Selections);

            $("#next-button").prop("disabled", false);
        });

        let stored = sessionStorage.getItem("quiz7Selections");
        if (stored) {
            let parsed = JSON.parse(stored);
            for (let group in parsed) {
                $(`#${parsed[group].id}`).addClass("selected");
            }
            $("#next-button").prop("disabled", false);
        }
    }

    // --- QUIZ 8 ---

    if (window.location.pathname.includes("/quiz/8")) {
        $("#next-button").prop("disabled", false);
        
        let stored = sessionStorage.getItem("quiz7Selections");
        
        $(".btn-option[data-correct=true]").addClass("correct");

        if (stored) {
            let parsed = JSON.parse(stored);
            highlight(parsed);

            if (!sessionStorage.getItem("quiz8Scored")) {
                let points = 0;
                for (let group in parsed) {
                    if (parsed[group].isCorrect === true || parsed[group].isCorrect === "true") {
                        points += 1;
                    }
                }
                accPoints += points;
                sessionStorage.setItem("quizPoints", accPoints.toString());
                sessionStorage.setItem("quiz8Scored", "true");
                saveAnswers("8", parsed, accPoints);
            }
        }
    }


    // quiz question 5 handled differently because of different format
    // --- QUIZ 9 ---
    if (window.location.pathname.includes("/quiz/9")) {
        let quiz9Selections = {};

        const correctAnswers = {
            v1: "I–V–vi–IV", // First video correct answer
            v2: "I–V–vi–iii-IV", // Second video correct answer
            v3: "ii–V–I" // Third video correct answer
        };

        $(".match-select").change(function () {
            let videoId = $(this).data("video-id");
            let selectedAnswer = $(this).val();

            quiz9Selections[videoId] = selectedAnswer;

            let allAnswered =
                Object.keys(quiz9Selections).length ===
                Object.keys(correctAnswers).length;
            $("#next-button").prop("disabled", !allAnswered);

            sessionStorage.setItem(
                "quiz9Selections",
                JSON.stringify(quiz9Selections)
            );
            saveAnswers("9", quiz9Selections);

            $(`.user-answer-${videoId}`).text(selectedAnswer);
        });

        let stored = sessionStorage.getItem("quiz9Selections");
        if (stored) {
            let parsed = JSON.parse(stored);
            for (let id in parsed) {
                $(`.match-select[data-video-id=${id}]`).val(parsed[id]);
                $(`.user-answer-${id}`).text(parsed[id]);
            }
            $("#next-button").prop("disabled", false);
        }
    }
    // --- QUIZ 10 ---
    if (window.location.pathname.includes("/quiz/10")) {
        $("#next-button").prop("disabled", false);
        
        const correctAnswers = {
            v1: "I–V–vi–IV",
            v2: "I–V–vi–iii-IV",
            v3: "ii–V–I"
        };

        let stored = sessionStorage.getItem("quiz9Selections");

        if (stored) {
            let parsed = JSON.parse(stored);
            let points = 0;
            for (let id in parsed) {
                let userAnswer = parsed[id];
                let isCorrect = userAnswer === correctAnswers[id];

                $(`#user-answer-${id}`).text(userAnswer)
                    .addClass(isCorrect ? "correct" : "incorrect");
                $(`#correct-answer-${id}`).text(correctAnswers[id])
                    .addClass("correct");

                if (!sessionStorage.getItem("quiz10Scored") && isCorrect) {
                    points += 1;
                }
            }
            if (!sessionStorage.getItem("quiz10Scored")) {
                accPoints += points;
                sessionStorage.setItem("quizPoints", accPoints.toString());
                sessionStorage.setItem("quiz10Scored", "true");
                saveAnswers("10", parsed, accPoints);
            }
        }
    }

    // --- QUIZ 11 ---
    if (window.location.pathname.includes("/quiz/11")) {
        
        let finalScore = accPoints;

        // Display total
        $("#final-score").text(finalScore);

        $("#restart-button").click(function () {
            sessionStorage.clear();
            window.location.href = "/restart-quiz";
        });

        saveAnswers("11", {}, finalScore);

    }
});