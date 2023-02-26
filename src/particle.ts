import { GetRandomFloat, GetRandomInt, FromPolar, ToLuma, Clamp } from './utils'
import { ISimObject, MagicParams } from './isimobjects'
import { ParticleCount } from './sim-constants';

// Particle Constants
const MaxParticleSize = 4 // add a range slider
const MinParticleSize = 1 
////////////////////////////////////

function rgbToHex(r: number, g: number, b: number) {
	return '#' + [r, g, b].map( x => {
		const hex = x.toString(16); 
		return hex.length === 1 ? '0' + hex: hex; 
	}).join(''); 
}

export class Particle implements ISimObject {
	x = 0; y = 0; // location of this particle
	px = 0; py = 0; // previous location 

	speed = 0; theta = 0 // describes the velocity
	radius = MinParticleSize // size of the particle
	ttl = 500 // how much time left to live
	lifetime = 500 // how long this particle will live

	alpha = 1.0
	color = 'black'

	constructor(private w: number, private h: number, private palette: string[]) {
		this.reset()
	}

	reset() {
		this.x = 0; // add a button for starting particles 
		this.y = 0;
		this.py = this.x; // previous location 
		this.px = this.y; 

		this.speed = GetRandomFloat(0, 3.0)

		this.theta = GetRandomFloat(0, 2 * Math.PI)

		this.radius = GetRandomFloat(0, 5); 

		this.color = 'black'
		if (GetRandomFloat(0, 1) > 0.1) {
			this.color = this.palette[GetRandomInt(1, this.palette.length)]
		}

		this.ttl = this.lifetime = GetRandomInt(50, 100)
	}

	imageComplementLuma(imageData: ImageData): number {
		const p = Math.floor(this.x) + Math.floor(this.y) * imageData.width
		// ImageData contains RGBA values
		const i = Math.floor(p * 4)
		const r = imageData.data[i + 0]
		const g = imageData.data[i + 1]
		const b = imageData.data[i + 2]

		const luma = ToLuma(r, g, b) // 0 -> 255 ; luma is higher for lighter pixel
		const ln = 1 - luma / 255.0 // complement; higher ln means darker
		return ln; 
	}

	imagePixel(imageData: ImageData): string {
		const p = Math.floor(this.x) + Math.floor(this.y) * imageData.width; 
		// ImageData contains RGBA values
		const i = Math.floor(p * 4)
		const r = imageData.data[i + 0]
		const g = imageData.data[i + 1]
		const b = imageData.data[i + 2]
		return rgbToHex(r, g, b); 
	}

	Update(params: MagicParams) {
		// compute new values
		const k = params.t; 
		const theta = this.theta; 
		const r = (params.index + 1) / ParticleCount; 
		this.px = this.x; 
		this.py = this.y; 
		this.x = Math.atan(k * theta) * Math.cos(theta) * r * this.w + Math.sin(this.px) + this.w /2 ;
		this.y = Math.cos(k * theta) * Math.sin(theta) * r * this.h + Math.cos(this.py) + this.h / 2 ; 
		
		this.x = this.x > this.w ? 0 : this.x;
		this.y = this.y > this.h ? 0 : this.y; 

		//fuse with image values at this x,y 
		const ln = this.imageComplementLuma(params.imageData); 
		const lt = (this.lifetime - this.ttl) / this.lifetime; 
		let f = ln; 
		this.alpha = lt; 
		
		// this controls how abstract the draw image looks
		let color = this.color; 
		if(GetRandomFloat(0, 1) > 0.8) { // add a button type range slider [abstractness]
			color = this.imagePixel(params.imageData); 
		}
		this.color = color; 
		


		// compute the radius delta change
		let dRadius = GetRandomFloat(-MaxParticleSize / 3, MaxParticleSize / 3); 
		this.radius += dRadius;
		this.radius = Clamp(MinParticleSize, MaxParticleSize, this.radius) * f;  
		if(this.speed < 1.0) {
			this.radius = 0.1; 
		}


		// manage particle lifetime 
		this.ttl += -1;
		if(this.ttl == 0) {
			this.reset(); 
		} 
	}

	Draw(ctx: CanvasRenderingContext2D) {
		ctx.save()
		this.experiment1(ctx)
		ctx.restore()
	}

	experiment1(ctx: CanvasRenderingContext2D) {
		//if(this.x == 0 && this.y == 0) { return; }

		ctx.fillStyle = this.color
		ctx.globalAlpha = this.alpha
		let circle = new Path2D()
		circle.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
		ctx.fill(circle)
	}

}