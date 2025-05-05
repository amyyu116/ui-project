let audio;
const interval = 575;
let timeouts = []; // Store timeout IDs

let chords = {
    i_chord: ["C4", "E4", "G4"],
    ii_chord: ["D4", "F4", "A4"],
    iii_chord: ["E4", "G4", "B4"],
    iv_chord: ["F4", "A4", "C5"],
    v_chord: ["G4", "B4", "D5"],
    vi_chord: ["A4", "C5", "E5"],
    vii_chord: ["B4", "D5", "F5"],
};

function pressKey(key) {
    $(`div[data-note='${key}']`).css("background-color", "lightgray");
}

function clearKeys() {
    $("div[data-note]").css("background-color", "");
}

function clearTimeouts() {
    for (let id of timeouts) {
        clearTimeout(id);
    }
    timeouts = [];
}

function playAudio(notes, interval) {
    clearTimeouts(); // FIRST: cancel previous animations
    clearKeys(); // THEN: immediately clear keys

    for (let i = 0; i < notes.length; ++i) {
        const timeoutId = setTimeout(() => {
            clearKeys();
            pressKey(notes[i]);
        }, interval * i);
        timeouts.push(timeoutId);
    }

    const finalTimeoutId = setTimeout(() => {
        clearKeys();
        notes.forEach(pressKey);
    }, interval * notes.length);

    timeouts.push(finalTimeoutId);
}

$(document).ready(function () {
    $(document).on("click", "button[data-chord]", function () {
        const chordName = $(this).data("chord");
        const notes = chords[chordName];
        if (!notes) return;

        clearTimeouts();
        clearKeys();

        // Visual animation
        playAudio(notes, interval);

        // Audio
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
        audio = new Audio(`../static/${chordName}.mp3`);
        audio.play();

        audio.onended = function () {
            clearKeys();
        };

        $.ajax({
            type: "POST",
            url: "/log_chord",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                chord: chordName,
                timestamp: new Date().toISOString(),
            }),
            success: function (result) {
                console.log(`Chord ${chordName} logged successfully`);
            },
            error: function (request, status, error) {
                console.log(`Error logging chord: ${error}`);
            },
        });
    });
});
