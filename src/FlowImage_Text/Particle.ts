import { Effect } from "./Effect";
import { IPoint } from "./Utils";

export class Particle {
    effect: Effect
    x: number; 
    y: number;

    speedX : number;
    speedY : number;
    speedModifier: number;

    colors: string[];
    color: string; 
    red: number;
    green: number;
    blue: number;
    
    angle: number;
    newAngle: number;
    angleCorrection: number; 

    timer: number;
    maxLength : number; 
    history: IPoint[]; 

    constructor(effect: Effect) {
        this.maxLength = Math.floor(Math.random() * 50 + 20); 
        this.speedModifier = Math.random() * 3 + 1; 
        this.angleCorrection =  Math.random() + 0.05 + 0.01; //0.27;

        this.effect = effect;
        this.x = Math.floor(Math.random() * this.effect.width); 
        this.y = Math.floor(Math.random() * this.effect.height);

        this.history = [{x : this.x, y : this.y} as IPoint]; 
        this.angle = 0;  
        this.newAngle = 0; 
        this.timer = this.maxLength * 2; 
        this.speedX  = 0; 
        this.speedY  = 0;
    
        this.colors = ['#2c026b', '#730d9e', '#9622c7', '#b44ae0', '#cd72f2', 'white']; 
        this.red = 0; 
        this.green = 250; 
        this.blue = 0; 
        this.color = 'rgb('+ this.red + ',' + this.green + ',' + this.blue + ')'; 
    }

    draw(context: CanvasRenderingContext2D) {
        context.beginPath(); 
        context.moveTo(this.history[0].x, this.history[0].y);
        for(let i = 0; i < this.history.length; i++) {
            context.lineTo(this.history[i].x, this.history[i].y); 
        }
        context.strokeStyle = this.color; 
        context.stroke();
    } 

    update() {
        this.timer--; 

        if(this.timer >= 1) {
            let x = Math.floor(this.x / this.effect.cellSize); 
            let y = Math.floor(this.y / this.effect.cellSize); 
            let index = y * this.effect.cols + x;
            
            let flowFieldIndex = this.effect.FlowField[index]; 
            if(flowFieldIndex) {
                // motion
                this.newAngle = flowFieldIndex.colorAngle; 
                if(this.angle > this.newAngle) {
                    this.angle -= this.angleCorrection; 
                } 
                else if(this.angle < this.newAngle) {
                    this.angle += this.angleCorrection;
                }
                else {
                    this.angle = this.newAngle; 
                }
                // color 
                if(flowFieldIndex.alpha > 0) {
                    this.red    === flowFieldIndex.red      ?   this.red:   this.red    += (flowFieldIndex.red   - this.red)   * 0.1; 
                    this.green  === flowFieldIndex.green    ?   this.green: this.green  += (flowFieldIndex.green - this.green) * 0.1;  
                    this.blue   === flowFieldIndex.blue     ?   this.blue:  this.blue   += (flowFieldIndex.blue  - this.blue)  * 0.1; 

                    this.color = 'rgb('+ this.red + ',' + this.green + ',' + this.blue + ')'; 
                }
            }


    
            this.speedX = Math.cos(this.angle); 
            this.speedY = Math.sin(this.angle);
            this.x += this.speedX * this.speedModifier;
            this.y += this.speedY * this.speedModifier;
    
            this.history.push({x : this.x, y : this.y} as IPoint);
            if(this.history.length > this.maxLength) {
                this.history.shift(); 
            } 
        } else if(this.history.length > 1) {
            this.history.shift(); 
        } else {
            this.reset(); 
        }
    }

    reset() {
        let attemps = 0; 
        let resetSuccess = false;

        while(attemps < 50 && !resetSuccess) {
            attemps++ ; 
            let testIndex = Math.floor(Math.random() * this.effect.FlowField.length);
            if(this.effect.FlowField[testIndex].alpha > 0) {
                this.x = this.effect.FlowField[testIndex].x;
                this.y = this.effect.FlowField[testIndex].y; 
                this.history = [{x: this.x, y : this.y} as IPoint]; 
                this.timer = this.maxLength * 2;  
                resetSuccess = true; 
            }
        }
        if(!resetSuccess) {
            this.x = Math.random() * this.effect.width; 
            this.y = Math.random() * this.effect.height;
            this.history = [{x: this.x, y: this.y} as IPoint]; 
            resetSuccess = true; 
        }
    }
}


