SHAPEBORDERCOLOR = 'rgba(0,0,0,0)';
SHAPECOLOR = 'rgb(255, 58, 48)';
BORDERWIDTH = 0;

CANVASBORDERCOLOR = 'rgba(255,255,255,.2)';
CANVASCOLOR = 'rgba(0,0,0,0)';

function rectanglemove(e){

    console.log('mnove');
    e.preventDefault();
    e.stopPropagation();

    // if ( document.documentElement.id == 'rectanglex' || document.documentElement.id == 'circlex'  || document.documentElement.id == 'linex' ){
    //   return;
    // }

    var cc = document.body.classList;

    if ( cc.contains('type_tool') ){
      return;
    }

    blurelm.call(this, e);

    // var old = document.getElementsByClassName('rectangle current');
    // old.removeclass('current')

    this.classList.add('current');

    setboundingbox.call(this, e);

    // if ( this.classList.contains('paperdiv') ){
    //   this.classList.add('selecteditem');
    // }

    var evt = e.touches ? e.touches[0] : e;

    var zscale = 100 / ZOOMLEVEL;

    var sx = evt.pageX * zscale;
    var sy = evt.pageY * zscale;
    var rec = this;

    var ox = parseFloat(this.style.left) || 0;
    var oy = parseFloat(this.style.top) || 0;

    console.log(ox, oy, sx, sy);

    var moved = false;

    var box = this.bounds;

    var top = window.pageYOffset || document.documentElement.scrollTop;
    

    function move(e){
      
      var evt = e.touches ? e.touches[0] : e;

      var x = evt.pageX* zscale;
      var y = evt.pageY* zscale;
      var nx = x - sx;
      var ny = y - sy;

      x = nx + ox;
      y = ny + oy;

      rec.style.top = y  + 'px';
      rec.style.left = x + 'px';

      // if ( box ){
      //   box.style.top = y + 'px';
      //   box.style.left = x + 'px';
      // }

      if ( !moved && Math.abs(nx) > 4 || Math.abs(ny) > 4 ){
        moved = true;

        hidecontext();
      }

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

      if ( rec.classList.contains('canvasboard')){
        var ys = rec.offset().y;

        if ( (ys-top) < 36 ){
          rec.classList.add('neartop');
        } else {
          rec.classList.remove('neartop');
        }
      }

      setboundingposition();
    }

    function end(e){
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', end);

      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', end);

      //rect.classList.remove('drawing');
      //rect.classList.add('current');

      minimap();

      var layer = document.getElementById('layers').offset();
      var lx = layer.x;
      var ly = layer.y;

      setcontextpanel.call(rec);

      var recs = document.getElementsByClassName('layeritem current');

      for(var i=0;i<recs.length;i++){
        var r = recs[i];
        if ( r == rec ){
          //continue;
        }
        // var ol = r.offset().x;
        // var ot = r.offset().y;

        var ol = (Number(r.dataset.left) || 0) * 1;
        var ot = (Number(r.dataset.top) || 0) * 1;

        r.dataset.left = 0;
        r.dataset.top = 0;

        if ( rec === r ){
          ol = ol * ZOOMLEVEL;
          ot = ot * ZOOMLEVEL;
        }

        r.style.left = r.offsetLeft + ol + 'px';
        r.style.top = r.offsetTop + ot + 'px';

        r.style.transform = 'translate(0,0)';

        // if ( r.bounds ){
        //   r.bounds.style.left = ol + 'px';
        //   r.bounds.style.top = ot +  'px';

        //   r.bounds.style.transform = 'translate(0,0)';
        // }

        setboundingposition();

      }

      if ( !moved ){
        rec.click();
      }
    }

    window.addEventListener('touchmove', move);
    window.addEventListener('touchend', end);

    window.addEventListener('mouseup', end);
    window.addEventListener('mousemove', move);
  }

  function bhandle(e){

    rectangleresize.call(this,e);
  }

  function rectangleresize(e){
    e.preventDefault();
    e.stopPropagation();
    
    console.log('fff');

    var evt = e.touches ? e.touches[0] : e;

    var box = this.getparent('boundingbox');

    var rect = box ? box.object[0] : this.getparent('rectangle');

//     var multi = false;
// alert(typeof rect);
//     if ( typeof rect == 'array' ){
//       multi = true;

//       //rect = document.getElementsByClassName('boundingbox multi')[0];
//       rect = rect[0];
//     }

    var zscale = 100 / ZOOMLEVEL;

    var w = rect.offsetWidth;
    var h = rect.offsetHeight;

    console.log(w,h);

    var cx = 0;
    var cy = 0;

    var sx = evt.pageX * zscale;
    var sy = evt.pageY * zscale;

    // var ot = rect.offsetTop;
    // var ol = rect.offsetLeft;

    var ol = rect.offset().x  * zscale;
    var ot = rect.offset().y  * zscale;

    var re = w + ol;
    var be = h + ot;

    var ratio = w/h;

    var handle = 1;

    var hs = box ? box.getElementsByClassName('bhandle') : rect.getElementsByClassName('resizehandle');

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


    hidecontext();

    var moved = false;

    function move(e){
        e.preventDefault();

        if ( !moved ){
          moved = true;

          if ( rect.classList.contains('textwrap') ){
            rect.classList.add('resized');
          }
        }
        

        var evt = e.touches ? e.touches[0] : e;

        var shift = e.shiftKey;

        var x = evt.pageX * zscale;
        var y = evt.pageY * zscale;
        
        
        var nx = x - sx;
        var ny = y - sy;

        // if ( shift ){
        //   if ( nx <= ny ){
        //     ny = nx;
        //   } else {
        //     nx = ny;
        //   }
        // }

        var nw = Math.abs(w + nx);
        var nh = Math.abs(h + ny);

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
            nh = h - ny;
            if ( ny < 0 ){
                ty = ny;
            } else {
                ty = Math.abs(ny);
            }

            if ( ya > be ){
                nh = ya - be;
                ty = ty - nh;
            }
        }
        
        if ( handle === 1 || handle === 3 ){
            nw = w - nx;
            if ( nx >= 0 ){
                tx = nx;
            }

            if ( xa > re ){
                nw = xa - re;
                tx = tx - nw;
            }
        }

        console.log(tx,ty, nw, nh, nx, ny);

        if ( shift ){ // Half works ugh

          var w2 = nw;
          var h2 = nh;
          if ( nx >= ny ){
            w2 = (nh / h) * w;
          } else {
            h2 = (nw / w) * h;
          }

          console.log(tx, ty, 'tx ty');

          ty = ty * (h2/nh);
          tx = tx * (w2/nw);

          console.log(tx, ty, 'tx ty 2');

          nw = w2;
          nh = h2;
        }

        if( handle > 4 ){
          nw = w;//Math.abs(w + nx);
          nh = h;//Math.abs(h + ny);

          tx = 0;
          ty = 0;

          if ( handle == 5 ){
            nh = Math.abs(h - ny);
            ty = ny;

            if ( ya > be ){
              nh = ya - be;
              ty = ty - nh;
            }
          }

          if ( handle == 6 ){
            nw = Math.abs(w + nx);

            if ( xa < ol ) {
              nw = ol - xa;
              tx = -nw;
            }
          }

          if ( handle == 7 ){
            nh = Math.abs(h + ny);
  
            if ( ya < ot ) {
                nh = ot - ya;
                ty = -nh;
            }
            
          }

          if ( handle == 8 ){
            nw = Math.abs(w - nx);
            tx = nx;
            
            if ( xa > re ){
              nw = xa - re;
              tx = tx - nw;
            }
          }


        }

        if ( nh <= 72 ){
          rect.classList.add('minheight');
        } else {
          rect.classList.remove('minheight');
        }

        if ( nw <= 72 ){
          rect.classList.add('minwidth');
        } else {
          rect.classList.remove('minwidth');
        }

        rect.style.width = nw + 'px';
        rect.style.height = nh + 'px';
        rect.style.transform = 'translate(' + tx + 'px, ' + ty + 'px)';

        // if ( box ){
        //   box.style.width = nw + 'px';
        //   box.style.height = nh + 'px';
        //   box.style.transform = 'translate(' + tx + 'px, ' + ty + 'px)';
        // }

        cx = tx;
        cy = ty;

        contextfollow.call(rect);

        setboundingposition();
    }

    function end(e){
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', end);

      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', end);

      rect.style.transform = 'translate(0,0)';

      var tx2 = rect.offsetLeft + cx;
      var ty2 = rect.offsetTop + cy;

      rect.style.top =  ty2 + 'px';
      rect.style.left = tx2 + 'px';

      // if ( box ){
      //   box.style.transform = 'translate(0,0)';

      //   box.style.top = ty2 + 'px';
      //   box.style.left = tx2 + 'px';
      // }

      console.log(rect.offsetLeft, rect.offsetTop);
      console.log('ughsuehfku')

      setcontextpanel.call(rect);

      setboundingposition();

      minimap();
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

  function insertrect(){
    var color = document.getElementsByClassName('fillswatch')[0];
    var ac = document.getElementById('shapefill');
    color =  typeof window.shapecolor == 'string' ? window.shapecolor : window.getComputedStyle(ac).backgroundColor;//'rgb(255, 59, 48)';//color.parentElement.getElementsByClassName('togglewrap')[0].classList.contains('on') ? window.getComputedStyle(color).backgroundColor : 'transparent';

    var rect = document.createElement('div');
    rect.className = 'rectangle current layeritem';
    rect.style.position = 'absolute';
    rect.style.top = (window.innerHeight / 2) - 60 + 'px';
    rect.style.left = (window.innerWidth / 2) - 60 - 200 + 'px';
    rect.style.backgroundColor = color;
    rect.style.backgroundClip = 'padding-box';
    rect.style.boxSizing = 'border-box';
    rect.style.zIndex = 1337;

    rect.style.width = '120px';
    rect.style.height = '120px';

    if ( document.body.classList.contains('circlex') ){
      rect.style.borderRadius = '50%';
    }

    // for(var i=0;i<4;i++){
    //   var d = document.createElement('div');
    //   d.className = 'resizehandle';

    //   rect.appendChild(d);
    // }

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
    document.getElementById('layers').appendChild(rect);

    document.getElementById('select_tool').click();


    ops.dataset.w = ops.offsetWidth;


    setcontextpanel.call(rect);
  }

  function rectanglex(e, round, line){
    console.log('xxxx')

    console.log(e.target);

    var tb = e.target.getparent('toolbar');
    var pan = e.target.getparent('panel');
    var tw = e.target.getparent('tweaks');

    var mw = e.target.getparent('menuwrap');
    var cx = e.target.getparent('contextpanel');

    if ( tb || pan || tw || cx || mw ){
        return;
    }

    e.preventDefault();
    e.stopPropagation();

    blurelm.call(this, e);

    var shift = e.shiftKey;

    var evt = e.touches ? e.touches[0] : e;

    var zscale = 100 / ZOOMLEVEL;

    var target = e.target;
    var sx = evt.pageX * zscale;
    var sy = evt.pageY * zscale;
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

    
    var ol = paper.offset().x * zscale;
    var ot = paper.offset().y * zscale;

    console.log(paper.offset());

    // var color = document.getElementsByClassName('fillswatch')[0];
    // var ac = document.getElementById('shapefill');
    // color =  typeof window.shapecolor == 'string' ? window.shapecolor : window.getComputedStyle(ac).backgroundColor;//'rgb(255, 59, 48)';//color.parentElement.getElementsByClassName('togglewrap')[0].classList.contains('on') ? window.getComputedStyle(color).backgroundColor : 'transparent';

    // var bordercolor = document.getElementsByClassName('borderswatch')[0];
    // bordercolor = 'transparent';//bordercolor.parentElement.getElementsByClassName('togglewrap')[0].classList.contains('on') ? window.getComputedStyle(bordercolor).backgroundColor : 'transparent';

    // var border = document.getElementsByClassName('borderwidth')[0];
    // border = 0;//border && border.parentNode.getElementsByClassName('togglewrap on')[0] ? border.value || 0 : 0;

    var rect = document.createElement('div');
    rect.className = 'rectangle drawing current layeritem';
    rect.style.position = 'absolute';
    rect.style.top = sy - ot + 'px';
    rect.style.left = sx - ol + 'px';
    rect.style.backgroundColor = SHAPECOLOR;
    rect.style.borderColor = SHAPEBORDERCOLOR;
    rect.style.borderWidth = BORDERWIDTH + 'px';
    rect.style.borderStyle = 'solid';
    rect.style.backgroundClip = 'padding-box';
    rect.style.boxSizing = 'border-box';
    rect.style.zIndex = 1337;

    if ( document.body.classList.contains('circlex') ){
      rect.style.borderRadius = '50%';
    }

    if ( round ){
      rect.style.borderRadius = '50%';
      rect.className += ' ellipse';
    }

    if ( document.body.classList.contains('canvas_tool') ){
      rect.style.background = CANVASCOLOR;
      rect.style.borderWidth = '2px';
      rect.style.borderColor = CANVASBORDERCOLOR;//'rgba(255,255,255,.2)';//'#7754A1';
      //rect.style.borderRadius = '8px';

      rect.className += ' canvasboard';

      var label = document.createElement('div');
      label.className = 'canvaslabel';
      label.appendChild(document.createTextNode('Canvas Label'));
    }

    // for(var i=0;i<4;i++){
    //   var d = document.createElement('div');
    //   d.className = 'resizehandle';

    //   if (border){
    //     if (i === 0) {
    //       d.style.margin = '-' + border + 'px 0 0 -' + border + 'px';
    //     } else if ( i === 1 ){
    //       d.style.margin = '-' + border + 'px -' + border + 'px 0 0';
    //     } else if ( i == 2 ){
    //       d.style.margin = '0 0 -' + border + 'px  -' + border + 'px';
    //     } else {
    //       d.style.margin = '0 -' + border + 'px  -' + border + 'px 0';
    //     }
    //   }

    //   rect.appendChild(d);
    // }

    if ( label ){
      rect.appendChild(label);
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

    //rect.className += ' current';

    document.body.appendChild(ops);

    ops.dataset.w = ops.offsetWidth;

    var tx = 0;
    var ty = 0;

    function move(e){
      //e.preventDefault();

      var shift = e.shiftKey;

      var evt = e.touches ? e.touches[0] : e;

      var x = evt.pageX * zscale;
      var y = evt.pageY * zscale;
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

      tx = nx < 0 ? nx : 0;
      ty = ny < 0 ? ny : 0;

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
      minimap();
      

      if ( !moved ){
        rect.remove();

        if ( target.classList.contains('rectangle') ){
          target.classList.add('current');




          //target.click();


          //setcontextpanel.call(target);
          
          //rectanglemove.call(target, e);
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

        setboundingbox.call(rect, e);
      }

      rect.style.transform = 'translate(0,0)';

      rect.style.top = rect.offsetTop + ty + 'px';
      rect.style.left = rect.offsetLeft + tx + 'px';


      setcontextpanel.call(rect, ops);

      var com = window.getComputedStyle(rect);

      var con = document.getElementsByClassName('contextpanel visible')[0];
      var col = con.getElementsByClassName('shape2fill')[0];

      var bg = com.backgroundColor;

      
      var bc = con.getElementsByClassName('border')[0];

      bc.style.borderColor = com.borderColor;


      if ( bg == 'rgba(0, 0, 0, 0)' || bg == 'transparent' ){
        // bg = 'linear-gradient(135deg, transparent 48%, #3c3b3d 48%, #3c3b3d 52%, transparent 52%)';
        bg = 'linear-gradient(to right, var(--null) 3px, transparent 3px) 12.5px';

        col.style.boxShadow = 'inset 0 0 0 3px var(--null)';
        col.style.transform = 'rotate(45deg)';
      } else {
        col.style.boxShadow = 'inset 0 0 0 1px hsla(0, 0%, 100%, 0.175)';
        col.style.transform = 'rotate(0deg)';
      }

      if ( com.borderColor == 'rgba(0, 0, 0, 0)' || com.borderColor == 'transparent' ){
          bc.style.borderColor = 'rgba(155, 155, 155, 0.15)';
      }

      col.style.background = bg;
    }

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);

    window.addEventListener('touchmove', move);
    window.addEventListener('touchend', end);

  }


  function setboundingbox(e){

    console.log('UGH', this.bounds);
    if ( !!this.bounds && document.body.contains(this.bounds) ){
      return;
    }

    var off = this.offset();

    var x = off.x;
    var y = off.y;
    var w = off.w;
    var h = off.h;

    var b = document.createElement('div');

    b.className = 'boundingbox';

    b.object = [this];

    this.bounds = b;

    b.style.left = x + 'px';
    b.style.top = y + 'px';
    b.style.position = 'absolute';
    b.style.width = w + 'px';
    b.style.height = h + 'px';
    b.style.zIndex = 2147483640;

    if ( h <= 72 ){
      b.classList.add('minheight');
    } else {
      b.classList.remove('minheight');
    }

    if ( w <= 72 ){
      b.classList.add('minwidth');
    } else {
      b.classList.remove('minwidth');
    }

    if ( this.classList.contains('canvasboard') ){
      b.style.boxShadow = 'none';
    }


    for(var i=0;i<8;i++){
      var a = document.createElement('div');
      a.className = 'bhandle';

      b.appendChild(a);
    }

    console.log('-----BB----')
    document.body.appendChild(b);
  }

  function setboundingposition(e){
    var b = document.getElementsByClassName('boundingbox')[0];

      if ( !b ){
        return;
      }

      var s = document.getElementsByClassName('layeritem current');
  
      var tx = null;
      var ty = null;
      var tw = null;
      var th = null;
  
      b.object = [];
    
      for(var i=0;i<s.length;i++){
        var r = s[i];
        var off = r.offset();
  
        var x = off.x;
        var y = off.y;
        var w = off.w;
        var h = off.h;
  
        var x2 = x + w;
        var y2 = y + h;
  
        if ( !tx || x < tx){
          tx = x;
        }
  
        if ( !ty || y < ty){
          ty = y;
        }
  
        if ( !tw || x2 > tw ){
          tw = x2;
        }
  
        if ( !th || y2 > th){
          th = y2;
        }
  
        r.bounds = b;
  
        b.object.push(r);
      }

      var nw = tw - tx;
      var nh = th - ty;
    
      b.style.left = tx + 'px';
      b.style.top = ty + 'px';
      b.style.position = 'absolute';
      b.style.width = nw + 'px';
      b.style.height = nh + 'px';
      b.style.zIndex = 2147483641;

      if ( nh <= 72 ){
        b.classList.add('minheight');
      } else {
        b.classList.remove('minheight');
      }

      if ( nw <= 72 ){
        b.classList.add('minwidth');
      } else {
        b.classList.remove('minwidth');
      }
  }

  function setmultibounds(e){
      var s = this;
  
      var t = this[0];

      var b = document.getElementsByClassName('multibox')[0];
      

      if ( !b ){
        var b = document.createElement('div');
        b.className = 'boundingbox multibox';

        for(var i=0;i<4;i++){
          var a = document.createElement('div');
          a.className = 'bhandle';
    
          b.appendChild(a);
        }

        var o = document.getElementsByClassName('boundingbox');
        o.remove();

        document.body.appendChild(b);
      }
  
      var tx = null;
      var ty = null;
      var tw = null;
      var th = null;
  
      b.object = [];
    
      for(var i=0;i<s.length;i++){
        var r = s[i];
        console.log(r);
        var off = r.offset();
  
        var x = off.x;
        var y = off.y;
        var w = off.w;
        var h = off.h;
  
        var x2 = x + w;
        var y2 = y + h;
  
        if ( !tx || x < tx){
          tx = x;
        }
  
        if ( !ty || y < ty){
          ty = y;
        }
  
        if ( !tw || x2 > tw ){
          tw = x2;
        }
  
        if ( !th || y2 > th){
          th = y2;
        }
  
        r.bounds = b;
  
        b.object.push(r);
      }    
  
      console.log(tx,ty,tw,th,'MEOW')
  
      b.style.left = tx + 'px';
      b.style.top = ty + 'px';
      b.style.position = 'absolute';
      b.style.width = tw - tx + 'px';
      b.style.height = th - ty + 'px';
      b.style.zIndex = 999999999999999;
    
  }

  function multitouch(e){
    var touches = e.touches;
    var xy = [];
    
    for(var i=0;i<touches.length;i++){
      var ev = touches[i];
      var sx = ev.pageX;
      var sy = ev.pageY;
      xy.append({x: sx, y: sy, id: ev.identifier});
    }

    var x1 = xy[0].x;
    var x2 = xy[1].x;

    var y1 = xy[0].y;
    var y2 = xy[1].y;

    var sd = Math.sqrt(Math.pow((x2−x1),2) + Math.pow((y2−y1), 2));

    var panning = false;
    var pinching = false;

    function move(e){
      var touches = e.touches;

      var xy2 = [];

      for(var i=0;i<touches.length;i++){
        var ev = touches[i];
        var x = ev.pageX;
        var y = ev.pageY;
        xy2.append({x: x, y: y, id: ev.identifier});
      }

      var x1b = xy2[0].x;
      var x2b = xy2[1].x;

      var y1b = xy2[0].y;
      var y2b = xy2[1].y;

      var d = Math.sqrt(Math.pow((x2−x1),2) + Math.pow((y2−y1), 2));

      var xd = (x1 - x1b)  - (x2 - x2b);
      var yd = (y1 - y1b)  - (y2 - y2b);

      if ( !panning && !pinching ){
        if ( Math.abs(sd - d) > (Math.abs(xd) || Math.abs(yd)) ){
          console.log('pinch')
        } else{
          console.log('pan')
        }
      }
    }

    function end(e){
      // window.removeEventListener('mousemove', move);
      // window.removeEventListener('mouseup', end);

      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', end);

      
    }
    
    window.addEventListener('touchmove', move);
    window.addEventListener('touchend', end);

    // window.addEventListener('mouseup', end);
    // window.addEventListener('mousemove', move);
  }

  function marquee(e){
    if ( e.which == 3|| e.target != document.body ){
        return;
    }
    e = e.touches ? e.touches[0] : e;
    var sx = e.pageX;
    var sy = e.pageY;

    //var sh = window.scrollTop || document.body.scrollTop || document.scrollTop;

    var just = this;
    var marq = document.createElement('div');

    marq.style.border = '1px solid #1473e6';
    marq.style.position = 'absolute';
    marq.style.top = sy +'px';
    marq.style.left = sx + 'px';
    marq.style.zIndex = 1337;
    marq.style.background = 'rgba(20, 115, 230,.15)';

    var ev = e;

    //document.body.appendChild(marq);
    var moved = false;

    if ( e.touches.length > 2 ){
      console.log(e.touches.length);
      multitouch.call(this, e);


      return;
    }

    function move(e){
        e.preventDefault();

        if ( e.touches.length > 2 ){
          console.log(e.touches.length);

          return;
        }

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
              elm.classList.add('current');
            }
        }

        var boxes = document.getElementsByClassName('layeritem current');

        if ( !boxes[0] ){
          return;
        } else if ( boxes.length === 1){
          setboundingbox.call(boxes[0], e);
        } else {
          setmultibounds.call(boxes, e);
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