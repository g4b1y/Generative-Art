import { Effect } from "./Effect";


const canvas= <HTMLCanvasElement>document.getElementById("canvas");
const context = <CanvasRenderingContext2D>canvas.getContext("2d"); 

canvas.width = 900; //window.innerWidth; 
canvas.height = 900; //window.innerHeight;

context.fillStyle = '#fff'; 
context.strokeStyle = '#fff'; 
context.lineWidth = 2; 

const effect = new Effect(canvas, context); 
effect.init(); 


function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    effect.render();
    requestAnimationFrame(animate); 
}

animate(); 




