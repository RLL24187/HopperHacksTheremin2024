// import * as Tone from 'tone';
const synth = new Tone.Synth().toDestination();
const simBtn = document.getElementById('toggleSimBtn');
const soundBtn = document.getElementById('toggleSoundBtn');

let posX = 0;
let posY = 0;
let mouseInThevenin = false;

soundBtn.addEventListener("click", () => {
    if (Tone.context.state !== "running") {
        Tone.start();
    }
    if (soundBtn.innerHTML==='Turn Sound Off') {
        synth.triggerAttack("C4", 0);
    } else {
        synth.triggerRelease();
    }
})

function toggleSimulator() {
    console.log(simBtn.innerHTML);
    if (simBtn.innerHTML==='Turn Simulator On') {
        simBtn.innerHTML = 'Turn Simulator Off';
    } else {
        simBtn.innerHTML = 'Turn Simulator On';
    }
    
}


function toggleSound() {
    console.log(soundBtn.innerHTML);
    if (soundBtn.innerHTML==='Turn Sound On') {
        soundBtn.innerHTML = 'Turn Sound Off';
        synth.triggerRelease();
    } else {
        soundBtn.innerHTML = 'Turn Sound On';

        // play a middle 'C' for the duration of an 8th note
        synth.triggerAttack("C4", 0);
    }
}

const thevenin = document.getElementById('simScreen');
thevenin.addEventListener("mouseover", theveninHover);
thevenin.addEventListener("mouseout", theveninNoHover);

function theveninHover() {
    mouseInThevenin = true;
    thevenin.style.cursor = "crosshair";
    // posX = event.clientX;
    // posY = event.clientY;
    // synth.triggerAttack(posY, 0);
    
}

function theveninNoHover() {
    mouseInThevenin = false;
    synth.triggerRelease();
    thevenin.style.cursor = "default";
}

const container = document.getElementById('container');
document.onmousemove = (event) => {
    posX = event.clientX;
    posY = event.clientY;
    console.log(Screen.width);
    if (mouseInThevenin) {
        synth.triggerAttack(posY, 0, posX / 1000);
        console.log("X: %.2f\nY: %.2f\n", posX, posY);
    }
}