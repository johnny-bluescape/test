window.brushsize = BRUSHSIZE = 10;
window.brushcolor = BRUSHCOLOR = 'rgba(0,0,0,1)';
window.canvashistory = [];

function canvassetup(){
    var canvas 	= document.getElementById('canvas2'),
    //ctx 	= canvas.getContext('2d'),
    width  	= canvas.parentElement.offsetWidth,
    height 	= canvas.parentElement.offsetHeight;


    // var frame = document.createElement('canvas');

    canvas.height = height; // frame.height = 
    canvas.width = width; // = frame.width 
    //canvas.title 	= 'Did You Know You Can Draw Here?';
    canvas.style.cursor = 'crosshair';

    canvas.LINES = {};

    var useCapture = false;
    var supportsPassiveOption = false;
    try {
        var opts = Object.defineProperty({}, 'passive', {
            get: function() {
                supportsPassiveOption = true;
            }
        });
        window.addEventListener('test', null, opts);
    } catch (e) {}

    var passive = supportsPassiveOption ? { passive : false } : useCapture;

    canvas.addEventListener( 'mousedown', sketchHandlerM, passive );
    canvas.addEventListener( 'touchstart', sketchHandler, passive );
    // canvas.addEventListener( 'touchmove', sketchHandler, passive );
    // canvas.addEventListener( 'touchend', sketchHandler, passive);

    // if ( window.navigator.msPointerEnabled ) {
    //     canvas.addEventListener("MSPointerDown", sketchHandler, passive); // Fires for touch, pen, and mouse
    // }

    //canvas.addEventListener('mousewheel', canvasscroll);

    var context = canvas.getContext('2d');

    var scale = window.devicePixelRatio || 1;

    if (!context){
        return;
    }

    var backingStoreRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;

    var ratio = scale / backingStoreRatio;

    var oldWidth = canvas.width;
    var oldHeight = canvas.height;

    canvas.width = oldWidth * ratio; //frame.width = 
    canvas.height = oldHeight * ratio; //frame.height = 

    canvas.style.width = oldWidth + 'px';//  = frame.style.width
    canvas.style.height = oldHeight + 'px'; //  = frame.style.height


    context.scale(scale, scale);
    // frame.getContext('2d').scale(scale, scale);

    // var imgdata = context.getImageData(0,0,canvas.width,canvas.height);

    // window.canvashistory.push(imgdata);

    // frame.id = 'frame';

    document.body.addEventListener('keydown', keyed);

    // document.body.appendChild(frame);
}

function resize2(e){
    var canvas 	= document.getElementById('canvas2'),
            //ctx 	= canvas.getContext('2d'),
            width  	= canvas.parentElement.offsetWidth,
    height 	= canvas.parentElement.offsetHeight,
    ctx = canvas.getContext('2d');


    var scale = window.devicePixelRatio || 1;

    var imgdata = ctx.getImageData(0,0,canvas.width,canvas.height);

    var backingStoreRatio = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;

    var ratio = scale / backingStoreRatio;

    ctx.scale(scale,scale);

    canvas.height 	= height * ratio;
    canvas.width 	= width * ratio;

    canvas.style.height = height + 'px';
    canvas.style.width = width + 'px';
    

    console.log(width,height);

    ctx.putImageData(imgdata, 0, 0);

    ctx.scale(scale,scale);

    //minimap();
}

