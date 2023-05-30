const path = require('path');

module.exports = {
    entry: './dist/script.js', 
    watch: true, 
    output: {
        filename: './bundle.js', 
        path: path.resolve(__dirname, './dist'), 
    }
}; 
