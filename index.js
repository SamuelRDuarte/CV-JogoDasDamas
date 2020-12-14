
//----------------------------------------------------------------------------
//
// Global Variables
//

var gl = null; // WebGL context

var shaderProgram = null; 

var tabuleiro = new Tabuleiro();
var squares = tabuleiro.getSquares();
var damas = tabuleiro.getDamas();
//console.log(damas);

function reset(){
	tabuleiro = new Tabuleiro();
	squares = tabuleiro.getSquares();
	damas = tabuleiro.getDamas();
	gl = null;
	shaderProgram = null;
	squaresVertexPositionBuffer = null;
	squaresVertexColorBuffer = null;
	damasVertexPositionBuffer = null;
	damasVertexColorBuffer = null;
	resetView();
	runWebGL();
	
}

// NEW --- Buffers

var squaresVertexPositionBuffer = null;
//var squaresVertexIndexBuffer = null;
var squaresVertexColorBuffer = null;

var damasVertexPositionBuffer = null;
//var damasVertexIndexBuffer = [];
var damasVertexColorBuffer = null;

// The global transformation parameters

// The translation vector





var tx = 0.0;
var ty = 0.0;
var tz = 0.0;

// The rotation angles in degrees

var angleXX = 40;
var angleYY = 0.0;
var angleZZ = 0.0;

// The scaling factors

var sx = 0.13;
var sy = 0.13;
var sz = 0.13;

// NEW - Animation controls
var rotationXX_ON = 0;
var rotationXX_DIR = 1;
var rotationXX_SPEED = 1;
 
var rotationYY_ON = 0;
var rotationYY_DIR = 1;
var rotationYY_SPEED = 1;
 
var rotationZZ_ON = 0;
var rotationZZ_DIR = 1;
var rotationZZ_SPEED = 1;
 
// To allow choosing the way of drawing the model triangles

var primitiveType = null;
 
// To allow choosing the projection type

var projectionType = 0;
 
// From learningwebgl.com

// NEW --- Storing the vertices defining the squares faces

function resetView(){
	tx = 0.0;
	ty = 0.0;
	tz = 0.0;

	angleXX = 40;
	angleYY = 0.0;
	angleZZ = 0.0;

	sx = 0.13;
	sy = 0.13;
	sz = 0.13;

	rotationXX_ON = 0;
	rotationXX_DIR = 1;
	rotationXX_SPEED = 1;

	rotationYY_ON = 0;
	rotationYY_DIR = 1;
	rotationYY_SPEED = 1;

	rotationZZ_ON = 0;
	rotationZZ_DIR = 1;
	rotationZZ_SPEED = 1;
}

// Texture coordinates for the quadrangular faces

// Notice how they are assigne to the corresponding vertices


// Vertex indices defining the triangles
    
         
         
//----------------------------------------------------------------------------
//
// The WebGL code
//

//----------------------------------------------------------------------------
//
//  Rendering
//

// Handling the Textures

// From www.learningwebgl.com

/* function handleLoadedTexture(texture) {
	
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.bindTexture(gl.TEXTURE_2D, null);
}


var webGLTexture;

function initTexture() {
	
	webGLTexture = gl.createTexture();
	webGLTexture.image = new Image();
	webGLTexture.image.onload = function () {
		handleLoadedTexture(webGLTexture)
	}

	webGLTexture.image.src = "NeHe.gif";
} */

//----------------------------------------------------------------------------

// Handling the Buffers

/* function initBuffers() {
	//initBuffersQuadrados();
	initBuffersDamas();
	
} */


function initBuffersQuadrado(quadrado){

	// Coordinates
	var vertices = quadrado.getVertices();
	var colors = quadrado.getColors();

	squaresVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squaresVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	squaresVertexPositionBuffer.itemSize = 3;
	squaresVertexPositionBuffer.numItems = vertices.length / 3;

	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
		squaresVertexPositionBuffer.itemSize, 
		gl.FLOAT, false, 0, 0);


	// Colors
	squaresVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squaresVertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	squaresVertexColorBuffer.itemSize = 3;
	squaresVertexColorBuffer.numItems = vertices.length / 3;

	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
		squaresVertexColorBuffer.itemSize, 
		gl.FLOAT, false, 0, 0);	
	
}

