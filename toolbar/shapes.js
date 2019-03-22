function rectanglemove(e){
    e.preventDefault();
    e.stopPropagation();

    if ( document.documentElement.id == 'rectanglex' || document.documentElement.id == 'circlex'  || document.documentElement.id == 'linex' ){
      return;
    }

    var old = document.getElementsByClassName('rectangle focused');
    old.removeclass('focused')

    this.classList.add('focused');

    // if ( this.classList.contains('paperdiv') ){
    //   this.classList.add('selecteditem');
    // }

    var evt = e.touches ? e.touches[0] : e;

    var sx = evt.pageX;
    var sy = evt.pageY;
    var rec = this;

    var ox = parseFloat(this.style.left) || 0;
    var oy = parseFloat(this.style.top) || 0;

    console.log(ox, oy);

    function move(e){
      var evt = e.touches ? e.touches[0] : e;

      var x = evt.pageX;
      var y = evt.pageY;
      var nx = x - sx;
      var ny = y - sy;

      x = nx + ox;
      y = ny + oy;

      rec.style.top = y + 'px';
      rec.style.left = x + 'px';

    }

    function end(e){
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', end);

      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', end);

      //rect.classList.remove('drawing');
      //rect.classList.add('focused');
    }

    window.addEventListener('touchmove', move);
    window.addEventListener('touchend', end);

    window.addEventListener('mouseup', end);
    window.addEventListener('mousemove', move);
  }

  function rectangleresize(e){
    e.preventDefault();
    e.stopPropagation();
    
    console.log('fff');

    var rect = this.getparent('rectangle');

    var sx = 0;//rect.offsetLeft;
    var sy = -50;//rect.offsetTop;
    var scrolly = 0;
    console.log(e.target);

    var meow = rect;

    while(meow){
      sx += meow.offsetLeft;
      sy += meow.offsetTop;
      scrolly += meow.scrollTop;

      meow = meow.offsetParent;
    }

    //sx -= 100;
    sy += 52;//navbar height, lazy

    function move(e){
      e.preventDefault();

      var evt = e.touches ? e.touches[0] : e;

      var x = evt.pageX;
      var y = evt.pageY;
      var nx = x - sx;
      var ny = y - sy;

      var w = Math.abs(nx);
      var h = Math.abs(ny);


      var tx = nx < 0 ? nx : 0;
      var ty = ny < 0 ? ny : 0;

      rect.style.width = w + 'px';
      rect.style.height = h + 'px';
      rect.style.transform = 'translate(' + tx + 'px, ' + ty + 'px)';

      var cy = y < sy ? y : sy;
      var cx = x < sx ? x : sx;

    }

    function end(e){
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', end);

      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', end);

      //rect.classList.remove('drawing');
      //rect.classList.add('focused');
    }

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);

    window.addEventListener('touchmove', move);
    window.addEventListener('touchend', end);

    return 'holdup';
  }

  function circlex(e){
    rectanglex.call(this, e, true);
  }

  function linex(e){
    rectanglex.call(this, e, false, true);
  }

  function fack(e){
    var p = this.getparent('panelcanvas');
    if ( !p ){
      return;
    }
    var r = document.getElementsByClassName('rectangle focused');
    while(r[0]){
      r[0].classList.remove('focused');
    }
    this.classList.add('focused');

    //ave
  }

  function rectanglex(e, round, line){
    console.log('xxxx')

    console.log(e.target);

    var tb = e.target.getparent('toolbar');
    var pan = e.target.getparent('panel');

    if ( tb || pan ){
        return;
    }



    e.preventDefault();
    e.stopPropagation();

    var shift = e.shiftKey;

    var evt = e.touches ? e.touches[0] : e;

    var target = e.target;
    var sx = evt.pageX;
    var sy = evt.pageY;
    var _this = document.getElementById('canvas2');
    var paper = document.body;//document.getElementsByClassName('paper')[0];

    var ff = document.getElementsByClassName('focused');

    while(ff[0]){
      ff[0].classList.remove('focused');
    }

    // document.body.classList.remove('showcontextpanel2');

    // if ( !target.getparent('canvasb')   ){
    //   return;
    // }

    var moved = 0;

    var scrolly = 0;
    var ot = 0;//paper.offsetTop;
    var ol = 0;//paper.offsetLeft;
    console.log(e.target);

    var meow = paper;

    while(meow){
      scrolly += meow.scrollTop;

      ot += meow.offsetTop;
      ol += meow.offsetLeft;


      meow = meow.offsetParent;
    }

    var color = document.getElementsByClassName('fillswatch')[0];
    color =  typeof window.shapecolor == 'string' ? window.shapecolor : 'rgb(255, 59, 48)';//color.parentElement.getElementsByClassName('togglewrap')[0].classList.contains('on') ? window.getComputedStyle(color).backgroundColor : 'transparent';

    var bordercolor = document.getElementsByClassName('borderswatch')[0];
    bordercolor = 'white';//bordercolor.parentElement.getElementsByClassName('togglewrap')[0].classList.contains('on') ? window.getComputedStyle(bordercolor).backgroundColor : 'transparent';

    var border = document.getElementsByClassName('borderwidth')[0];
    border = 0;//border && border.parentNode.getElementsByClassName('togglewrap on')[0] ? border.value || 0 : 0;

    var rect = document.createElement('div');
    rect.className = 'rectangle drawing focused';
    rect.style.position = 'absolute';
    rect.style.top = sy + scrolly - ot + 'px';
    rect.style.left = sx - ol + 'px';
    rect.style.backgroundColor = color;
    rect.style.borderColor = bordercolor;
    rect.style.borderWidth = border + 'px';
    rect.style.borderStyle = 'solid';
    rect.style.backgroundClip = 'padding-box';
    rect.style.boxSizing = 'border-box';
    rect.style.zIndex = 99999999;

    var ln = 'Rectangle'

    if ( round ){
      rect.style.borderRadius = '50%';
      ln = 'Ellipse';
      rect.className += ' ellipse';
    }

    for(var i=0;i<4;i++){
      var d = document.createElement('div');
      d.className = 'resizehandle';


      if (border){
        if (i === 0) {
          d.style.margin = '-' + border + 'px 0 0 -' + border + 'px';
        } else if ( i === 1 ){
          d.style.margin = '-' + border + 'px -' + border + 'px 0 0';
        } else if ( i == 2 ){
          d.style.margin = '0 0 -' + border + 'px  -' + border + 'px';
        } else {
          d.style.margin = '0 -' + border + 'px  -' + border + 'px 0';
        }
      }

      rect.appendChild(d);
    }

    var f = document.getElementsByClassName('rectangle focused');
    while(f[0]){
      f[0].classList.remove('focused');

      //document.body.classList.remove('showcontextpanel2');
    }
    //this.appendChild(rect);

    function move(e){
      e.preventDefault();
      if ( !moved ){
        moved = true;
        paper.appendChild(rect);
        //addlayer({}, ln);
      }

      var shift = e.shiftKey;

      var evt = e.touches ? e.touches[0] : e;

      var x = evt.pageX;
      var y = evt.pageY;
      var nx = x - sx;
      var ny = y - sy;

      var w = Math.abs(nx);
      var h = Math.abs(ny);

      var tx = nx < 0 ? nx : 0;
      var ty = ny < 0 ? ny : 0;

      if ( line ){
        if ( w > h ){
          h = 2;
        } else {
          w = 2;

        }
      } else if(shift) {
        w = w < h ? w : h;
        h = h < w ? h : w;
      }

      rect.style.width = w + 'px';
      rect.style.height = h + 'px';
      rect.style.transform = 'translate(' + tx + 'px, ' + ty + 'px)';

      var cy = y < sy ? y : sy;
      var cx = x < sx ? x : sx;

    }

    function end(e){
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', end);

      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', end);

      rect.classList.remove('drawing');
      //rect.classList.add('focused');

      if ( !moved && target.className == 'rectangle' ){
        target.classList.add('focused');

        //resetcontextpanel();
        //document.body.classList.add('showcontextpanel2')
      } else {
        rect.click();

        document.getElementById('select_tool').click();
      }
    }

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);

    window.addEventListener('touchmove', move);
    window.addEventListener('touchend', end);

    return 'holdup';
  }