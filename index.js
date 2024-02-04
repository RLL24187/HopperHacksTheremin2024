const point = {
    x: 0.0,
    y: 0.0,
    r: 0.0, 
    angle: 0.0, // degrees
};

const synth = new Tone.Synth().toDestination();
const simBtn = document.getElementById('toggleSimBtn');
const soundBtn = document.getElementById('toggleSoundBtn');
const cMajorBtn = document.getElementById('cMajorBtn');
const canvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");
let w = canvas.width;
let h = canvas.height;
window.addEventListener('load', ()=>{ 
        
    resize(); // Resizes the canvas once the window loads 
    document.addEventListener('mousedown', startPainting); 
    document.addEventListener('mouseup', stopPainting); 
    document.addEventListener('mousemove', sketch); 
    // window.addEventListener('resize', resize); 
}); 
    
// Resizes the canvas to the available size of the window. 
function resize(){ 
  ctx.canvas.width = window.innerWidth; 
  ctx.canvas.height = window.innerHeight; 
  w = window.innerWidth;
  h = window.innerHeight;
} 
    
// Stores the initial position of the cursor 
let coord = {x:0 , y:0};  
   
// This is the flag that we are going to use to  
// trigger drawing 
let paint = false; 
    
// Updates the coordianates of the cursor when  
// an event e is triggered to the coordinates where  
// the said event is triggered. 
function getPosition(event){ 
//   coord.x = event.clientX - canvas.offsetLeft; 
//   coord.y = event.clientY - canvas.offsetTop; 
    coord.x = event.pageX - canvas.offsetLeft;
    coord.y = event.pageY - canvas.offsetTop;
//   coord.x = event.clientX + BB.left; 
//   coord.y = event.clientY + BB.top; 
} 
  
// The following functions toggle the flag to start 
// and stop drawing 
function startPainting(event){ 
  paint = true; 
  getPosition(event); 
} 
function stopPainting(){ 
  paint = false; 
} 
    
function sketch(event){ 
  if (!paint) return; 
  ctx.beginPath(); 
    
  ctx.lineWidth = 5; 
   
  // Sets the end of the lines drawn 
  // to a round shape. 
  ctx.lineCap = 'round'; 
    
  ctx.strokeStyle = 'blue'; 
      
  // The cursor to start drawing 
  // moves to this coordinate 
  ctx.moveTo(coord.x, coord.y); 
   
  // The position of the cursor 
  // gets updated as we move the 
  // mouse around. 
  getPosition(event); 
   
  // A line is traced from start 
  // coordinate to this coordinate 
  ctx.lineTo(coord.x , coord.y); 
    
  // Draws the line. 
  ctx.stroke(); 
}

function erase() {
    ctx.clearRect(0, 0, w, h);
}

let posX = 0;
let posY = 0;
let mouseIntheremin = false;

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