function initBuffersDama(dama){

	// Coordinates
	var vertices = dama.getVertices();
	var colors = dama.getColors();
	//var vertexIndices = quadrado.getVertexIndices();

	damasVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, damasVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	damasVertexPositionBuffer.itemSize = 3;
	damasVertexPositionBuffer.numItems = vertices.length / 3;

	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
		damasVertexPositionBuffer.itemSize, 
		gl.FLOAT, false, 0, 0);

	

	// Colors
	damasVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, damasVertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	damasVertexColorBuffer.itemSize = 3;
	damasVertexColorBuffer.numItems = vertices.length / 3;

	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
		damasVertexColorBuffer.itemSize, 
		gl.FLOAT, false, 0, 0);
		
}

//----------------------------------------------------------------------------

//  Drawing the model


function drawModelQuadrado( quadrado,
	angleXX, angleYY, angleZZ,
	sx, sy, sz,
	tx, ty, tz,
	mvMatrix,
	primitiveType ) {

	// Pay attention to transformation order !!

	mvMatrix = mult( mvMatrix, translationMatrix( tx, ty, tz ) );
	mvMatrix = mult( mvMatrix, rotationZZMatrix( angleZZ ) );
	mvMatrix = mult( mvMatrix, rotationYYMatrix( angleYY ) );
	mvMatrix = mult( mvMatrix, rotationXXMatrix( angleXX ) );
	mvMatrix = mult( mvMatrix, scalingMatrix( sx, sy, sz ) );
			
	// Passing the Model View Matrix to apply the current transformation
	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));

	initBuffersQuadrado(quadrado);

	if( primitiveType == gl.LINE_LOOP ) {
		
		// To simulate wireframe drawing!
		
		// No faces are defined! There are no hidden lines!
		
		// Taking the vertices 3 by 3 and drawing a LINE_LOOP
		
		var i;
		
		for( i = 0; i < squaresVertexPositionBuffer.numItems / 3; i++ ) {
		
			gl.drawArrays( primitiveType, 3 * i, 3 ); 
		}
	}	
	else {
				
		gl.drawArrays(primitiveType, 0, squaresVertexPositionBuffer.numItems); 
		
	}	
}

function drawModelDama( dama,
	angleXX, angleYY, angleZZ,
	sx, sy, sz,
	tx, ty, tz,
	mvMatrix,
	primitiveType ) {

	// Pay attention to transformation order !!

	mvMatrix = mult( mvMatrix, translationMatrix( tx, ty, tz ) );
	mvMatrix = mult( mvMatrix, rotationZZMatrix( angleZZ ) );
	mvMatrix = mult( mvMatrix, rotationYYMatrix( angleYY ) );
	mvMatrix = mult( mvMatrix, rotationXXMatrix( angleXX ) );
	mvMatrix = mult( mvMatrix, scalingMatrix( sx, sy, sz ) );
			
	// Passing the Model View Matrix to apply the current transformation
	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));

	initBuffersDama(dama);

	if( primitiveType == gl.LINE_LOOP ) {
		
		// To simulate wireframe drawing!
		
		// No faces are defined! There are no hidden lines!
		
		// Taking the vertices 3 by 3 and drawing a LINE_LOOP
		
		var i;
		
		for( i = 0; i < damasVertexPositionBuffer.numItems / 3; i++ ) {
		
			gl.drawArrays( primitiveType, 3 * i, 3 ); 
		}
	}	
	else {
				
		gl.drawArrays(primitiveType, 0, damasVertexPositionBuffer.numItems); 
		
	}	
}

//----------------------------------------------------------------------------

//  Drawing the 3D scene

