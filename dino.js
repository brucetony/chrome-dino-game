//board
let board;
let baordWidth = 750;
let boardHeight = 250;
let context;

//dino variables
let dinoWidth = 88;
let dinoHeight = 94;

let dinoX = 50;
let dinoY = boardHeight - dinoHeight;

let dinoImg;

let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight,
}

// cacti
let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;
let cactusHeight = 70;

let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

// physics + game
let velocityX = -4;
let velocityY = 0;
let gravity = 0.3;

let gameOver = false;
let score = 0;

window.onload = function () {
    board = document.getElementById("board")
    board.height = boardHeight;
    board.width = baordWidth;

    context = board.getContext("2d"); // used for drawing on the board

    //draw rectangel for testing
    // context.fillStyle = "green";
    // context.fillRect(dino.x, dino.y, dino.width, dino.height)

    dinoImg = new Image();
    dinoImg.src = "/img/dino.png";
    dinoImg.onload = function () {
        context.drawImage(dinoImg, dino.x, dino.y, dino.height, dino.width);
    }

    cactus1Img = new Image();
    cactus1Img.src = "./img/cactus1.png"

    cactus2Img = new Image();
    cactus2Img.src = "./img/cactus2.png"

    cactus3Img = new Image();
    cactus3Img.src = "./img/cactus3.png"

    requestAnimationFrame(update)
    setInterval(placeCactus, 1000); // 1000 milliseconds
    document.addEventListener("keydown", moveDino)
}

function update() {
    if (gameOver) {
        return;
    }

    requestAnimationFrame(update);

    // clear canvas
    context.clearRect(0, 0, board.width, board.height);

    // dino
    velocityY += gravity;  // velocity in Y get stronger over time
    dino.y = Math.min(dino.y + velocityY, dinoY);  // Prevent going through the ground
    context.drawImage(dinoImg, dino.x, dino.y, dino.height, dino.width);

    // cactus
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height)

        if (detectCollision(dino, cactus)) {
            gameOver = true;
            dinoImg.src = "./img/dino-dead.png";
            dinoImg.onload = function () {
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height)
            }
        }
    }

    //score
    context.fillStyle = "black";
    context.font = "20px courier";
    score++;
    context.fillText(score, 5, 20);
}

function moveDino(e) {
    if (gameOver) {
        return;
    }

    if ((e.code === "Space" || e.code === "ArrowUp") && dino.y === dinoY) {
        // jump
        velocityY = -10;
    }
}

function placeCactus() {
    if (gameOver) {
        return;
    }

    // place cactus
    let cactus = {
        img: null,
        x : cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight,
    }

    let placeCactusChance = Math.random(); // 0 - 0.9999

    if (placeCactusChance > 0.90) { // place cactus 3
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    } else if (placeCactusChance > 0.70) {  // place cactus 2
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    } else if (placeCactusChance > 0.5) {  // place cactus 1
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }

    if (cactusArray.length > 5) {
        cactusArray.shift(); //Remove first element from array so it doesn't grow unending
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   // a's top left corner doesn't reach b's top right corner
        a.x + a.width > b.x &&      // a top right + b top left
        a.y < b.y + b.height &&     // a top left + b bottom left
        a.y + a.height > b.y;       // a bottom left + b top left
}
