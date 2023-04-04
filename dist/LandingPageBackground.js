"use strict";
var canvas = document.getElementById('landing-Page-Background');
if (!canvas) {
    throw new Error('Can not create canvas');
}
var ctx = canvas.getContext('2d');
if (!ctx) {
    throw new Error('Can not create context');
}
var width = canvas.width = window.innerWidth - 20;
var height = canvas.height = window.innerHeight;
canvas.style.backgroundColor = '#000000';
ctx.strokeStyle = 'hsl(' + Math.random() * 360 + ', 100%, 50%)';
ctx.lineWidth = 0.2;
var color = Math.random() * 360;
// random attractor parameters
var a = Math.random() * 2 - 4;
var b = Math.random() * 2 - 4;
var c = Math.random() * 2 - 4;
var d = Math.random() * 2 - 4;
console.log(a + '' + b + '' + c + '' + d);
// create points. each aligned to left edge of screen,
// spread out top to bottom.
var points = [];
for (var y = 0; y < height; y += 5) {
    points.push({
        x: 0,
        y: y,
        vx: 0,
        vy: 0
    });
}
;
render();
function render() {
    if (!ctx) {
        throw new Error('Unable to load context');
        return;
    }
    if (!ctx) {
        throw new Error('error, failed to load context');
        return;
    }
    ctx.lineWidth += 0.001;
    if (ctx.lineWidth >= 1.5) {
        ctx.lineWidth -= 0.02;
    }
    if (ctx.lineWidth <= 0.1) {
        ctx.lineWidth += 0.01;
    }
    for (var i = 0; i < points.length; i++) {
        var p = points[i];
        var value = getValue(p.x, p.y);
        p.vx += Math.cos(value) * 0.2;
        p.vy += Math.sin(value) * 0.2;
        // move to current position
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        // add velocity to position and line to new position
        p.x += p.vx;
        p.y += p.vy;
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        // apply some friction so point doesn't speed up too much
        p.vx *= 0.99;
        p.vy *= 0.99;
        // wrap around edges of screen
        if (p.x > width)
            p.x = 0;
        if (p.y > height)
            p.y = 0;
        if (p.x < 0)
            p.x = width;
        if (p.y < 0)
            p.y = height;
    }
    requestAnimationFrame(render);
    color += 0.12;
    ctx.strokeStyle = 'hsl(' + color + ', 100%, 50%)';
}
function getValue(x, y) {
    // scale down x and y
    var scale = 0.001; //1 / (Math.random() * (Math.atan(Math.random())* 1000 - 500));
    x = (x - width / 2) * scale;
    y = (y - height / 2) * scale;
    // attactor gives new x, y for old one.
    var x1 = Math.sin(a * y) + c * Math.cos(a * x);
    var y1 = Math.sin(b * x) + d * Math.cos(b * y);
    // find angle from old to new. that's the value.
    return Math.random() * y1 - y, x1 - x;
}