function drawScene() {
	
	

	var pMatrix;
	
	var mvMatrix = mat4();
	
	// Clearing with the background color
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	
	// NEW --- Computing the Projection Matrix
	
	if( projectionType == 0 ) {
		
		// For now, the default orthogonal view volume
		
		pMatrix = ortho( -1.0, 1.0, -1.0, 1.0, -1.0, 1.0 );
		
		tz = 0;
		
		// TO BE DONE !
		
		// Allow the user to control the size of the view volume
	}
	else {	

		// A standard view volume.
		
		// Viewer is at (0,0,0)
		
		// Ensure that the model is "inside" the view volume
		
		pMatrix = perspective( 45, 1, 0.05, 10 );
		
		tz = -2.25;

	}
	
	// Passing the Projection Matrix to apply the current projection
	
	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	
	gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));
	
	// NEW --- Instantianting the same model more than once !!
	
	// And with diferent transformation parameters !!
	
	// Call the drawModel function !!
	for (var i = 0; i < 8; i++) {			
		var line = squares[i];

		for (var j = 0; j < line.length; j++) {					
			var quadrado = line[j];
			drawModelQuadrado(  quadrado,
				angleXX, angleYY, angleZZ,
				sx, sy, sz,
				tx, ty, tz,
				mvMatrix,
				primitiveType );
		}
	}

	for (var i = 0; i < damas.length; i++) {			
		var dama = damas[i];
		drawModelDama( dama,
			angleXX, angleYY, angleZZ,
			sx, sy, sz,
			tx, ty, tz,
			mvMatrix,
			primitiveType );
	}
	
	outputInfos();

	/* for (var i = 0; i < squaresVertexPositionBuffer.length; i++) { //desenhar quadrado a quadrado
		drawModelTeste(  squaresVertexPositionBuffer[i],
					squaresVertexColorBuffer[i],
					squaresVertexIndexBuffer[i],
					angleXX, angleYY, angleZZ,
					sx, sy, sz,
					tx, ty, tz,
					mvMatrix,
					primitiveType );
	} */

	/* for (var i = 0; i < damasVertexPositionBuffer.length; i++) { //desenhar dama a dama
		drawModel(  damasVertexPositionBuffer[i],
					damasVertexColorBuffer[i],
					damasVertexIndexBuffer[i],
					angleXX, angleYY, angleZZ,
					sx, sy, sz,
					tx, ty, tz,
					mvMatrix,
					primitiveType );
	} */

	
	           
}

//----------------------------------------------------------------------------
//
//  NEW --- Animation
//

// Animation --- Updating transformation parameters

var lastTime = 0;

function animate() {
	
	var timeNow = new Date().getTime();
	
	if( lastTime != 0 ) {
		
		var elapsed = timeNow - lastTime;
		
		if( rotationXX_ON ) {
			if(tabuleiro.currentTeam && (Math.abs(angleXX%360) < 120 || Math.abs(angleXX%360) > 125)){
				angleXX += rotationXX_DIR * rotationXX_SPEED * (90 * elapsed) / 1000.0;
				
			}else if(!tabuleiro.currentTeam && (angleXX%360 < 40 || angleXX%360 > 45 )){
				angleXX += rotationXX_DIR * rotationXX_SPEED * (90 * elapsed) / 1000.0;
				console.log("x: "+angleXX%360)
			}else {//if (angleXX%360 > 40 && angleXX%360 < 43){
				rotationXX_ON = 0;
				//tabuleiro.jogou = false;
			}
	    }

		if( rotationYY_ON ) {
				if( angleYY%360 < 0 || angleYY%360 > 5){
					angleYY += rotationYY_DIR * rotationYY_SPEED * (90 * elapsed) / 1000.0;
					console.log("y: "+angleYY%360);
				}else{
					rotationYY_ON = 0;
				}
				
	    }

		if( rotationZZ_ON ) {
			if(tabuleiro.currentTeam && (angleZZ%360 < 180 || angleZZ%360 > 185)){
				angleZZ += rotationZZ_DIR * rotationZZ_SPEED * (90 * elapsed) / 1000.0;
			}/* else if (angleZZ%360 > 180 && angleZZ%360 < 183){
				tabuleiro.jogou = false;
				rotationZZ_ON = 0;
			} */

			else if(!tabuleiro.currentTeam && (angleZZ%360 < 0 || angleZZ%360 > 5)){
				angleZZ += rotationZZ_DIR * rotationZZ_SPEED * (90 * elapsed) / 1000.0;

			}else{ //if (angleZZ%360 > 0 && angleZZ%360 < 3){
				//tabuleiro.jogou = false;
				rotationZZ_ON = 0;
			}

	    }
	}
	
	lastTime = timeNow;
}


