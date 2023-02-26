import { Simulation } from './simulation';
function createDrawCanvas(imageCtx, width, height) {
    var updateFrameRate = 60;
    var renderFrameRate = 60;
    // create a new canvas to draw stuff 
    var canvas = document.createElement('canvas');
    if (!canvas) {
        throw new Error('Failed to create canvas');
        return;
    }
    canvas.width = width;
    canvas.height = height;
    canvas.style.verticalAlign = 'top';
    // putting the canvas in the center-div 
    var center = document.getElementById('center');
    if (!center) {
        throw new Error("unable to create center element");
        return;
    }
    center.appendChild(canvas);
    // creating ctx 
    var ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Failed to create canvas context');
        return;
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    var sim = new Simulation(width, height);
    var imageData = imageCtx.getImageData(0, 0, width, height);
    var params = {
        imageData: imageData,
        phase: 0,
        t: 0,
        d: 0
    };
    setInterval(function () { sim.Update(params); }, 1000 / updateFrameRate);
    setInterval(function () { sim.Draw(ctx); }, 1000 / renderFrameRate);
}
function bootstrapper() {
    var width = 400;
    var height = 400;
    var imageCanvas = document.createElement('canvas');
    var center = document.getElementById('center');
    if (!center) {
        throw new Error("unable to create center element");
        return;
    }
    center.appendChild(imageCanvas);
    imageCanvas.width = width;
    imageCanvas.height = height;
    imageCanvas.style.verticalAlign = 'top';
    var ctx = imageCanvas.getContext('2d');
    if (!ctx) {
        throw new Error('Failed to create canvas context');
        return;
    }
    // create an image element to load the jpg on to
    var image = new window.Image();
    if (!image) {
        throw new Error('Failed to create image element');
        return;
    }
    image.crossOrigin = 'Anonymous';
    image.onload = function (e) {
        ctx.drawImage(image, 0, 0, width, height);
        createDrawCanvas(ctx, width, height);
    };
    var images = ['../img/vg.jpg',
        '../img/eiffel.jpg',
        '../img/elon.jpg',
        '../img/gpe.jpg',
        '../img/hokusai.jpg',
        '../img/joker.jpg',
        '../img/scarjo.jpg',
        '../img/lion.jpg',
        '../img/dali.jpg',
        '../img/Bird.jpg',
        '../img/eiffelTower.jpg',
        '../img/fox.jpg',
        '../img/frozenBubble.jpg',
        '../img/girlAndBoy.jpg',
        '../img/Insect.jpg',
        '../img/monkey.jpg'];
    //image.src = images[GetRandomInt(0, images.length)]; 
    image.src = "https://picsum.photos/400";
}
bootstrapper();
