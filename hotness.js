(function(window, document) {
    //SUP
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    window.step = null;

    canvas.width = window.innerWidth;
    canvas.height = window.window.innerHeight;

    ctx.font = "48px sans-serif";
    ctx.fillText("Move your mouse!", canvas.width / 2 - 200, canvas.height / 2);

    // Thanks SO K3N!
    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    function randomFilledRect(e) {
        randomColor();
        ctx.fillRect(e.clientX, e.clientY, Math.floor(Math.random() * 75), Math.floor(Math.random() * 75));
    }

    function randEmptyRect(e) {
        strokeColor();
        ctx.strokeRect(e.clientX, e.clientY, Math.floor(Math.random() * 100), Math.floor(Math.random() * 100));
    }

    function randomShape(e) {
        var options = [randomFilledRect, randEmptyRect];
        var randNum = Math.floor(Math.random() * options.length);
        options[randNum](e);
    }

    function strokeColor() {
        ctx.strokeStyle = 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' +
            Math.floor(Math.random() * 255) + ')';
    }

    function randomColor() {
        ctx.fillStyle = 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' +
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
        ctx.fillText("Awwwwwwww Yeahhhhhhh!", canvas.width / 2 - 275, canvas.height / 2);
        randomShape(e);

        requestAnimationFrame(draw);
    }

    document.addEventListener('mousemove', draw);
})(window, document);