//----------------------------------------------------------------------------

// Timer

function tick() {
	
	requestAnimFrame(tick);
	
	// NEW --- Processing keyboard events 
	
	handleKeys();
	
	drawScene();
	
	animate();
}




//----------------------------------------------------------------------------
//
//  User Interaction
//



function outputInfos(){
	
	countFrames();

	if(!tabuleiro.currentTeam){
		document.getElementById('current-team').innerHTML = " &nbsp; Team 1 &nbsp;  ";
		document.getElementById('current-team').style.backgroundColor = tabuleiro.getTeam1cor();
		document.getElementById('give-up').textContent = "Give up Team 1";
		if(tabuleiro.jogou){
			rotationXX_DIR = -1;
			rotationZZ_DIR = -1;
			rotationXX_ON = 1;
			rotationZZ_ON = 1;
			rotationYY_ON = 1;
			tabuleiro.jogou = false;
		}
		

	}
	else{
		document.getElementById('current-team').innerHTML = " &nbsp; Team 2  &nbsp;";
		document.getElementById('current-team').style.backgroundColor = tabuleiro.getTeam2cor();
		document.getElementById('give-up').textContent = "Give up Team 2";
		if(tabuleiro.jogou){
			rotationXX_DIR = 1;
			rotationZZ_DIR = 1;
			rotationXX_ON = 1;
			rotationZZ_ON = 1;
			rotationYY_ON = 1;
			tabuleiro.jogou = false;
		}
	}
	
	if(tabuleiro.winner != null){
		if(tabuleiro.winner){
			alert("Team Red is the winner!");
		}
		if(!tabuleiro.winner){
			alert("Team Bege is the winner!");
		}
		reset();
	}

	

	var scores = tabuleiro.getScore();
	document.getElementById("teamBege-score").innerHTML = scores[0];
	document.getElementById("teamRead-score").innerHTML = scores[1];
	
}


// score = 0;

// function go(x){
// $({score: 0}).animate({score: x},{
// 	duration: 1000,
// 	easing:"linear",
// 	step: function(now, fx){
// 	$("#teamBege-score").html(score + Math.floor(now));
// 	},
// 	queue:false,
// 	complete: function(now, fx){
// 	score += x;
// 	}
// });
// $("#tag").fadeIn({
// 	duration:700,
// 	easing:"linear",
// 	step:function(now, fx){
// 	$(this).css("top", -55 * now  +"px");
// 	}
// }).fadeOut({
// 	duration:300,
// 	step:function(now, fx){
// 	$(this).css("top",-55 * ( 2 - now) + "px");
// 	}
// });

// }


//----------------------------------------------------------------------------
//
// WebGL Initialization
//

function initWebGL( canvas ) {
	try {
		
		// Create the WebGL context
		
		// Some browsers still need "experimental-webgl"
		
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		
		// DEFAULT: The viewport occupies the whole canvas 
		
		// DEFAULT: The viewport background color is WHITE
		
		// NEW - Drawing the triangles defining the model
		
		primitiveType = gl.TRIANGLES;
		
		// DEFAULT: Blending is DISABLED
		
		// Enable it !
		
		//gl.enable( gl.BLEND );

		gl.enable( gl.DEPTH_TEST );
		
		
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry! :-(");
	}        
}

//----------------------------------------------------------------------------

function runWebGL() {
	
	var canvas = document.getElementById("my-canvas");
	
	initWebGL( canvas );

	shaderProgram = initShaders( gl );
	
	setEventListeners( canvas );
	
	//initBuffers();
	
	/* initTexture(); */
	
	tick();		// A timer controls the rendering / animation    

	outputInfos();
}


