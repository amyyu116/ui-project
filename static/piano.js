let audio;
const interval = 575;

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

function playAudio(notes, interval) {
    clearKeys(); // Clear any previous highlights

    for (let i = 0; i < notes.length; ++i) {
        setTimeout(() => {
            clearKeys(); // Clear previous highlight
            pressKey(notes[i]); // Highlight current key
        }, interval * i);
    }

    // Highlight all notes together after staggered presses
    setTimeout(() => {
        clearKeys();
        notes.forEach(pressKey);
    }, interval * notes.length);
}

$(document).ready(function () {
    $(document).on("click", "button[data-chord]", function () {
        const chordName = $(this).data("chord");
        const notes = chords[chordName];
        if (!notes) return;

        // Play visual animation
        playAudio(notes, interval);

        // Play audio
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
        audio = new Audio(`../static/${chordName}.mp3`);
        audio.play();

        // Clear highlights when audio ends
        audio.onended = function () {
            clearKeys();
        };
    });
});
