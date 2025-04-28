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
    canvass = document.getElementById('canvas');
    let pomakniZa = 0;
    let intervalId;
    var rightDown = false;
    var leftDown = false;
    var paddlex;
    var paddleh;
    var paddlew;
    var paddleBounce;
    const img = new Image();
    img.src = 'img/as.png';
    const img2 = new Image();
    img2.src = 'img/ladica.png';

    function init() {
        ctx = $('#canvas')[0].getContext("2d");
        WIDTH = $("#canvas").width();
        HEIGHT = $("#canvas").height();
        tocke = 0;
        sekunde = 0;
        izpisTimer = "00:00";
        $("#tocke").html(tocke);
        return intervalId = setInterval(draw, 10);
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
        if (evt.keyCode == 39)
            rightDown = true;
        else if (evt.keyCode == 37) leftDown = true;
    }

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

    function draw() {

        clear();


        ctx.fillStyle = ballcolor;
        ctx.globalCompositeOperation = "destination-over";
        circle(x, y, 10);
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
                    /*rect((j * (BRICKWIDTH + PADDING)) + PADDING,
                        (i * (BRICKHEIGHT + PADDING)) + PADDING,
                        BRICKWIDTH, BRICKHEIGHT);*/
                    let asteroidX = (j * (BRICKWIDTH + PADDING)) + PADDING;
                    let asteroidY = (i * (BRICKHEIGHT + PADDING)) + PADDING + pomakniZa;
                    ctx.globalCompositeOperation = "source-over";
                    drawAsteroid(asteroidX, asteroidY, colors[i][j]);
                    //drawAsteroid((j * (BRICKWIDTH + PADDING)) + PADDING,
                    //  (i * (BRICKHEIGHT + PADDING)) + PADDING + pomakniZa, colors[i][j]);
                    let asteroidBottom = asteroidY + BRICKHEIGHT;
                    let paddleTop = HEIGHT - paddleh;

                    // Check if asteroid hits the paddle
                    if (
                        asteroidBottom >= paddleTop &&
                        asteroidY <= HEIGHT && // in case it goes too far
                        asteroidX + BRICKWIDTH >= paddlex &&
                        asteroidX <= paddlex + paddlew
                    ) {
                        bricks[i][j] = 0;//remove brick on ship impact
                        lives--;
                    }
                    if (lives <= 0) {
                        clearInterval(intervalId);
                        alert("Game Over! All lives lost!");
                        lives = 5;
                    }
                }
                $("#lives").html("Lives: " + lives);
            }
        }
        pomakniZa += 0.5;
        if (start == true) {
            sekunde++;

            sekundeI = ((sekundeI = (sekunde % 60)) > 9) ? sekundeI : "0" + sekundeI;
            minuteI = ((minuteI = Math.floor(sekunde / 60)) > 9) ? minuteI : "0" + minuteI;
            izpisTimer = minuteI + ":" + sekundeI;

            $("#cas").html(izpisTimer);
        }
        else {
            sekunde = 0;
            //izpisTimer = "00:00";
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
            bricks[row][col] = 0;
            tocke += 1;
            $("#tocke").html(tocke);
        }
        if (x + dx > WIDTH - r || x + dx < r)
            dx = -dx;
        if (y + dy < r)
            dy = -dy;
        else if (y + dy > HEIGHT - paddleBounce - r) {
            start = false;
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
                console.log("kdi");
                clearInterval(intervalId);
            }
        }
        x += dx;
        y += dy;
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
                    kateri = 128;
                }
                else if (rand >= 25 && rand < 76) {
                    kateri = 64;
                } else {
                    kateri = 0;
                }
                bricks[i][j] = 1;
                rand = Math.floor(Math.random() * 100);
                colors[i][j] = kateri;
            }
        }
    }
    init();
    init_paddle();
    initbricks();
}