function sketchHandler(e){
    e.preventDefault();
    e.stopPropagation();
    
    var evt = e.touches ? e.touches[0] : e;
    var canvas = document.getElementById('canvas2');

    console.log(e.touches);

    console.log(evt);

    if ( e.which == 3 ){
        return;
    }

    blurall();

    if ( canvas.timer ){
        clearTimeout(canvas.timer);
        canvas.timer = null;
    }

    var offset = canvas.offset();
    var ol = offset.x;
    var ot = offset.y;

    var cx = Number(canvas.dataset.x) || 0;
    var cy = Number(canvas.dataset.y) || 0;

    canvas.redo = null;

    var lines = canvas.LINES;

    var touches = e.touches;

    for(var i=0;i<touches.length;i++){

        var t = touches[i];
        var sx = t.pageX - ol;
        var sy = t.pageY - ot;

    
        var lx = t.pageX - ol;
        var ly = t.pageY - ot;

        var id = t.identifier;

        console.log(id + ' TOUCH  ID');

        lines[id] = {lx: lx, ly: ly};
    }

    var path = [];

    function move(e){
        var evt = e.touches ? e.touches[0] : e;
        var touches = e.touches;
        var ctx = canvas.getContext('2d');

        console.log(touches);

        for(var i=0;i<touches.length;i++){

            var t = touches[i];

            var id2 = t.identifier;

            var nx = t.pageX - ol;
            var ny = t.pageY - ot;

            console.log(nx,ny);

            console.log(t, id2, lines);

            with(ctx) {
                beginPath();
                moveTo(lines[id2].lx, lines[id2].ly);
                lineTo(nx, ny);
                lineWidth = BRUSHSIZE;//20;
                lineCap = 'round';
                lineJoin = 'round';
                strokeStyle = BRUSHCOLOR;//'rgba(0,0,0,1)';
                stroke();

                // path.push({mx:lines[id2].lx, my: lines[id2].ly, lx: nx, ly: ny});
                path.push({mx:lines[id2].lx - cx, my: lines[id2].ly - cy, lx: nx - cx, ly: ny - cy});
            }

            lines[id2].lx = nx;
            lines[id2].ly = ny;
        }
    }

    function end(e){
        window.removeEventListener( 'touchmove', move );
        window.removeEventListener( 'touchend', end );

        // var imgdata = canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height);
        // canvashistory.push(imgdata);
    
        console.log(e);

        //var bc = document.getElementById('brush_context');
        
        //minimap();

        //canvas.timer = setTimeout(flattencanvas, 500);

        // document.documentElement.classList.add('flatten');

        PATHDATA.push({paths: path, color: BRUSHCOLOR, size: BRUSHSIZE, scale: ZOOMLEVEL });

        minimap();
    }

    window.addEventListener( 'touchmove', move );
    window.addEventListener( 'touchend', end );
}

PATHDATA = [];

function sketchHandlerM(e){
    e.preventDefault();
    e.stopPropagation();
    
    var evt = e;
    var canvas = document.getElementById('canvas2');

    console.log(evt);
    
    var id = evt.identifier;

    if ( e.which == 3 ){
        return;
    }

    if ( canvas.timer ){
        clearTimeout(canvas.timer);
        canvas.timer = null;
    }

    blurall();

    var offset = canvas.offset();
    var ol = offset.x;
    var ot = offset.y;

    var sx = evt.pageX - ol;
    var sy = evt.pageY - ot;

    canvas.redo = null;

    var cx = Number(canvas.dataset.x) || 0;
    var cy = Number(canvas.dataset.y) || 0;

    var lx = evt.pageX - ol;
    var ly = evt.pageY - ot;

    var lines = canvas.LINES;

    lines[id] = {lx: lx, ly: ly};

    var bc = document.getElementById('brush_context');

    bc.style.opacity = 0;
    bc.style.pointerEvents = 'none';
    bc.style.transform = 'translateY(6px)';

    var ctx = canvas.getContext('2d');

    with(ctx) {
        beginPath();
        lineWidth = BRUSHSIZE;//20;
        lineCap = 'round';
        lineJoin = 'round';
        strokeStyle = BRUSHCOLOR;//'rgba(0,0,0,1)';
    }

    var path = [];

    function move(e){
        var evt = e.touches ? e.touches[0] : e;
        var ctx = canvas.getContext('2d');

        var id2 = evt.identifier;

        var nx = evt.pageX - ol;
        var ny = evt.pageY - ot;

        with(ctx) {
            moveTo(lines[id2].lx, lines[id2].ly);
            lineTo(nx, ny);
            console.log(lines[id2].lx, lines[id2].ly, nx, ny);

            path.push({mx:lines[id2].lx - cx, my: lines[id2].ly - cy, lx: nx - cx, ly: ny - cy});
            stroke();
        }

        lines[id2].lx = nx;
        lines[id2].ly = ny;
    }

    function end(e){

        window.removeEventListener( 'mousemove', move );
        window.removeEventListener( 'mouseup', end );

        PATHDATA.push({paths: path, color: BRUSHCOLOR, size: BRUSHSIZE, scale: ZOOMLEVEL });

        minimap();

        // var imgdata = canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height);
        // canvashistory.push(imgdata);

        // console.log(e);

        // var x = e.pageX;
        // var y = e.pageY;

        // var bc = document.getElementById('brush_context');

        // bc.style.left = x - (bc.offsetWidth/2) + 'px';
        // bc.style.bottom = window.innerHeight - y - (bc.offsetHeight/2) - 64  + 'px';
        // bc.style.opacity = 1;
        // bc.style.pointerEvents = 'all';
        // bc.style.transform = 'translateY(0)';

        //minimap();

        //canvas.timer = setTimeout(flattencanvas, 500);
        // document.documentElement.classList.add('flatten');
    }

    window.addEventListener( 'mousemove', move );
    window.addEventListener( 'mouseup', end );
}

