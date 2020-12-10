
//----------------------------------------------------------------------------
//
// Global Variables
//

var gl = null; // WebGL context

var shaderProgram = null; 

var tabuleiro = new Tabuleiro();
var squares = tabuleiro.getSquares();

// NEW --- Buffers

var squaresVertexPositionBuffer = [];

var squaresVertexIndexBuffer = [];

var squaresVertexColorBuffer = [];

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

/* vertices = [
            // Front face
            -1.0, -1.0,  1.0,
             1.0, -1.0,  1.0,
             1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,

            // Back face
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0, -1.0, -1.0,

            // Top face
            -1.0,  1.0, -1.0,
            -1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,

            // Right face
             1.0, -1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0,  1.0,  1.0,
             1.0, -1.0,  1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0
]; */

// Texture coordinates for the quadrangular faces

// Notice how they are assigne to the corresponding vertices

var textureCoords = [

          // Front face
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,

          // Back face
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,
          0.0, 0.0,

          // Top face
          0.0, 1.0,
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,

          // Bottom face
          1.0, 1.0,
          0.0, 1.0,
          0.0, 0.0,
          1.0, 0.0,

          // Right face
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,
          0.0, 0.0,

          // Left face
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,
];

// Vertex indices defining the triangles
        
var cubeVertexIndices = [

            0, 1, 2,      0, 2, 3,    // Front face

            4, 5, 6,      4, 6, 7,    // Back face

            8, 9, 10,     8, 10, 11,  // Top face

            12, 13, 14,   12, 14, 15, // Bottom face

            16, 17, 18,   16, 18, 19, // Right face

            20, 21, 22,   20, 22, 23  // Left face
];
         
         
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

function initBuffers() {	
	
	for (var i = 0; i < 8; i++) {			
		var line = squares[i];

		for (var j = 0; j < line.length; j++) {					
			var quadrado = line[j];

			// Coordinates
			var vertices = quadrado.getVertices();
			var colors = quadrado.getColors();
			var vertexIndices = quadrado.getVertexIndices();

			var quadradoVertexPositionBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, quadradoVertexPositionBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			quadradoVertexPositionBuffer.itemSize = 3;
			quadradoVertexPositionBuffer.numItems = vertices.length / 3;

			// Textures
			/*boardVertexTextureCoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, boardVertexTextureCoordBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
            boardVertexTextureCoordBuffer.itemSize = 2;
            boardVertexTextureCoordBuffer.numItems = 24;*/

            // Colors
            var quadradoVertexColorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, quadradoVertexColorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
            quadradoVertexColorBuffer.itemSize = 3;
            quadradoVertexColorBuffer.numItems = vertices.length / 3;

			// Vertex indices
			var quadradoVertexIndexBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, quadradoVertexIndexBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);
			quadradoVertexIndexBuffer.itemSize = 1;
			quadradoVertexIndexBuffer.numItems = 36;

			squaresVertexPositionBuffer.push(quadradoVertexPositionBuffer);
            squaresVertexColorBuffer.push(quadradoVertexColorBuffer);
			squaresVertexIndexBuffer.push(quadradoVertexIndexBuffer);
		}
	}
	
}

//----------------------------------------------------------------------------

//  Drawing the model
function drawModel( modeloVertexPositionBuffer,
	modeloVertexColorBuffer,
	modeloVertexIndexBuffer,
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

	// Passing the buffers
	gl.bindBuffer(gl.ARRAY_BUFFER, modeloVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, modeloVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	// NEW --- Textures
	/* gl.bindBuffer(gl.ARRAY_BUFFER, modelVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, modelVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, webGLTexture);

	gl.uniform1i(shaderProgram.samplerUniform, 0);
	*/

	// Colors
	gl.bindBuffer(gl.ARRAY_BUFFER, modeloVertexColorBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, modeloVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

	// The vertex indices
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, modeloVertexIndexBuffer);

	// Drawing the triangles
	gl.drawElements(gl.TRIANGLES, modeloVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

//----------------------------------------------------------------------------

//  Drawing the 3D scene

function drawScene() {
	
	var pMatrix;
	
	var mvMatrix = mat4();
	
	// Clearing with the background color
	
	gl.clear(gl.COLOR_BUFFER_BIT);
	
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
	
	for (var i = 0; i < squaresVertexPositionBuffer.length; i++) {
		drawModel(  squaresVertexPositionBuffer[i],
					squaresVertexColorBuffer[i],
					squaresVertexIndexBuffer[i],
					angleXX, angleYY, angleZZ,
					sx, sy, sz,
					tx, ty, tz,
					mvMatrix,
					primitiveType );
	}
	
	           
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

			angleXX += rotationXX_DIR * rotationXX_SPEED * (90 * elapsed) / 1000.0;
	    }

		if( rotationYY_ON ) {

			angleYY += rotationYY_DIR * rotationYY_SPEED * (90 * elapsed) / 1000.0;
	    }

		if( rotationZZ_ON ) {

			angleZZ += rotationZZ_DIR * rotationZZ_SPEED * (90 * elapsed) / 1000.0;
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
		
}


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
		
		gl.enable( gl.BLEND );
		
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
	
	initBuffers();
	
	/* initTexture(); */
	
	tick();		// A timer controls the rendering / animation    

	outputInfos();
}


