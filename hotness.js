(function(window, document) {
    //SUP
    var PIXEL_RATIO = (function() {
        var ctx = document.createElement("canvas").getContext("2d"),
            dpr = window.devicePixelRatio || 1,
            bsr = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1;

        return dpr / bsr;
    })();

    var createHiDPICanvas = function(w, h, ratio) {
        if (!ratio) {
            ratio = PIXEL_RATIO;
        }
        var can = document.createElement("canvas");
        can.width = w * ratio;
        can.height = h * ratio;
        can.style.width = w + "px";
        can.style.height = h + "px";
        can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
        return can;
    }

    var canvas = createHiDPICanvas(window.innerWidth, window.innerHeight);
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var shapes = [];
    window.step = null;

    var width = window.innerWidth;
    var height = window.innerHeight;

    ctx.font = "48px sans-serif";
    ctx.fillText("Move your mouse!", width / 2 - 200, height / 2);

    // Thanks SO K3N!
    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    function filledRect(x, y, width, height, opacity) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.opacity = opacity;
    }

    function randomColor() {
        ctx.fillStyle = 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' +
            Math.floor(Math.random() * 255) + ')';
    }

    filledRect.prototype.draw = function() {
        randomColor();
    }

    function randFilledRect(e) {
        strokeColor();
        ctx.fillRect(e.clientX, e.clientY, Math.floor(Math.random() * 100), Math.floor(Math.random() * 100));
    }

    function randEmptyRect(e) {
        strokeColor();
        ctx.strokeRect(e.clientX, e.clientY, Math.floor(Math.random() * 100), Math.floor(Math.random() * 100));
    }

    function randomShape(e) {
        var options = [randFilledRect, randEmptyRect];
        var randNum = Math.floor(Math.random() * options.length);
        return options[randNum](e);
    }

    function strokeColor() {
        ctx.strokeStyle = 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' +
            Math.floor(Math.random() * 255) + ')';
    }

    function draw(e) {
        var pos = getMousePos(canvas, e);
        posx = pos.x;
        posy = pos.y;

        if (!window.step) {
            window.step = 1;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        ctx.fillStyle = 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' +
            Math.floor(Math.random() * 255) + ')';
        ctx.fillText("Awwwwwwww Yeahhhhhhh!", width / 2 - 275, height / 2);
        randomShape(e);

        requestAnimationFrame(draw);
    }

    document.addEventListener('mousemove', draw);
})(window, document);