function drawpaths(){

    var data = PATHDATA;
    var canvas = document.getElementById('canvas2');
    var ctx = canvas.getContext('2d');

    var x = Number(canvas.dataset.x) || 0;
    var y = Number(canvas.dataset.y) || 0;
    

    // var canvas2 = document.getElementById('frame');
    // var ctx2 = canvas2.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx2.clearRect(0, 0, canvas.width, canvas.height);

    var w = ctx.canvas.clientWidth;
    var h = ctx.canvas.clientHeight;

    for(var i=0;i<data.length;i++){
        var path = data[i];

        var points = path.paths;
        var color = path.color;
        var size = Number(path.size);
        var scale = Number(path.scale);

        scale = (ZOOMLEVEL / scale);

        ctx.save();

        ctx.translate((w-(w*scale))/2 + x, (h-(h*scale))/2 + y);
        ctx.scale(scale, scale);


        with(ctx) {
            beginPath();
            lineWidth = size;
            lineCap = 'round';
            lineJoin = 'round';
            strokeStyle = color;
        }

        for(var j=0;j<points.length;j++){
            var point = points[j];

            var x1 = point.mx;
            var y1 = point.my;
            var x2 = point.lx;
            var y2 = point.ly;

            with(ctx) {
                moveTo(x1, y1);
                lineTo(x2, y2);
            }
        }

        ctx.stroke();
        ctx.closePath();

        
        //var imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height);

        
        ctx.restore();

        
        //ctx2.putImageData(imgdata, 0, 0, (w-(w*scale))/2, (h-(h*scale))/2, canvas.width, canvas.height);
        //ctx2.drawImage(canvas, (w-(w*scale))/2, (h-(h*scale))/2, w, h);

        // console.log(ctx2, ctx)

        

        //ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function undo(x){
    // var canvas = document.getElementById('canvas2');

    // if (!canvashistory.length){
    //     return;
    // }

    // if ( !canvas.redo || x ){
    //     canvas.redo = canvashistory.pop();
    //     if ( canvashistory.length ){
    //         canvas.getContext('2d').putImageData( canvashistory[canvashistory.length-1], 0, 0);
    //     }
    // } else if (canvas.redo){
    //     canvashistory.push(canvas.redo);
    //     canvas.getContext('2d').putImageData( canvashistory[canvashistory.length - 1], 0, 0);

    //     canvas.redo = null;
    // }
}

function keyed(e){
    var key = e.keyCode;
    var ctrl = e.metaKey || e.ctrlKey;

    if ( key == 90 && ctrl && !e.altKey ){
        undo();
    } else if ( key == 90 && e.altKey ){
        undo(true);
    }
}

// LAYERS = [];
// IMGDATA = [];

// function writeimgdata(){
//     var imgs = IMGDATA;
//     console.log(IMGDATA);
//     var canvas = document.getElementById('frame');
//     var context = canvas.getContext('2d');

//     context.clearRect(0,0,canvas.width,canvas.height);

//     for(var i=0;i<imgs.length;i++){
//         var img = imgs[i];
        
//         context.putImageData(img.data, 0, 0);
//     }
// }

// function flattencanvas(x){
//     var canvas = document.getElementById('canvas2');
//     var context = canvas.getContext('2d');

//     var img = new Image();

//     var zscale = 100/ZOOMLEVEL;


   
//     var imgdata = context.getImageData(0, 0, canvas.width, canvas.height);
//     // ctx.putImageData(imgData, 10, 70);
    
//     IMGDATA.push({ data: imgdata, z: ZOOMLEVEL });


//     // var d = context.getImageData(0, 0, canvas.width, canvas.height);

//     // LAYERS.push({data: d, z: ZOOMLEVEL});

//     // fuck();

//     // return;

//     // img.style.position = 'absolute';
//     // img.style.width = '100%';
//     // img.style.top = 0;
//     // img.style.left = 0;

//     // // img.style.transform = 'scale(' + ZOOMLEVEL/100 + ')';
//     // img.style.transform = 'scale(' + zscale + ')';

//     // img.dataset.scale = zscale;
//     // img.dataset.z = ZOOMLEVEL;

//     // img.className = 'clayer newimg';

//     // img.style.opacity = 0;

//     img.onload = function(){

        
//         // context.scale(x, x);
//         // context.drawImage(imageObject,0,0);
        
//         // this.style.opacity = 1;

//         //mergeimgs();

//         //mergeimgs2();

//         // var w = this.naturalWidth || this.width;
//         // var h = this.naturalHeight || this.height;

//         LAYERS.push({
//             src: canvas.toDataURL(), z: ZOOMLEVEL, image: this
//         });

//         context.clearRect(0,0,canvas.width,canvas.height);

//         drawlayers2();

//         minimap();
//     }

//     img.src = canvas.toDataURL();

//     // document.getElementById('canvaslayers').appendChild(img);
// }

// function fuck(){
//     var canvas = document.getElementById('canvas2');
//     var context = canvas.getContext('2d');
//     var cw = canvas.width;
//     var ch = canvas.height;
    
//     context.clearRect(0, 0, cw, ch);

//     var imgs = LAYERS;
//     console.log(LAYERS)
//     for(var i=0;i<imgs.length;i++){
//         var img = imgs[i];
//         console.log(img.data);
//         context.save();
//         context.scale(.5,.5);
//         context.putImageData(img.data, 0, 0);
//         context.restore();
//     }
// }

// function drawlayers2(){

//     // var og = document.getElementsByClassName('clayer');

//     var canvas = document.getElementById('canvas2');
//     var frame = document.getElementById('frame');
//     var context = canvas.getContext('2d');
//     var ftx = frame.getContext('2d');
//     var cw = canvas.width;
//     var ch = canvas.height;
    
//     context.clearRect(0, 0, cw, ch);

//     ftx.clearRect(0, 0, cw, ch);

//     var imgs = LAYERS;
    
//     for(var i=0;i<imgs.length;i++){

//         console.log(imgs[i]);
//         var img = imgs[i];
//         //var m = new Image();

//         //m.scale = img.z;

//         var _this = img.image;

//             var w = _this.naturalWidth || _this.width;
//             var h = _this.naturalHeight || _this.height;
            
//             var s = 1;//ZOOMLEVEL / 100;//1;//this.z/100;
//             var p = 1/window.devicePixelRatio || 1;

//             var scale = img.z;

//             console.log(scale, w, h, ZOOMLEVEL)
//             if ( scale !== ZOOMLEVEL ){
//                 var diff = ZOOMLEVEL / scale;

//                 s = diff;
//             }
    
//             w = w * s ;
//             h = h * s ;
    
//             var x = ( cw - w ) / 2;
//             var y = ( ch - h ) / 2;

//             // console.log('---lOOADKEAD', x, y, w, h, cw, ch)
//             //context.drawImage(this, x, y, w, h);

//             // var x = cw *p /2;
//             // var y = ch * p /2;

//             //ftx.save();
//             //ftx.translate(x, y)
//             //ftx.scale( p*s, p*s);
//             ftx.drawImage(_this, x*p, y*p, w*p, h*p);//-x, -y);
//             //ftx.restore();
        

       
//     }

//     // og.remove();
// }

// function drawlayers(){

//     var og = document.getElementsByClassName('clayer');

//     var canvas = document.getElementById('canvas2');
//     var frame = document.getElementById('frame');
//     var context = canvas.getContext('2d');
//     var ftx = frame.getContext('2d');
//     var cw = canvas.width;
//     var ch = canvas.height;
    
//     context.clearRect(0, 0, cw, ch);

//     ftx.clearRect(0, 0, cw, ch);

//     var imgs = LAYERS;
    
//     for(var i=0;i<imgs.length;i++){

//         console.log(imgs[i]);
//         var img = imgs[i];
//         var m = new Image();

//         m.scale = img.z;

//         m.onload = function(){
//             var w = this.naturalWidth || this.width;
//             var h = this.naturalHeight || this.height;
            
//             var s = 1;//ZOOMLEVEL / 100;//1;//this.z/100;
//             var p = 1/window.devicePixelRatio || 1;

//             var scale = this.scale;

//             console.log(scale, ZOOMLEVEL)
//             if ( scale !== ZOOMLEVEL ){
//                 var diff = ZOOMLEVEL / scale;

//                 s = diff;
//             }
    
//             w = w * s ;
//             h = h * s ;
    
//             var x = ( cw - w ) / 2;
//             var y = ( ch - h ) / 2;

//             // console.log('---lOOADKEAD', x, y, w, h, cw, ch)
//             //context.drawImage(this, x, y, w, h);

//             // var x = cw *p /2;
//             // var y = ch * p /2;

//             //ftx.save();
//             //ftx.translate(x, y)
//             //ftx.scale( p*s, p*s);
//             ftx.drawImage(this, x*p, y*p, w*p, h*p);//-x, -y);
//             //ftx.restore();
//         }

//         m.src = img.src;
//     }

//     og.remove();
// }


// function mergeimgs2(){
//     var cl = document.getElementById('canvaslayers');
//     var imgs = cl.getElementsByClassName('clayer');
//     var canvas = document.createElement('canvas');
//     var context = canvas.getContext('2d');

//     var cw = 0;
//     var ch = 0;
//     var ms = 0;

//     for(var i=0;i<imgs.length;i++){
//         var m = imgs[i];
        
//         var w = m.naturalWidth || m.width;
//         var h = m.naturalHeight || m.height;
        
//         var s = m.dataset.scale || 1;

//         w = w ;//* s;
//         h = h ;//* s;

//         if ( w > cw ){
//             cw = w;
//         }

//         if ( h > ch ){
//             ch = h;
//         }

//         if ( s > ms ){
//             ms = s;
//         }

//         console.log(w, h, m.offsetLeft, m.offsetTop, m.offset().x, m.offset().y, s);
//     }

//     canvas.width = cw;
//     canvas.height = ch;

//     console.log(cw, ch);

//     for(var i=0;i<imgs.length;i++){
//         var m = imgs[i];
        
//         var w = m.naturalWidth || m.width;
//         var h = m.naturalHeight || m.height;
        
//         var s = m.dataset.scale || 1;

//         if ( m.classList.contains('newimg')){
//             s = ZOOMLEVEL / 100;
//         }

//         w = w / s;
//         h = h / s;

//         var ol = (cw - w ) / 2;
//         var ot = (ch - h ) / 2;
        

//         context.drawImage(m, ol, ot, w, h);
//     }

//     imgs.remove();

//     var img = new Image();

//     img.style.position = 'absolute';
//     img.style.width = '100%';
//     img.style.top = 0;
//     img.style.left = 0;

//     //img.style.transform = 'scale(' + ms + ')';
//     //img.dataset.scale = ms;

//     img.className = 'clayer ugh22';

//     img.onload = function(){

//         //context.clearRect(0,0, canvas.width, canvas.height);
//         // context.scale(x, x);
//         // context.drawImage(imageObject,0,0);
        
//         //mergeimgs();

//         console.log('----MERGE2---');
//     }

//     img.src = canvas.toDataURL();

//     document.getElementById('canvaslayers').appendChild(img);

//     minimap();
// }

// function mergeimgs(){
//     var canvas = document.createElement('canvas');
//     var context = canvas.getContext('2d');

//     var cw = 0;
//     var ch = 0;
    
//     // canvas.width = 0;
//     // canvas.height = 0;

//     //canvas.scale = 2;
//     //context.scale(.5,.5);
    
//     // context.globalAlpha = 1.0;
//     // context.drawImage(img1, 0, 0);
//     // context.globalAlpha = 0.5; //Remove if pngs have alpha
//     // context.drawImage(img2, 0, 0);

//     var cl = document.getElementById('canvaslayers');
//     var lz = cl.dataset.z || 1;

//     // cl.dataset.z = 1;
//     // cl.style.transform = 'none';

//     var imgs = cl.getElementsByClassName('clayer');
//     var zscale = ZOOMLEVEL/100;

//     var p = window.devicePixelRatio || 1;

//     for(var i=0;i<imgs.length;i++){
//         var m = imgs[i];
        
//         var w = m.naturalWidth || m.width;
//         var h = m.naturalHeight || m.height;

//         //var s = Number(m.dataset.scale) || 1;

//         w = w;// / p;// * s;//* (1/zscale);
//         h = h;// / p;// * s;//* (1/zscale);

//         if ( w > cw ){
//             cw = w;
//         }

//         if ( h > ch ){
//             ch = h;
//         }
//     }


//     canvas.width = cw;
//     canvas.height = ch;


//     console.log(cw + ' ugh ' + ch);

//     for(var i=0;i<imgs.length;i++){
//         var m = imgs[i];

//         var nw = m.naturalWidth || m.width;
//         var nh = m.naturalHeight || m.height;

//         var s = Number(m.dataset.scale) || 1;
//         console.log(i, imgs.length, m);
//         if ( i === imgs.length-1 || m.classList.contains('newimg') ){
//             lz = ZOOMLEVEL/100;
//         }
        
//         nw = nw * s / ((zscale)) * zscale;//* (1/zscale);// * ( (1/zscale) - 1);
//         nh = nh * s /  ( (zscale)) * zscale;//* (1/zscale);// * ((1/zscale) - 1);

//         var x = (cw - nw) / 2;
//         var y = (ch - nh) / 2;

//         context.drawImage(m, x, y, nw, nh);
//     }


//     imgs.remove();

//     var img = new Image();

//     img.style.position = 'absolute';
//     img.style.width = '100%';
//     img.style.top = 0;
//     img.style.left = 0;

//     //img.style.transform = 'scale(' + (100/ZOOMLEVEL) + ')';

//     img.className = 'clayer ugh22';

//     img.onload = function(){

//         //context.clearRect(0,0, canvas.width, canvas.height);
//         // context.scale(x, x);
//         // context.drawImage(imageObject,0,0);
        
//         //mergeimgs();

//         console.log('----MERGE---');
//     }

//     img.src = canvas.toDataURL();

//     document.getElementById('canvaslayers').appendChild(img);

//     minimap();
// }

// function canvaszoom2(x){
//     var canvas = document.getElementById('canvas2');
//     var context = canvas.getContext('2d');

//     var imageObject = new Image();

//     imageObject.onload = function(){

//         context.clearRect(0,0,canvas.width,canvas.height);
//         context.scale(x, x);
//         context.drawImage(imageObject,0,0);

//     }

//     imageObject.src = canvas.toDataURL();
// }

// function canvaszoom(x){

//     var canvas = document.getElementById('canvas2');
//     var context = canvas.getContext('2d');

//     var d = context.getImageData(0, 0, canvas.width, canvas.height);

//     d = scaleImageData(d, x);
    
//     context.clearRect(0, 0, canvas.width, canvas.height);

//     context.putImageData(d, canvas.width/4, canvas.height/4);
// }

// function scaleImageData(imageData, scale){
//     var newCanvas = document.createElement('canvas');
//     newCanvas.width = imageData.width;
//     newCanvas.height = imageData.height;


//     newCanvas.getContext("2d").putImageData(imageData, 0, 0);

//     // Second canvas, for scaling
//     var scaleCanvas = document.createElement('canvas');
//     scaleCanvas.width = imageData.width;
//     scaleCanvas.height = imageData.height;

//     var scaleCtx = scaleCanvas.getContext("2d");

//     scaleCtx.scale(scale, scale);
//     scaleCtx.drawImage(newCanvas, 0, 0);

//     var scaledImageData =  scaleCtx.getImageData(0, 0, scaleCanvas.width, scaleCanvas.height);

//     return scaledImageData;
// }

// function canvasscale(scale, translatePos){
//     var canvas = document.getElementById("canvas2");
//     var context = canvas.getContext("2d");
//     context.scale(3, 3);
//     var img = context.getImageData(0, 0, canvas.width, canvas.height);
    
//     // clear canvas
//     context.clearRect(0, 0, canvas.width, canvas.height);
 
// 	context.save();
// 	//context.translate(translatePos.x, translatePos.y);
// 	context.scale(scale, scale);
	
// 	context.putImageData(img, 20, 20); // destination rectangle;
  
    
// 	context.restore();
// }