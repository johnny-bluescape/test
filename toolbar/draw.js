window.brushsize = 10;
window.brushcolor = 'rgba(0,0,0,1)';
window.canvashistory = [];

function canvas(){
    var canvas 	= document.getElementById('canvas2'),
    //ctx 	= canvas.getContext('2d'),
    width  	= canvas.parentElement.offsetWidth,
    height 	= canvas.parentElement.offsetHeight;

    canvas.height	= height;
    canvas.width 	= width;
    //canvas.title 	= 'Did You Know You Can Draw Here?';
    canvas.style.cursor = 'crosshair';

    canvas.addEventListener( 'mousedown', sketchHandler, false );
    canvas.addEventListener( 'touchstart', sketchHandler, false );
    canvas.addEventListener( 'touchmove', sketchHandler, false );
    canvas.addEventListener( 'touchend', sketchHandler, false );

    if ( window.navigator.msPointerEnabled ) {
        canvas.addEventListener("MSPointerDown", sketchHandler, false); // Fires for touch, pen, and mouse
    }

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
}

function sketchHandler(e){

    // if ( document.getElementById('rectanglex') || document.getElementById('circlex') || document.getElementById('selectx') || !document.getElementById('drawx')){
    //     return;
    // }
    e.preventDefault();
    e.stopPropagation();
    
    var evt = e.touches ? e.touches[0] : e;
    var canvas = document.getElementById('canvas2');

    if ( e.which  !== 1 && e.which !== 0 ){
        return;
    }

    var ol = 0;//canvas.parentElement.offsetLeft;
    var ot = 0;//canvas.parentElement.offsetTop;


    var scroll = 0;
    var currentElement = canvas;

    do {
        ol += currentElement.offsetLeft;
        ot += currentElement.offsetTop;
        scroll += currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)

    switch( e.type ) {
        case 'mousedown' : case 'touchstart' : case 'MSPointerDown' :
            canvas.dataset.x = evt.pageX - ol;
            canvas.dataset.y = evt.pageY - ot;

            canvas.redo = null;

            window.addEventListener( 'mousemove', sketchHandler );
            window.addEventListener( 'mouseup', sketchHandler );
            if ( window.navigator.msPointerEnabled ) {
                window.addEventListener("MSPointerMove", sketchHandler); // Fires for touch, pen, and mouse
                window.addEventListener("MSPointerUp", sketchHandler); // Fires for touch, pen, and mouse
            }

            var scale = window.devicePixelRatio || 1;

            // var imgdata = ctx.getImageData(0,0,canvas.width,canvas.height);

            // var backingStoreRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;

            // var ratio = scale / backingStoreRatio;

            // var ctx = canvas.getContext('2d');

            // ctx.scale(scale,scale);

            break;
        case 'mousemove' : case 'touchmove' : case 'MSPointerMove' :
            var ctx = canvas.getContext('2d');

            with(ctx) {
                beginPath();
                moveTo(Number(canvas.dataset.x), Number(canvas.dataset.y));
                lineTo(evt.pageX - ol , evt.pageY  - ot);
                lineWidth = brushsize;//20;
                lineCap = 'round';
                lineJoin = 'round';
                strokeStyle = brushcolor;//'rgba(0,0,0,1)';
                stroke();
            }

                canvas.dataset.x = evt.pageX - ol;
                canvas.dataset.y = evt.pageY - ot;

    console.log(canvas.dataset.x, canvas.dataset.y);

            break;
        case 'mouseup' : case 'touchend' : case 'MSPointerUp' :
            var ran = Math.floor(Math.random()*9);
            var array = ['Whoa!','Oh Pretty!','Meow.','Sweet!','Amazing!','Insane!','Radical!','OMG!'];
            window.removeEventListener( 'mousemove', sketchHandler );
            window.removeEventListener( 'mouseup', sketchHandler );
            if (window.navigator.msPointerEnabled) {
                window.removeEventListener("MSPointerMove", sketchHandler); // Fires for touch, pen, and mouse
                window.removeEventListener("MSPointerUp", sketchHandler); // Fires for touch, pen, and mouse
            }
            var imgdata = canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height);
            canvashistory.push(imgdata);

            canvas.title = array[ran];

            break;
        default :
            return false;

    }
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