# Generative-Art

# Getting started


	1. install webpack
		a. npm init -y
		b. npm install webpack webpack-cli --save-dev 
		
		(https://webpack.js.org/guides/getting-started/)

	2. config 
		a. create a webpack.config.js file
		b. edit to include a app.js as the input and bundle.js as the output and *** `watch = true`
		c. tsconfig to:  "target": "es5", "module": "es6"

	3. automate build proc 
		a. compile with tsc -w << will watch and compile (sep console window)
		b. bundle with npx webpack << will watch and bundle (sep console window)