cMajorBtn.addEventListener("click", () => {
    if (Tone.context.state !== "running") {
        Tone.start();
    }
    cMajor();
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


const canvasScreen = document.getElementById('canvas');
canvasScreen.addEventListener("mousedown", thereminHover);
canvasScreen.addEventListener("mouseup", thereminNoHover);
canvasScreen.addEventListener("mouseout", thereminNoHover);
canvasScreen.addEventListener("mouseover", thereminNoHover);

const theremin = document.getElementById('simScreen');
theremin.addEventListener("mousedown", thereminHover);
theremin.addEventListener("mouseup", thereminNoHover);
theremin.addEventListener("mouseout", thereminNoHover);
theremin.addEventListener("mouseover", thereminHover);

function thereminHover() {
    mouseIntheremin = true;
    // theremin.style.cursor = "crosshair";
    // posX = event.clientX;
    // posY = event.clientY;
    // synth.triggerAttack(posY, 0);
    // draw();
    
}

function thereminNoHover() {
    mouseIntheremin = false;
    synth.triggerRelease();
    // theremin.style.cursor = "default";
    erase();
}

const container = document.getElementById('container');
document.onmousemove = (event) => {
    posX = event.pageX;
    posY = event.pageY;
    console.log(Screen.width);
    const now = Tone.now()
    if (mouseIntheremin) {
        synth.triggerAttack(posY, 0, posX / w);
        console.log("X: %.2f\nY: %.2f\n", posX, posY);
    }
}

// angle [0, 159]
// 0-250
function polarToCartesian(point) {
    point.x = r * Math.cos(point.angle);
    point.y = r * Math.sin(point.angle);
}

function cartesianToPolar(point) {
    point.r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    point.angle = Math.atan(point.y / point.x);
}

let timing = 0;

function cMajor() {
    

    const melody = [
        { note: "C4", duration: "8n", timing: 0 },
        { note: "D4", duration: "8n", timing: 0.25 },
        { note: "E4", duration: "8n", timing: 0.5 },
        { note: "F4", duration: "8n", timing: 0.75 },
        { note: "G4", duration: "8n", timing: 1 },
        { note: "A4", duration: "8n", timing: 1.25 },
        { note: "B4", duration: "8n", timing: 1.5 },
        { note: "C5", duration: "8n", timing: 1.75 }];

    melody.forEach(tune => {
        const now = Tone.now();
        synth.triggerAttackRelease(tune.note, tune.duration, now + tune.timing);

        switch(tune.note) {
            case "C4":
                point.y = 261.63;
                break;
            case "D4":
                point.y = 293.66;
                break;
            case "E4":
                point.y = 329.63;
                break;
            case "F4":
                point.y = 349.23;
                break;
            case "G4":
                point.y = 392.00;
                break;
            case "A4":
                point.y = 440.00;
                break;
            case "B4":
                point.y = 493.88;
                break;
            case "C5":
                point.y = 523.25;
                break;
            default:
                point.y = 0;
                break;
        }
        point.y -= canvas.offsetTop;
        point.x = 300;
        ctx.beginPath(); 
    
        ctx.lineWidth = 5; 
        ctx.lineCap = 'round'; 
        
        ctx.strokeStyle = 'blue'; 
        
        // The cursor to start drawing 
        // moves to this coordinate 
        ctx.moveTo(point.x, point.y); 
        
        // A line is traced from start 
        // coordinate to this coordinate 
        ctx.lineTo(point.x, point.y); 
            
        // Draws the line. 
        ctx.stroke(); 
        });

}

function mapToRange(x, oldMin, oldMax, newMin, newMax) {
    return x / (oldMax - oldMin) * (newMax - newMin) + newMin;
}


function parseData(data) {
    let lidarPoint = JSON.parse(data);
    console.log(data);
    point.r = lidarPoint.distance;
    point.angle = lidarPoint.angle;
    polarToCartesian(point);
    console.log("X: %.2f, Y: %.2f\n", point.x, point.y);
}

// Serial stuff -------------------------------------------------
if ("serial" in navigator) {
    console.log("yes");
}

// const reader = port.readable.getReader();
document.querySelector('button').addEventListener('click', async () => {
    // // Prompt user to select any serial port.
    const port = await navigator.serial.requestPort();
    // Get all serial ports the user has previously granted the website access to.
    // const ports = await navigator.serial.getPorts();
    let index = 0;

    // Wait for the serial port to open.
    await port.open({ baudRate: 9600 });
    while (port.readable) {
        const reader = port.readable.getReader();
        let data = "";

        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              // Allow the serial port to be closed later.
              reader.releaseLock();
              break;
            }
            // if (value) {
            //   console.log(value);
            // }
            data = Utf8ArrayToStr(value);
            console.log(data);
            point.r = Number(data.substring(data.indexOf("ce\":")+4, data.indexOf(",")));
            point.angle = Number(data.substring(data.indexOf("le\":")+4, data.indexOf("}")));
            console.log("Distance: %s, Angle: %s\n", point.r, point.angle);
            // point.r = map(point.r, 1, 160, 0, w);
            // point.angle = map(point.angle, 6, 512, 250, h);
            // polarToCartesian(point);
            // console.log("X: %.2f, Y: %.2f\n", point.x, point.y);
            
          }
        } catch (error) {
          // TODO: Handle non-fatal read error.
        }
      }
});
  
function Utf8ArrayToStr(array) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = array.length;
    i = 0;
    while(i < len) {
    c = array[i++];
    switch(c >> 4)
    { 
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;
      case 12: case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++];
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(((c & 0x0F) << 12) |
                       ((char2 & 0x3F) << 6) |
                       ((char3 & 0x3F) << 0));
        break;
    }
    }

    return out;
}