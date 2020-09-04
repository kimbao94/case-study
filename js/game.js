let canvas = document.getElementById("game");
let context = canvas.getContext("2d");

let Ball = {
    x: 200,
    y: 450,
    dx: -3,
    dy: -7,
    radius: 10
}

let Paddle = {
    width: 100,
    height: 20,
    x: 200,
    y: canvas.height -10,
    speed: 10,
    isMovingLeft: false,
    isMovingRight: false,
}
let Brick = {
    offsetX: 50,
    offsetY: 20,
    margin: 30,
    width: 70,
    height: 15,
    totalRow: 5,
    totalCol: 7
}

let isGameOver = false;
let isGameWin = false;
let UserScore = 0;
let MaxScore = Brick.totalCol * Brick.totalRow;

let scor = new Audio();
scor.src = "sound/score.mp3";

let BrickList = [];

for (let i = 0; i < Brick.totalRow; i++) {
    for (let j = 0; j < Brick.totalCol; j++) {
        BrickList.push({
            x: Brick.offsetX + j * (Brick.width + Brick.margin),
            y: Brick.offsetY + i * (Brick.height + Brick.margin),
            isBroken: false
        })
    }
}
function updateBall() {
    Ball.x += Ball.dx;
    Ball.y += Ball.dy;
}

function updatePalle() {
    if (Paddle.isMovingLeft) {
        Paddle.x -= Paddle.speed;
    } else if (Paddle.isMovingRight) {
        Paddle.x += Paddle.speed;
    }
    if (Paddle.x < 0) {
        Paddle.x = 0;
    } else if (Paddle.x > canvas.width - Paddle.width) {
        Paddle.x = canvas.width - Paddle.width;
    }
}
document.addEventListener('keyup', function (event) {
    if (event.keyCode == 37) {
        Paddle.isMovingLeft = false;
    } else if (event.keyCode == 39) {
        Paddle.isMovingRight = false;
    }
})

document.addEventListener('keydown', function (event) {
    if (event.keyCode == 37) {
        Paddle.isMovingLeft = true
    } else if (event.keyCode == 39) {
        Paddle.isMovingRight = true;
    }
});

function drawBall() {
    context.beginPath();
    context.arc(Ball.x, Ball.y, Ball.radius, 0, Math.PI * 2);
    context.fillStyle = 'red';
    context.fill();
    context.closePath();
}

function drawPaddle() {
    context.beginPath();
    context.rect(Paddle.x, Paddle.y, Paddle.width, Paddle.height);
    context.fillStyle = 'red';
    context.fill();
    context.closePath();
}

function drawBricks() {
    BrickList.forEach(function (b) {
        if (!b.isBroken) {
            context.beginPath();
            context.rect(b.x, b.y, Brick.width, Brick.height);
            context.fillStyle = 'red';
            context.fill();
            context.closePath();
        }
    });
}

function hanleBall() {
    if (Ball.x < Ball.radius || Ball.x > canvas.width - Ball.radius) {
        Ball.dx = -Ball.dx;
    }
    if (Ball.y < Ball.radius || Ball.y > canvas.height - Ball.radius) {
        Ball.dy = -Ball.dy;
    }
}

function hanlePaddle() {
    if (Ball.x + Ball.radius >= Paddle.x && Ball.x + Ball.radius <= Paddle.x + Paddle.width &&
        Ball.y + Ball.radius >= canvas.height - Paddle.height) {
        Ball.dy = -Ball.dy
    }
}

function hanleBrick() {//bóng chạm gạch
    BrickList.forEach(function (b) {
        if (!b.isBroken) {
            if (Ball.x >= b.x && Ball.x <= b.x + Brick.width && Ball.y + Ball.radius >= b.y && Ball.y - Ball.radius <= b.y + Brick.height) {
                Ball.dy = -Ball.dy;
                b.isBroken = true;
                UserScore ++;
                scor.play();
                document.getElementById("score").innerHTML = "Score: " + UserScore;
                if (UserScore >= MaxScore){
                    isGameOver = true;
                    isGameWin =true;
                }
            }
        }
    })

}

function youWin() {
    context.font = "50px Arial";
    context.fillStyle = 'lightsalmon';
    context.fillText("You Win",150,400);
}
function youLose() {
    context.font = "100px Arial";
    context.fillStyle = 'lightsalmon';
    context.fillText("You Lose",150,400);
}

function checkGameOver() {
    if (Ball.y > canvas.height - Ball.radius) {
        isGameOver = true;
    }
}
function checkGameWin() {
    if (isGameWin){
        youWin();
    }else {
        youLose();
    }
}

function draw() {
    if (!isGameOver) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawPaddle();
        drawBricks();

        hanleBall();
        hanlePaddle();
        hanleBrick();

        updateBall();
        updatePalle();

        checkGameOver();
        requestAnimationFrame(draw);
    } else {
        checkGameWin();
    }
}

draw();
