const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const bird = new Image();
bird.src = 'images/bird.png';

const bg = new Image();
bg.src = 'images/bg.png';

const fg = new Image();
fg.src = 'images/fg.png';

const pipeNorth = new Image();
pipeNorth.src = 'images/pipeNorth.png';

const pipeSouth = new Image();
pipeSouth.src = 'images/pipeSouth.png';

const flySound = new Audio('sounds/fly.mp3');
flySound.playbackRate = 6;

const scoreSound = new Audio('sounds/score.mp3');
const hitSound = new Audio('sounds/hit.mp3');

const GAP = 150;
const PIPE_SOUTH_START = pipeNorth.height + GAP;
const GRAVITY = 1;
const JUMP_HEIGHT = 25;
const MOVE_SPEED = 0.5;
const NEXT_PIPE_GENERATION_POINT = 50;
const SCORE_GENERATION_POINT = 5;
const SCORE_DELTA = 1;

let birdX = 10;
let birdY = 150;

let score = 0;

const pipes = [getNewPipe()];

function drawBackground() {
    context.drawImage(bg, 0, 0);
}

function drawNorthPipe(pipe) {
    context.drawImage(pipeNorth, pipe.x, pipe.y);
}

function drawSouthPipe(pipe) {
    context.drawImage(pipeSouth, pipe.x, pipe.y + PIPE_SOUTH_START);
}

function drawGround() {
    context.drawImage(fg, 0, canvas.height - fg.height);
}

function drawBird() {
    context.drawImage(bird, birdX, birdY);
}

function isBirdXInsidePipe(pipe) {
    return birdX + bird.width >= pipe.x && birdX <= pipe.x + pipeNorth.width;
}

function isBirdYInsidePipe(pipe) {
    return birdY <= pipe.y + pipeNorth.height || birdY + bird.height >= pipe.y + PIPE_SOUTH_START;
}

function doesHitPipe(pipe) {
    return isBirdXInsidePipe(pipe) && isBirdYInsidePipe(pipe);
}

function doesHitGround() {
    return birdY + bird.height >= canvas.height - fg.height || birdY + bird.height >= canvas.height;
}

function doesPassPipe(pipe) {
    return pipe.x < SCORE_GENERATION_POINT && pipe.x >= SCORE_GENERATION_POINT - MOVE_SPEED;
}

function printScore(score) {
    context.fillStyle = '#000';
    context.font = '20px Verdana';
    context.fillText(`Score: ${ score }`, 10, canvas.height - 20);
}

function shouldGenerateNextPipe(pipe) {
    return pipe.x < NEXT_PIPE_GENERATION_POINT && pipe.x >= NEXT_PIPE_GENERATION_POINT - MOVE_SPEED;
}

function getNewPipe() {
    return {
        x: canvas.width,
        y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height,
    };
}

function birdMoveDown() {
    birdY += GRAVITY;
}

function incrementScore() {
    score += SCORE_DELTA;
    scoreSound.play();
}

function movePipeLeft(pipe) {
    pipe.x -= MOVE_SPEED;
}

function jump() {
    birdY -= JUMP_HEIGHT;
    flySound.play();
}

function draw() {

    drawBackground();

    for (let pipe of pipes) {

        drawNorthPipe(pipe);
        drawSouthPipe(pipe);

        movePipeLeft(pipe);

        if (shouldGenerateNextPipe(pipe)) {
            pipes.push(getNewPipe());
        }

        if (doesHitPipe(pipe) || doesHitGround()) {
            hitSound.play();
            location.reload();
        }

        if (doesPassPipe(pipe)) {
            incrementScore();
        }

    }

    drawGround();
    drawBird();
    birdMoveDown();
    printScore(score);

    requestAnimationFrame(draw);
}

document.addEventListener('keydown', jump);

draw();
