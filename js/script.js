// sound effecti
function drawIt() {
    var x = 600;
    var y = 300;
    var dx = 2;
    var dy = 4;
    var WIDTH;
    var HEIGHT;
    var r = 10;
    var tocke;
    var rowcolors = ["#008000", "#FFFD0A", "#00A308", "#0008DB", "rgb(128, 23, 0)"];
    var paddlecolor = "#FF0000";
    var ballcolor = "#00FF00";
    var start = true;
    var bricks;
    let pulseTime = 0;
    var colors;
    let kateri = 0;
    var NROWS;
    var NCOLS;
    var BRICKWIDTH;
    var BRICKHEIGHT;
    var PADDING;
    var ctx;
    var canvass;
    var lives = 5;
    let timerStarted = false;
    canvass = document.getElementById('canvas');
    var difficulty = document.getElementById("difficulty");
    let highScore = sessionStorage.getItem("highScore") || 0;
    var diff;
    var hitrost = 0.1;
    let pomakniZa = 0;
    let intervalId;
    var rightDown = false;
    var leftDown = false;
    var paddlex;
    var paddleh;
    var paddlew;
    var paddleBounce;
    const img = new Image();
    img.src = 'img/as2.png';
    const img2 = new Image();
    img2.src = 'img/ladica.png';
    let isGameRunning = false;
    let isGamePaused = false;
    let explosions = [];
    let gameOver = false;
    let victory = false;

    function init() {
        ctx = $('#canvas')[0].getContext("2d");
        WIDTH = $("#canvas").width();
        HEIGHT = $("#canvas").height();
        tocke = 0;
        sekunde = 0;
        izpisTimer = "00:00";
        $("#tocke").html(tocke);
        $("#cas").html(izpisTimer);
        $("#warning").hide();
        sessionStorage.setItem("highScore", highScore);
        $("#highscore").text(highScore);
        lives = 5;
        pomakniZa = 0;

        init_paddle();
        initbricks();

        if (!intervalId) intervalId = setInterval(draw, 10);


        isGameRunning = true;
        isGamePaused = false;
    }


    function circle(x, y, r) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }

    function rect(x, y, w, h) {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
        ctx.fill();
    }

    function drawPaddle(x, y, w, h) {
        ctx.beginPath();
        ctx.drawImage(img2, 0, 457, 189, 55, x, y, 189, 55);
        ctx.closePath();
        ctx.fill();
    }

    function drawAsteroid(x, y, katerix) {
        ctx.beginPath();
        ctx.drawImage(img, katerix, 448, 64, 64, x, y, 64, 64);
        ctx.closePath();
        ctx.fill();
    }

    function clear() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }
    //END LIBRARY CODE
    function init_paddle() {
        paddlex = WIDTH / 2;
        paddleh = 55;
        paddlew = 189;
        paddleBounce = paddleh;
    }
    //nastavljanje leve in desne tipke
    function onKeyDown(evt) {
        if (gameOver || victory) return;
        if (evt.keyCode == 39)
            rightDown = true;
        else if (evt.keyCode == 37)
            leftDown = true;
        else if (evt.key === "Escape") {
            if (isGameRunning) {
                isGamePaused = !isGamePaused;
            }
        }
    }

    const select = document.getElementById('difficulty');
    select.addEventListener('change', (e) => {
        diff = e.target.value;
        getDifficulty();
    });

    function onKeyUp(evt) {
        if (evt.keyCode == 39)
            rightDown = false;
        else if (evt.keyCode == 37) leftDown = false;
    }
    $(document).keydown(onKeyDown);
    $(document).keyup(onKeyUp);

    document.addEventListener("mousemove", mouseMoveHandler, false);

    function mouseMoveHandler(e) {
        var relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddlex = relativeX - paddlew / 2;
        }
    }

    document.getElementById("startBtn").addEventListener("click", () => {
        if (!isGameRunning) {
            init();
        } else if (isGamePaused) {
            resumeGame();
        }
    });

    document.getElementById("pauseBtn").addEventListener("click", () => {
        if (isGameRunning) {
            pauseGame();
        }
    });

    document.getElementById("restartBtn").addEventListener("click", () => {
        restartGame();
    });


    function draw() {
        clear();
        pulseTime += 0.1;
        if (isGamePaused) {
            const pulse = Math.sin(pulseTime * 5) * 0.5 + 0.5;
            ctx.font = "bold 60px Arial";
            ctx.fillStyle = `rgba(255, 0, 0, ${0.5 + pulse * 0.5})`;
            ctx.textAlign = "center";
            ctx.fillText("PAUSED", WIDTH / 2, HEIGHT / 2);
            return; // Skip game updates, but keep drawing everything as-is
        }

        if (gameOver) {
            ctx.save();
            ctx.clearRect(0, 0, WIDTH, HEIGHT); // Clear screen so text isn't drawn over old frames
            const scale = 1 + 0.05 * Math.sin(Date.now() / 200);
            updateScore(tocke);
            ctx.font = `bold ${50 * scale}px Arial`;
            ctx.fillStyle = "red";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("GAME OVER", WIDTH / 2, HEIGHT / 2);
            ctx.restore();

            return;
        }
        else if (victory) {
            ctx.save();
            ctx.clearRect(0, 0, WIDTH, HEIGHT); // Clear screen
            updateScore(tocke);
            const scale = 1 + 0.05 * Math.sin(Date.now() / 200);
            ctx.font = `bold ${50 * scale}px Arial`;
            ctx.fillStyle = "lime";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("YOU WIN!", WIDTH / 2, HEIGHT / 2);
            ctx.restore();

            return;
        }


        if (isGamePaused) {
            const pulse = Math.sin(pulseTime * 5) * 0.5 + 0.5;
            ctx.font = "bold 60px Arial";
            ctx.fillStyle = `rgba(255, 0, 0, ${0.5 + pulse * 0.5})`;
            ctx.textAlign = "center";
            ctx.fillText("PAUSED", WIDTH / 2, HEIGHT / 2);
            return;
        }

        drawLaser(x, y, dx, dy);


        //premik levo in desno
        if (rightDown) {
            if ((paddlex + paddlew) < WIDTH) {
                paddlex += 5;
            } else {
                paddlex = WIDTH - paddlew;
            }
        }
        else if (leftDown) {
            if (paddlex > 0) {
                paddlex -= 5;
            } else {
                paddlex = 0;
            }
        }
        ctx.globalCompositeOperation = "destination-over";
        drawPaddle(paddlex, HEIGHT - paddleh, paddlew, paddleh);
        for (i = 0; i < NROWS; i++) {
            for (j = 0; j < NCOLS; j++) {
                if (bricks[i][j] == 1) {
                    let asteroidX = (j * (BRICKWIDTH + PADDING)) + PADDING;
                    let asteroidY = (i * (BRICKHEIGHT + PADDING)) + PADDING + pomakniZa;

                    ctx.globalCompositeOperation = "source-over";
                    drawAsteroid(asteroidX, asteroidY, colors[i][j]);

                    let asteroidBottom = asteroidY + BRICKHEIGHT;
                    let paddleTop = HEIGHT - paddleh;

                    //  ESCAPE CHECK — asteroid passed below the screen
                    if (asteroidY > HEIGHT) {
                        gameOver = true;
                        return; // Stop further processing
                    }

                    //  Paddle collision
                    if (
                        asteroidBottom >= paddleTop &&
                        asteroidY <= HEIGHT &&
                        asteroidX + BRICKWIDTH >= paddlex &&
                        asteroidX <= paddlex + paddlew
                    ) {
                        bricks[i][j] = 0; // remove brick on impact
                        lives--;

                        let explosionX = asteroidX + BRICKWIDTH / 2;
                        let explosionY = paddleTop + paddleh / 2;

                        explosions.push({ x: explosionX, y: explosionY, radius: 0, alpha: 1 });
                    }

                    //  Game over on life loss
                    if (lives <= 0) {
                        $("#lives").html("Lives: " + lives);
                        gameOver = true;
                        //alert("Game Over! All lives lost!");
                        return;
                    }
                }

                //  UI Updates
                $("#lives").html("Lives: " + lives);
                if (lives <= 2 && lives > 0) {
                    $("#warning").show();
                    if (Math.floor(Date.now() / 500) % 2 === 0) {
                        $("#warning").css("visibility", "visible");
                    } else {
                        $("#warning").css("visibility", "hidden");
                    }
                } else {
                    $("#warning").hide();
                }
            }
        }

        pomakniZa += hitrost;
        if (start === true) {
            if (!timerStarted) {
                timerStarted = true;
                sekunde = 0;
            }

            sekunde++;

            let sekundeI = ((sekunde % 60) > 9) ? (sekunde % 60) : "0" + (sekunde % 60);
            let minuteI = ((Math.floor(sekunde / 60)) > 9) ? Math.floor(sekunde / 60) : "0" + Math.floor(sekunde / 60);
            izpisTimer = minuteI + ":" + sekundeI;

            $("#cas").html(izpisTimer);
        } else {
            $("#cas").html(izpisTimer);
        }


        /*let bottomOfBricks = NROWS * (BRICKHEIGHT + PADDING) + pomakniZa;
        let paddleTop = HEIGHT - paddleh;

        if (bottomOfBricks >= paddleTop) {
            clearInterval(intervalId);
            alert("Game Over! The asteroids reached you!");
        }*/

        rowheight = BRICKHEIGHT + PADDING; //Smo zadeli opeko?
        colwidth = BRICKWIDTH + PADDING;
        row = Math.floor((y - pomakniZa) / rowheight);
        col = Math.floor(x / colwidth);
        //Če smo zadeli opeko, vrni povratno kroglo in označi v tabeli, da opeke ni več
        if (tocke == NROWS * NCOLS) {
            //win
        }
        if (
            row >= 0 && row < NROWS &&
            col >= 0 && col < NCOLS &&
            bricks[row][col] == 1
        ) {
            dy = -dy;
            const hitColor = colors[row][col];
            floodFillBricks(row, col, hitColor);
            $("#tocke").html(tocke);
        }

        if (x + dx > WIDTH - r || x + dx < r)
            dx = -dx;
        if (y + dy < r)
            dy = -dy;
        else if (y + dy > HEIGHT - paddleBounce - r) {
            //start = false;
            let hitPos = x - paddlex; // where the ball hits the paddle horizontally
            let ballBottom = y + r;
            let paddleTop = HEIGHT - paddleh;

            // Flat part (middle)
            if (hitPos >= 55 && hitPos <= 134 && ballBottom >= paddleTop) {
                dy = -dy;
                dx = 8 * ((x - (paddlex + paddlew / 2)) / paddlew);
                start = true;
            }
            // Left slope (with k = -0.5)
            else if (hitPos >= 0 && hitPos < 55) {
                let slopeY = paddleTop + 0.5 * (55 - hitPos); // gentler slope
                if (ballBottom >= slopeY) {
                    dy = -dy;
                    dx = 8 * ((x - (paddlex + paddlew / 2)) / paddlew);
                    start = true;
                }
            }

            // Right slope (with k = 0.5)
            else if (hitPos > 134 && hitPos <= 189) {
                let slopeY = paddleTop + 0.5 * (hitPos - 134);
                if (ballBottom >= slopeY) {
                    dy = -dy;
                    dx = 8 * ((x - (paddlex + paddlew / 2)) / paddlew);
                    start = true;
                }
            }

            else if (y + dy > HEIGHT - r) {
                gameOver = true;
                console.log("kdi");
            }
        }
        x += dx;
        y += dy;
        for (let i = explosions.length - 1; i >= 0; i--) {
            let ex = explosions[i];

            // Style
            ctx.beginPath();
            ctx.arc(ex.x, ex.y, ex.radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.strokeStyle = `rgba(255, 165, 0, ${ex.alpha})`; // orange
            ctx.lineWidth = 4;
            ctx.stroke();

            // Animate
            ex.radius += 2;
            ex.alpha -= 0.05;

            if (ex.alpha <= 0) {
                explosions.splice(i, 1); // remove when done
            }
        }

        if (!gameOver && bricks.flat().every(cell => cell === 0) && lives > 0) {
            victory = true;
        }

    }

    function initbricks() { //inicializacija opek - polnjenje v tabelo
        NROWS = 3;
        NCOLS = 15;
        BRICKWIDTH = 64;
        BRICKHEIGHT = 64;
        PADDING = 16;
        bricks = new Array(NROWS);
        colors = new Array(NROWS);
        let rand;
        for (var i = 0; i < NROWS; i++) {
            bricks[i] = new Array(NCOLS);
            colors[i] = new Array(NCOLS);
            for (var j = 0; j < NCOLS; j++) {
                if (rand > 0 && rand < 26) {
                    kateri = 192 + 128;
                }
                else if (rand >= 25 && rand < 76) {
                    kateri = 192 + 64;
                } else if (rand >= 90) {
                    kateri = 192;
                }
                else {
                    kateri = 192 * 2;
                }
                bricks[i][j] = 1;
                rand = Math.floor(Math.random() * 100);
                colors[i][j] = kateri;
            }
        }
    }
    function drawLaser(x, y, dx, dy) {
        ctx.save();

        // Calculate angle
        const angle = Math.atan2(dy, dx);
        ctx.translate(x, y);
        ctx.rotate(angle);

        // Pulse logic: oscillate width and alpha
        const pulseWidth = 4 + Math.sin(pulseTime * 2) * 2; // width 2–6 px
        const alpha = 0.7 + Math.sin(pulseTime * 3) * 0.3;   // alpha 0.4–1.0

        const laserGradient = ctx.createLinearGradient(-30, 0, 30, 0);
        laserGradient.addColorStop(0, `rgba(0,255,255,0)`);
        laserGradient.addColorStop(0.5, `rgba(0,255,255,${alpha})`);
        laserGradient.addColorStop(1, `rgba(0,255,255,0)`);

        ctx.fillStyle = laserGradient;
        ctx.shadowColor = "cyan";
        ctx.shadowBlur = 20;

        ctx.fillRect(-30, -pulseWidth / 2, 60, pulseWidth);

        ctx.shadowBlur = 0;
        ctx.restore();
    }
    function pauseGame() {
        isGamePaused = true;
    }

    function resumeGame() {
        isGamePaused = false;
    }
    function restartGame() {
        clearInterval(intervalId);
        intervalId = null;
        isGameRunning = false;
        isGamePaused = false;
        gameOver = false;
        victory = false;
        x = 600;
        y = 300;
        dx = 2;
        dy = 4;
        init();
    }
    function floodFillBricks(row, col, colorIndex) {
        if (row < 0 || row >= NROWS || col < 0 || col >= NCOLS) return;
        if (bricks[row][col] === 0) return;
        if (colors[row][col] !== colorIndex) return;

        // Calculate position of the asteroid
        let x = (col * (BRICKWIDTH + PADDING)) + PADDING + BRICKWIDTH / 2;
        let y = (row * (BRICKHEIGHT + PADDING)) + PADDING + BRICKHEIGHT / 2 + pomakniZa;

        // Add explosion
        explosions.push({ x, y, radius: 0, alpha: 1 });

        bricks[row][col] = 0;
        tocke += 1;

        // All 8 directions: vertical, horizontal, and diagonal
        const directions = [
            [-1, 0], // up
            [1, 0], // down
            [0, -1], // left
            [0, 1], // right
            [-1, -1], // up-left
            [-1, 1], // up-right
            [1, -1], // down-left
            [1, 1]  // down-right
        ];

        for (const [dRow, dCol] of directions) {
            floodFillBricks(row + dRow, col + dCol, colorIndex);
        }
    }
    function getDifficulty() {
        switch (diff) {
            case 'easy':
                hitrost = 0.1;
                break;
            case 'medium':
                hitrost = 0.2;
                break;
            case 'hard':
                hitrost = 0.4;
                break;
        }
    }
    function updateScore(newScore) {
        if (newScore > highScore) {
            highScore = newScore;
            sessionStorage.setItem("highScore", highScore);
            $("#highscore").text(highScore);
        }
    }
    init();
    init_paddle();
    initbricks();
}