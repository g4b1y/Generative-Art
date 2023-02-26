import { Particle } from './particle';
import { ColorPalettes, ParticleCount } from './sim-constants';
import { GetRandomInt } from './utils';
var Simulation = /** @class */ (function () {
    function Simulation(width, height) {
        this.width = width;
        this.height = height;
        this.particles = [];
        this.palette = [];
        this.dt = 1 / Math.pow(10, GetRandomInt(1, 5));
        this.dd = 1 / Math.pow(10, GetRandomInt(1, 5));
        this.init = false;
        // select a random palette
        this.palette = ColorPalettes[GetRandomInt(0, ColorPalettes.length)];
        // create particles
        for (var i = 0; i < ParticleCount; i++) {
            this.particles.push(new Particle(this.width, this.height, this.palette));
        }
    }
    Simulation.prototype.Update = function (params) {
        params.phase += Math.PI / 256;
        params.t += this.dt;
        params.d = this.dd;
        // Update particles
        this.particles.forEach(function (p, i) {
            params.index = i;
            p.Update(params);
        });
    };
    Simulation.prototype.Draw = function (ctx) {
        // Draw background
        if (!this.init) {
            ctx.fillStyle = this.palette[0];
            ctx.fillRect(0, 0, this.width, this.height);
            this.init = true;
        }
        // Draw particles
        this.particles.forEach(function (p) { return p.Draw(ctx); });
    };
    return Simulation;
}());
export { Simulation };
