window.brushsize = BRUSHSIZE = 10;
window.brushcolor = BRUSHCOLOR = 'rgba(0,0,0,1)';
window.canvashistory = [];

function canvassetup(){
    var canvas 	= document.getElementById('canvas2'),
    //ctx 	= canvas.getContext('2d'),
    width  	= canvas.parentElement.offsetWidth,
    height 	= canvas.parentElement.offsetHeight;

    canvas.height	= height;
    canvas.width 	= width;
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

    var backingStoreRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;

    var ratio = scale / backingStoreRatio;

    var oldWidth = canvas.width;
    var oldHeight = canvas.height;

    canvas.width = oldWidth * ratio;
    canvas.height = oldHeight * ratio;

    canvas.style.width = oldWidth + 'px';
    canvas.style.height = oldHeight + 'px';

    context.scale(scale,scale);

    var imgdata = context.getImageData(0,0,canvas.width,canvas.height);

    window.canvashistory.push(imgdata);

    document.body.addEventListener('keydown', keyed);
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

    minimap();
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

    var offset = canvas.offset();
    var ol = offset.x;
    var ot = offset.y;

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

            console.log(t, id2, lines)

            with(ctx) {
                beginPath();
                moveTo(lines[id2].lx, lines[id2].ly);
                lineTo(nx, ny);
                lineWidth = BRUSHSIZE;//20;
                lineCap = 'round';
                lineJoin = 'round';
                strokeStyle = BRUSHCOLOR;//'rgba(0,0,0,1)';
                stroke();
            }

            lines[id2].lx = nx;
            lines[id2].ly = ny;
        }
    }

    function end(e){
        window.removeEventListener( 'touchmove', move );
        window.removeEventListener( 'touchend', end );

        var imgdata = canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height);
        canvashistory.push(imgdata);
    
        console.log(e);

        //var bc = document.getElementById('brush_context');
        
        minimap();
    }

    window.addEventListener( 'touchmove', move );
    window.addEventListener( 'touchend', end );
}

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

    var offset = canvas.offset();
    var ol = offset.x;
    var ot = offset.y;

    var sx = evt.pageX - ol;
    var sy = evt.pageY - ot;

    canvas.redo = null;

    var lx = evt.pageX - ol;
    var ly = evt.pageY - ot;

    var lines = canvas.LINES;

    lines[id] = {lx: lx, ly: ly};

    var bc = document.getElementById('brush_context');

    bc.style.opacity = 0;
    bc.style.pointerEvents = 'none';
    bc.style.transform = 'translateY(6px)';

    function move(e){
        var evt = e.touches ? e.touches[0] : e;
        var ctx = canvas.getContext('2d');

        var id2 = evt.identifier;

        var nx = evt.pageX - ol;
        var ny = evt.pageY - ot;

        with(ctx) {
            beginPath();
            moveTo(lines[id2].lx, lines[id2].ly);
            lineTo(nx, ny);
            lineWidth = BRUSHSIZE;//20;
            lineCap = 'round';
            lineJoin = 'round';
            strokeStyle = BRUSHCOLOR;//'rgba(0,0,0,1)';
            stroke();
        }

        lines[id2].lx = nx;
        lines[id2].ly = ny;
    }


    function end(e){

        window.removeEventListener( 'mousemove', move );
        window.removeEventListener( 'mouseup', end );

        var imgdata = canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height);
        canvashistory.push(imgdata);

        console.log(e);

        var x = e.pageX;
        var y = e.pageY;

        var bc = document.getElementById('brush_context');

        bc.style.left = x - (bc.offsetWidth/2) + 'px';
        bc.style.bottom = window.innerHeight - y - (bc.offsetHeight/2) - 64  + 'px';
        bc.style.opacity = 1;
        bc.style.pointerEvents = 'all';
        bc.style.transform = 'translateY(0)';

        minimap();
    }

    window.addEventListener( 'mousemove', move );
    window.addEventListener( 'mouseup', end );
}

function undo(x){
    var canvas = document.getElementById('canvas2');

    if (!canvashistory.length){
        return;
    }

    if ( !canvas.redo || x ){
        canvas.redo = canvashistory.pop();
        if ( canvashistory.length ){
            canvas.getContext('2d').putImageData( canvashistory[canvashistory.length-1], 0, 0);
        }
    } else if (canvas.redo){
        canvashistory.push(canvas.redo);
        canvas.getContext('2d').putImageData( canvashistory[canvashistory.length - 1], 0, 0);

        canvas.redo = null;
    }
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