import { Particle  } from "./Particle";

export class Effect {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    width: number; 
    height: number;

    particles: Particle[];
    numberOfParticles: number;
    
    curve: number;
    zoom: number;

    rows: number; 
    cols: number;
    cellSize: number;
    FlowField: any[];  

    image; 

    debug: boolean;

    constructor(canvas : HTMLCanvasElement, context : CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;
        this.context = context; 

        this.particles = []; 
        this.numberOfParticles = 4000; 
        this.cellSize = 20; 
        this.curve = 0.01; 
        this.zoom = 5; 
        this.FlowField = []; 
        

        this.rows = 0; 
        this.cols = 0; 
        
        this.image = document.getElementById('FlowImage'); 

        this.debug = false; 
        this.init(); 

        window.addEventListener('keydown', event => {
            if(event.key === 'd') {  this.debug = !this.debug; }
        }); 

        // window.addEventListener('resize', event => {
        //     let window = event?.target as Window; 
        //     this.resize(window?.innerWidth, window?.innerHeight); 
        // }); 
    }   

    drawText() {
        this.context.font = '500px Impact'; 
        this.context.textAlign = 'center'; 
        this.context.textBaseline = 'middle';

        const gradient1 = this.context.createLinearGradient(0, 0, this.width, this.height);
        gradient1.addColorStop(0.2, 'rgb(255, 255,255)'); 
        gradient1.addColorStop(0.4, 'rgb(255, 255,0)'); 
        gradient1.addColorStop(0.6, 'rgb(0, 255,255)'); 
        gradient1.addColorStop(0.8, 'rgb(0, 0,255)'); 

        const gradient2 = this.context.createLinearGradient(0, 0, this.width, this.height);
        gradient2.addColorStop(0.2, 'rgb(255, 255, 0'); 
        gradient2.addColorStop(0.4, 'rgb(200, 5, 50'); 
        gradient2.addColorStop(0.6, 'rgb(150, 255, 255'); 
        gradient2.addColorStop(0.8, 'rgb(255, 255, 150'); 

        const gradient3 = this.context.createRadialGradient(
            this.width * 0.2, 
            this.height * 0.2, 
            10, 
            this.width * 0.2, 
            this.height * 0.2, 
            this.width); 
        gradient3.addColorStop(0.2, 'rgb(0, 0, 255)');
        gradient3.addColorStop(0.4, 'rgb(200, 255, 0)');
        gradient3.addColorStop(0.6, 'rgb(0, 0, 255)');
        gradient3.addColorStop(0.8, 'rgb(0, 0, 0)');


        this.context.fillStyle = gradient3;  
        this.context.fillText('安希子', this.width * 0.5, this.height * 0.5, this.width * 0.8);
    }

    drawFlowFieldImage() {
        let imageSize = this.width * 0.7; 
        if(!this.image) {
            throw new Error("Can't draw flow field image"); 
            return; 
        }
        this.context.drawImage((this.image as HTMLImageElement), 
                            this.width * 0.5 - imageSize * 0.5, 
                            this.height * 0.5 - imageSize * 0.5,
                            imageSize,
                            imageSize); 
    }

    init() {
        //create flow field
        this.rows = Math.floor(this.height / this.cellSize); 
        this.cols = Math.floor(this.width / this.cellSize); 
        this.FlowField = [];

        // draw text 
        //this.drawText(); 
        this.drawFlowFieldImage(); 

        // scan pixel data
        const pixels: Uint8ClampedArray = this.context.getImageData(0, 0, this.width, this.height).data; 
        if(this.debug) { 
            console.log(pixels); 
        }
        for(let y = 0; y < this.height; y += this.cellSize) {
            for(let x = 0; x < this.width; x += this.cellSize) {
                const index = (y * this.width + x) * 4; 
                const red  = pixels[index];
                const green = pixels[index + 1];
                const blue = pixels[index + 2];
                const alpha = pixels[index + 3];
                const grayscale = (red + green + blue) / 3; 
                const colorAngle = ((grayscale / 255) * 6.28).toFixed(2); 
                this.FlowField.push({
                    x: x, 
                    y: y, 
                    red: red, 
                    green: green, 
                    blue: blue,
                    alpha: alpha, 
                    colorAngle: colorAngle
                }); 
            }
        }

        // create particles 
        this.particles = []; 
        for(let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this)); 
        }
        this.particles.forEach(particle => particle.reset()); 
    }

    drawGrid() {
        this.context.save(); 
        this.context.strokeStyle = 'grey';
        this.context.lineWidth = 0.2; 

        for(let c = 0; c < this.cols; c++) {
            this.context.beginPath();
            this.context.moveTo(this.cellSize * c, 0); 
            this.context.lineTo(this.cellSize * c, this.height); 
            this.context.stroke(); 
        }

        for(let r = 0; r < this.rows; r++) {
            this.context.beginPath();
            this.context.moveTo(0, this.cellSize * r); 
            this.context.lineTo(this.width, this.cellSize * r); 
            this.context.stroke(); 
        }
        this.context.restore();
    }

    resize(width: number, height: number) {
        this.canvas.width = width; 
        this.canvas.height = height;
        this.width = this.canvas.width; 
        this.height = this.canvas.height;
        this.init(); 
    }

    render() {
        if(this.debug) { 
            //this.drawText(); 
            this.drawFlowFieldImage(); 
            this.drawGrid();
        } 
        this.particles.forEach(particle => {
            particle.draw(this.context); 
            particle.update(); 
        }); 
    }
}

