(function(window, document) {
  //SUP
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.window.innerHeight;

  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  function draw(e) {
    var pos = getMousePos(canvas, e);
    posx = pos.x;
    posy = pos.y;

    ctx.fillStyle = 'rgb(200,0,0)';
    ctx.fillRect(e.clientX, e.clientY, 5, 5);
    requestAnimationFrame(draw);
  }

  document.addEventListener('mousemove', draw);
})(window, document);