$(document).ready(function () {
    $(document).on("click", "button[data-chord]", function () {
        const chordName = $(this).data("chord");
        const audio = new Audio(`../static/${chordName}.mp3`);
        console.log(`just playing: ${chordName}`);

        audio.play();
    });
});
