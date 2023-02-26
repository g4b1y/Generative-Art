import { GetRandomFloat, GetRandomInt, ToLuma, Clamp } from './utils';
import { ParticleCount } from './sim-constants';
// Particle Constants
var MaxParticleSize = 4; // add a range slider
var MinParticleSize = 1;
////////////////////////////////////
function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(function (x) {
        var hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}
var Particle = /** @class */ (function () {
    function Particle(w, h, palette) {
        this.w = w;
        this.h = h;
        this.palette = palette;
        this.x = 0;
        this.y = 0; // location of this particle
        this.px = 0;
        this.py = 0; // previous location 
        this.speed = 0;
        this.theta = 0; // describes the velocity
        this.radius = MinParticleSize; // size of the particle
        this.ttl = 500; // how much time left to live
        this.lifetime = 500; // how long this particle will live
        this.alpha = 1.0;
        this.color = 'black';
        this.reset();
    }
    Particle.prototype.reset = function () {
        this.x = 0; // add a button for starting particles 
        this.y = 0;
        this.py = this.x; // previous location 
        this.px = this.y;
        this.speed = GetRandomFloat(0, 3.0);
        this.theta = GetRandomFloat(0, 2 * Math.PI);
        this.radius = GetRandomFloat(0, 5);
        this.color = 'black';
        if (GetRandomFloat(0, 1) > 0.1) {
            this.color = this.palette[GetRandomInt(1, this.palette.length)];
        }
        this.ttl = this.lifetime = GetRandomInt(50, 100);
    };
    Particle.prototype.imageComplementLuma = function (imageData) {
        var p = Math.floor(this.x) + Math.floor(this.y) * imageData.width;
        // ImageData contains RGBA values
        var i = Math.floor(p * 4);
        var r = imageData.data[i + 0];
        var g = imageData.data[i + 1];
        var b = imageData.data[i + 2];
        var luma = ToLuma(r, g, b); // 0 -> 255 ; luma is higher for lighter pixel
        var ln = 1 - luma / 255.0; // complement; higher ln means darker
        return ln;
    };
    Particle.prototype.imagePixel = function (imageData) {
        var p = Math.floor(this.x) + Math.floor(this.y) * imageData.width;
        // ImageData contains RGBA values
        var i = Math.floor(p * 4);
        var r = imageData.data[i + 0];
        var g = imageData.data[i + 1];
        var b = imageData.data[i + 2];
        return rgbToHex(r, g, b);
    };
    Particle.prototype.Update = function (params) {
        // compute new values
        var k = params.t;
        var theta = this.theta;
        var r = (params.index + 1) / ParticleCount;
        this.px = this.x;
        this.py = this.y;
        this.x = Math.atan(k * theta) * Math.cos(theta) * r * this.w + Math.sin(this.px) + this.w / 2;
        this.y = Math.cos(k * theta) * Math.sin(theta) * r * this.h + Math.cos(this.py) + this.h / 2;
        this.x = this.x > this.w ? 0 : this.x;
        this.y = this.y > this.h ? 0 : this.y;
        //fuse with image values at this x,y 
        var ln = this.imageComplementLuma(params.imageData);
        var lt = (this.lifetime - this.ttl) / this.lifetime;
        var f = ln;
        this.alpha = lt;
        // this controls how abstract the draw image looks
        var color = this.color;
        if (GetRandomFloat(0, 1) > 0.8) { // add a button type range slider [abstractness]
            color = this.imagePixel(params.imageData);
        }
        this.color = color;
        // compute the radius delta change
        var dRadius = GetRandomFloat(-MaxParticleSize / 3, MaxParticleSize / 3);
        this.radius += dRadius;
        this.radius = Clamp(MinParticleSize, MaxParticleSize, this.radius) * f;
        if (this.speed < 1.0) {
            this.radius = 0.1;
        }
        // manage particle lifetime 
        this.ttl += -1;
        if (this.ttl == 0) {
            this.reset();
        }
    };
    Particle.prototype.Draw = function (ctx) {
        ctx.save();
        this.experiment1(ctx);
        ctx.restore();
    };
    Particle.prototype.experiment1 = function (ctx) {
        //if(this.x == 0 && this.y == 0) { return; }
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        var circle = new Path2D();
        circle.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill(circle);
    };
    return Particle;
}());
export { Particle };
