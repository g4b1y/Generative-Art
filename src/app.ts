import { GetRandomInt } from './utils'
import { Simulation } from './simulation'
import { MagicParams } from './isimobjects'

function createDrawCanvas(imageCtx: CanvasRenderingContext2D, width: number, height: number) {
	const updateFrameRate = 60;
	const renderFrameRate = 60;

	// create a new canvas to draw stuff 
	const canvas = document.createElement('canvas');
	if (!canvas) {
		throw new Error('Failed to create canvas'); 
		return; 
	}
	canvas.width = width;
	canvas.height = height;
	canvas.style.verticalAlign = 'top'; 

	// putting the canvas in the center-div 
	const center = document.getElementById('center'); 
	if(!center) {
		throw new Error("unable to create center element"); 
		return; 
	}
	center.appendChild(canvas);

	// creating ctx 
	const ctx = canvas.getContext('2d');
	if (!ctx) {
		throw new Error('Failed to create canvas context'); 
		return; 
	}
	ctx.imageSmoothingEnabled = true;
	ctx.imageSmoothingQuality = 'high';



	const sim = new Simulation(width, height);
	const imageData = imageCtx.getImageData(0, 0, width, height);
	const params = <MagicParams>{
		imageData: imageData,
		phase: 0,
		t: 0,
		d: 0
	};
	setInterval(
		() => { sim.Update(params) },
		1000 / updateFrameRate
	)

	setInterval(
		() => { sim.Draw(ctx) },
		1000 / renderFrameRate
	)
}

function bootstrapper() {
	const width = 400;
	const height = 400;

	const imageCanvas = document.createElement('canvas');
	const center = document.getElementById('center'); 
	if(!center) {
		throw new Error("unable to create center element"); 
		return; 
	}
	center.appendChild(imageCanvas);
	imageCanvas.width = width;
	imageCanvas.height = height;
	imageCanvas.style.verticalAlign = 'top'; 

	const ctx = imageCanvas.getContext('2d');
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
	image.onload = (e) => {
		ctx.drawImage(image, 0, 0, width, height); 
		createDrawCanvas(ctx, width, height);
	}
	const images = ['../img/vg.jpg', 
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