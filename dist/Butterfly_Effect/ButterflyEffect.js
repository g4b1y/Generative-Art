"use strict";
var canvas_ = document.getElementById("Butterfly_Effect_Animation");
var ctx_ = canvas_.getContext("2d");
if (!canvas_ || canvas_ == null) {
    throw new Error('Can not create canvas');
}
if (!ctx_ || ctx_ == null) {
    throw new Error('Can not create context');
}
