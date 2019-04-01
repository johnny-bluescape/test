function rectanglemove(e){
    e.preventDefault();
    e.stopPropagation();

    // if ( document.documentElement.id == 'rectanglex' || document.documentElement.id == 'circlex'  || document.documentElement.id == 'linex' ){
    //   return;
    // }

    blurelm.call(this, e);

    // var old = document.getElementsByClassName('rectangle current');
    // old.removeclass('current')

    this.classList.add('current');

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
      hidecontext();
      var evt = e.touches ? e.touches[0] : e;

      var x = evt.pageX;
      var y = evt.pageY;
      var nx = x - sx;
      var ny = y - sy;

      x = nx + ox;
      y = ny + oy;

      rec.style.top = y + 'px';
      rec.style.left = x + 'px';

      contextfollow.call(rec);

      var recs = document.getElementsByClassName('layeritem current');

      for(var i=0;i<recs.length;i++){
        var r = recs[i];
        if ( r == rec ){
          continue;
        }

        r.dataset.left = nx;
        r.dataset.top = ny;

        r.style.transform = 'translate(' + nx + 'px,' + ny + 'px)';
      }
    }

    function end(e){
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', end);

      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', end);

      //rect.classList.remove('drawing');
      //rect.classList.add('current');

      setcontextpanel.call(rec);

      var recs = document.getElementsByClassName('layeritem current');

      for(var i=0;i<recs.length;i++){
        var r = recs[i];
        if ( r == rec ){
          //continue;
        }
        var ol = r.offset().x;
        var ot = r.offset().y;

        r.style.left = ol + 'px';
        r.style.top = ot +  'px';

        r.style.transform = 'translate(0,0)';

      }
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

    var evt = e.touches ? e.touches[0] : e;

    var rect = this.getparent('rectangle');

    var w = rect.offsetWidth;
    var h = rect.offsetHeight;

    console.log(w,h);

    var cx = 0;
    var cy = 0;

    var sx = evt.pageX;
    var sy = evt.pageY;

    // var ot = rect.offsetTop;
    // var ol = rect.offsetLeft;

    var ol = rect.offset().x;
    var ot = rect.offset().y;

    var re = w + ol;
    var be = h + ot;

    var handle = 1;

    var hs = rect.getElementsByClassName('resizehandle');

    for(var i=0;i<hs.length;i++){
        var a = hs[i];

        if ( a === this ){
            handle = i + 1;
            break;
        }
    }

    var a1 = (sx - ol);
    var b1 = (sx - (ol + w));

    var offx = Math.abs(a1) < Math.abs(b1) ? a1 : b1;

    console.log(a1,b1, offx)


    var a2 = (sy - ot);
    var b2 = (sy - (ot + h));
    var offy = Math.abs(a2) < Math.abs(b2) ? a2 : b2;

    //var offx = sx - Math.min(Math.max(sx, ol), ol + w);
    //var offy = sy - Math.min(Math.max(sy, ot), ot + h);


    function move(e){
        e.preventDefault();

        var evt = e.touches ? e.touches[0] : e;

        var x = evt.pageX;
        var y = evt.pageY;
        var nx = x - sx;
        var ny = y - sy;

        var nw = w + nx;
        var nh = h + ny;

        var tx = 0;//nx < 0 ? sx : 0;
        var ty = 0;//ny < 0 ? sy : 0;

        var xa = x - offx;
        var ya = y - offy;

        if ( xa < ol ) {
            nw = ol - xa;
            tx = -nw;
        }

        if ( ya < ot ) {
            nh = ot - ya;
            ty = -nh;
        }

        if ( handle === 1 || handle === 2 ){
            if ( ny < 0 ){
                nh = h - ny;
                ty = ny;
            } else {
                nh = h + sy - y;
                ty = Math.abs(ny);
            }

            if ( ya > be ){
                nh = ya - be;
                ty = ty - nh;
            }
        }
        
        if ( handle === 1 || handle === 3 ){
            if ( nx < 0 ){
                nw = w + sx - x;
            } else {
                nw = w - nx;
                tx = nx;
            }

            if ( xa > re ){
                nw = xa - re;
                tx = tx - nw;
            }
        }

        console.log(tx,ty, nw, nh, nx, ny);

        rect.style.width = nw + 'px';
        rect.style.height = nh + 'px';
        rect.style.transform = 'translate(' + tx + 'px, ' + ty + 'px)';

        cx = tx;
        cy = ty;

        contextfollow.call(rect);
    }

    function end(e){
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', end);

      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', end);

      rect.style.transform = 'translate(0,0)';

      rect.style.top = rect.offsetTop + cy + 'px';
      rect.style.left = rect.offsetLeft + cx + 'px';

      console.log(rect.offsetLeft, rect.offsetTop);
      console.log('ughsuehfku')

      setcontextpanel.call(rect);

    }

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);

    window.addEventListener('touchmove', move);
    window.addEventListener('touchend', end);
  }

  function circlex(e){
    rectanglex.call(this, e, true);
  }

  function linex(e){
    rectanglex.call(this, e, false, true);
  }

  function ffocus(e){
    var p = this.getparent('panel');
    var t = this.getparent('toolbar');
    if ( p || t ){
      return;
    }
    var r = document.getElementsByClassName('rectangle current');
    while(r[0]){
      r[0].classList.remove('current');
    }
    this.classList.add('current');

    var cid = this.dataset.context;
    document.getElementById(cid).classList.add('visible');
  }

  function rectanglex(e, round, line){
    console.log('xxxx')

    console.log(e.target);

    var tb = e.target.getparent('toolbar');
    var pan = e.target.getparent('panel');

    if ( tb || pan ){
        return;
    }

    blurelm.call(this, e);

    e.preventDefault();
    e.stopPropagation();

    var shift = e.shiftKey;

    var evt = e.touches ? e.touches[0] : e;

    var target = e.target;
    var sx = evt.pageX;
    var sy = evt.pageY;
    var _this = document.getElementById('canvas2');
    var paper = document.getElementById('layers') || document.body;//document.getElementsByClassName('paper')[0];

    var ff = document.getElementsByClassName('current');

    while(ff[0]){
      ff[0].classList.remove('current');
    }

    // document.body.classList.remove('showcontextpanel2');

    // if ( !target.getparent('canvasb')   ){
    //   return;
    // }

    var moved = 0;

    var scrolly = 0;//window.pageYOffset;
    console.log(e.target);

    
    var ol = paper.offset().x;
    var ot = paper.offset().y;

    console.log(paper.offset());

    var color = document.getElementsByClassName('fillswatch')[0];
    var ac = document.getElementById('shapefill');
    color =  typeof window.shapecolor == 'string' ? window.shapecolor : window.getComputedStyle(ac).backgroundColor;//'rgb(255, 59, 48)';//color.parentElement.getElementsByClassName('togglewrap')[0].classList.contains('on') ? window.getComputedStyle(color).backgroundColor : 'transparent';

    var bordercolor = document.getElementsByClassName('borderswatch')[0];
    bordercolor = 'white';//bordercolor.parentElement.getElementsByClassName('togglewrap')[0].classList.contains('on') ? window.getComputedStyle(bordercolor).backgroundColor : 'transparent';

    var border = document.getElementsByClassName('borderwidth')[0];
    border = 0;//border && border.parentNode.getElementsByClassName('togglewrap on')[0] ? border.value || 0 : 0;

    var rect = document.createElement('div');
    rect.className = 'rectangle drawing current layeritem';
    rect.style.position = 'absolute';
    rect.style.top = sy + scrolly - ot + 'px';
    rect.style.left = sx - ol + 'px';
    rect.style.backgroundColor = color;
    rect.style.borderColor = bordercolor;
    rect.style.borderWidth = border + 'px';
    rect.style.borderStyle = 'solid';
    rect.style.backgroundClip = 'padding-box';
    rect.style.boxSizing = 'border-box';
    rect.style.zIndex = 1337;

    var ln = 'Rectangle';

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

    var f = document.getElementsByClassName('rectangle current');
    while(f[0]){
      f[0].classList.remove('current');

      //document.body.classList.remove('showcontextpanel2');
    }
    //this.appendChild(rect);

    var ops = document.getElementById('shape_context').cloneNode(true);
    //ops.removeAttribute('id');

    var cid = 's' + Date.now() + '-' + Math.floor(Math.random()*1000);

    ops.id = cid;
    rect.dataset.context = cid;
    
    rect.id = cid + 'rect';

    document.body.appendChild(ops);

    function move(e){
      e.preventDefault();

      var shift = e.shiftKey;

      var evt = e.touches ? e.touches[0] : e;

      var x = evt.pageX;
      var y = evt.pageY;
      var nx = x - sx;
      var ny = y - sy;

      if ( !moved ){
        if ( Math.abs(nx) > 4 && Math.abs(ny) > 4 ){
          moved = true;
          paper.appendChild(rect);
          //addlayer({}, ln);

          hidecontext();
        }
        return;
      }

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
      //rect.classList.add('current');

      if ( !moved ){
        rect.remove();

        if ( target.className == 'rectangle' ){
          target.classList.add('current');

          //target.click();

          setcontextpanel.call(target);
        }


        return;
      
        
        // target.classList.add('current');

        // var cid = target.dataset.context;

        // document.getElementById(cid).classList.add('visible');

        //resetcontextpanel();
        //document.body.classList.add('showcontextpanel2')
      } else {
        //rect.click();
        rect.classList.add('current');

        document.getElementById('select_tool').click();
      }

      setcontextpanel.call(rect, ops);
    }

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);

    window.addEventListener('touchmove', move);
    window.addEventListener('touchend', end);

  }

  function marquee(e){
    if ( e.which != 1 ){
        return;
    }
    e = e.touches ? e.touches[0] : e;
    var sx = e.pageX;
    var sy = e.pageY;

    var sh = window.scrollTop || document.body.scrollTop || document.scrollTop;

    var just = this;
    var marq = document.createElement('div');

    marq.style.border = '1px solid #1473e6';
    marq.style.position = 'absolute';
    marq.style.top = sy +'px';
    marq.style.left = sx + 'px';
    marq.style.zIndex = 1337;
    marq.style.background = 'rgba(20, 115, 230,.15)';

    //document.body.appendChild(marq);
    var moved = false;

    function move(e){
        e.preventDefault();

        e = e.touches ? e.touches[0] : e;

        var x = e.pageX;
        var y = e.pageY;
        var nx = x - sx;
        var ny = y - sy;

        if ( !moved ){
          if ( Math.abs(nx) < 4 && Math.abs(ny) < 4 ){
            return;
          }
          moved = true;
          document.body.appendChild(marq);
          hidecontext();
        }

        var w = Math.abs(nx);
        var h = Math.abs(ny);

        marq.style.width = w + 'px';
        marq.style.height = h + 'px';

        var tx = nx < 0 ? nx : 0;
        var ty = ny < 0 ? ny : 0;

        marq.style.transform = 'translate(' + tx + 'px, ' + ty + 'px)';


        var coords = marq.getBoundingClientRect();
        var ml = coords.left;
        //var mr = coords.right;
        //var mb = coords.bottom;
        var mt = coords.top;
        var mh = coords.height;
        var mw = coords.width;

        var elms = just.getElementsByClassName('layeritem');//'image'


        for(var i=0;i<elms.length;i++){
            var elm = elms[i];
            // var ol = elm.offsetLeft + elm.parentNode.offsetLeft + elm.parentNode.parentNode.offsetLeft  + Number(elm.dataset.x);
            // var ot = elm.parentNode.offsetTop + Number(elm.dataset.y) + 52;
            var bounds = elm.getBoundingClientRect();
            var ol = bounds.left;
            var ot = bounds.top;
            //var ob = bounds.bottom;
            //var or = bounds.right;
            // var ew = elm.offsetWidth;
            // var eh = elm.offsetHeight;
            var oh = bounds.height;
            var ow = bounds.width;

                var x1 = ml;
                var x2 = ml + mw;
                var y1 = mt;
                var y2 = mt + mh;

                var ox1 = ol;
                var ox2 = ol + ow;
                var oy1 = ot;
                var oy2 = ot + oh;

            if ( (y2 < oy1 ) || (y1 > oy2) || (x2 < ox1) || (x1 > ox2) ){
              elm.classList.remove('current')
            } else {
              elm.classList.add('current')
            }
        }
    }
    function end(e){
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', end);

      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', end);

        if ( moved ){
          marq.parentNode.removeChild(marq);
        }
    }
    
    window.addEventListener('touchmove', move);
    window.addEventListener('touchend', end);

    window.addEventListener('mouseup', end);
    window.addEventListener('mousemove', move);
}