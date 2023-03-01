// Utility Functions
// GetRandomFloat returns a random floating point number
// in a given range
export function GetRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}
// GetRandomInt returns a random integer
// in a given range
export function GetRandomInt(min, max) {
    return Math.floor(GetRandomFloat(min, max));
}
// FromPolar returns the catesian co-ordinates for a
// given polar co-ordinate
export function FromPolar(v, theta) {
    return [v * Math.cos(theta), v * Math.sin(theta)];
}
export function ToLuma(r, g, b) {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
// Clamp makes sure the value stays in the range min,max
export function Clamp(min, max, value) {
    return value > max ? max : (value < min ? min : value);
}
export function GetRandomFloatArray(min, max, length) {
    var r = new Array(length);
    for (var i = 0; i < length; i++) {
        r[i] = GetRandomFloat(min, max);
    }
    return r;
}
