// NEW --- Point Light Source Features

// Directional --- Homogeneous coordinate is ZERO

var pos_Light_Source = [ -10.0, -10.0, -10.0, 1.0 ];

// White light

var int_Light_Source = [ 1.0, 1.0, 1.0 ];

// Low ambient illumination

var ambient_Illumination = [ 0.2, 0.0, 0.2 ];

// NEW --- Model Material Features

// Ambient coef.

var kAmbi = [ 0.25, 0.22, 0.06 ];

// Difuse coef.

var kDiff = [ 0.35, 0.31, 0.09 ];

// Specular coef.

var kSpec = [ 0.80, 0.73, 0.21 ];

// Phong coef.

var nPhong = 83.2;

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
var Tvertices = tabuleiro.getVertices();
var Tcolors = tabuleiro.getColors();
var Tnormals = tabuleiro.getNormalVertices();

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

	resetEventListener();
	var canvas = document.getElementById("my-canvas");
	
	initWebGL( canvas );

	shaderProgram = initShaders( gl );
	resetView();
	//setEventListeners( canvas );
	
}

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

// NEW --- Buffers

var bordaVertexPositionBuffer = null;
var bordaVertexColorBuffer = null;
var bordaVertexNormalBuffer = null;

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
 
// NEW --- The viewer position

// It has to be updated according to the projection type

//var pos_Viewer = [ 0.0, 0.0, 0.0, 1.0 ];    
         
         
//----------------------------------------------------------------------------
//
// The WebGL code
//

//----------------------------------------------------------------------------
//
//  Rendering
//

//----------------------------------------------------------------------------

// Handling the Buffers

/* function initBuffers() {
	//initBuffersQuadrados();
	initBuffersDamas();
	
} */
function initBuffersBorda(){

	// Coordinates
	var vertices = tabuleiro.getVertices();
	var colors = tabuleiro.getColors();
	var normals = tabuleiro.getNormalVertices();

	bordaVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bordaVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Tvertices), gl.STATIC_DRAW);
	bordaVertexPositionBuffer.itemSize = 3;
	bordaVertexPositionBuffer.numItems = Tvertices.length / 3;

	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
		bordaVertexPositionBuffer.itemSize, 
		gl.FLOAT, false, 0, 0);

	

	// Colors
	bordaVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bordaVertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Tcolors), gl.STATIC_DRAW);
	bordaVertexColorBuffer.itemSize = 3;
	bordaVertexColorBuffer.numItems = Tvertices.length / 3;

	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
		bordaVertexColorBuffer.itemSize, 
		gl.FLOAT, false, 0, 0);	

	
	/* // Vertex Normal Vectors
		
	bordaVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bordaVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	bordaVertexNormalBuffer.itemSize = 3;
	bordaVertexNormalBuffer.numItems = normals.length / 3;	
	

	// Associating to the vertex shader
	
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 
			bordaVertexNormalBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);	 */
	
	
}

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
function drawModelBorda(angleXX, angleYY, angleZZ,
	sx, sy, sz,
	tx, ty, tz,
	mvMatrix,
	primitiveType ) {


	// The global model transformation is an input
	
	// Concatenate with the particular model transformations
	
    // Pay attention to transformation order !!
    
	mvMatrix = mult( mvMatrix, translationMatrix( tx, ty, tz ) );
						 
	mvMatrix = mult( mvMatrix, rotationZZMatrix( angleZZ ) );
	
	mvMatrix = mult( mvMatrix, rotationYYMatrix( angleYY ) );
	
	mvMatrix = mult( mvMatrix, rotationXXMatrix( angleXX ) );
	
	mvMatrix = mult( mvMatrix, scalingMatrix( sx, sy, sz ) );
						 
	// Passing the Model View Matrix to apply the current transformation
	
	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));
	
	// NEW --- Phong Illumination Model
	
	// TO BE COMPLETED STEP BY STEP !!
	
	// TEST THE AMBIENT ILLUMINATION FIRST !!
	
	// Clearing the colors array
	Tcolors.splice(0, Tcolors.length);
	  	
	// Compute the 3 components: AMBIENT, DIFFUSE and SPECULAR

	var ambientTerm = [ 0.0, 0.0, 0.0 ];
	
	var diffuseTerm = [ 0.0, 0.0, 0.0 ];
	
	var specularTerm = [ 0.0, 0.0, 0.0 ];
	
    // INITIALIZE EACH COMPONENT, with the constant terms
    for( var i = 0; i < 3; i++ )
    {
		ambientTerm[i] = kAmbi[i] * ambient_Illumination[i];
		diffuseTerm[i] = kDiff[i] * int_Light_Source[i];
		specularTerm[i] = kSpec[i] * int_Light_Source[i];
    }
    
    // SMOOTH-SHADING 

    // Compute the illumination for every vertex

    // Iterate through the vertices
    
    for( var vertIndex = 0; vertIndex < Tvertices.length; vertIndex += 3 )
    {	
		// For every vertex
		
		// GET COORDINATES AND NORMAL VECTOR
		// point where illumination point is being calculated

		var auxP = Tvertices.slice(vertIndex, vertIndex + 3 );	
		
		var auxN = Tnormals.slice(vertIndex, vertIndex + 3);

        // CONVERT TO HOMOGENEOUS COORDINATES
		
		auxP.push(1.0);

		auxN.push(0.0);
		 
        // APPLY CURRENT TRANSFORMATION (ROTATION, ETC.) -> IMPORTANT

        var pointP = multiplyPointByMatrix(mvMatrix, auxP);  						

        var vectorN = multiplyVectorByMatrix(mvMatrix, auxN); 
        
        // NORMALIZE vectorN

		normalize(vectorN);

        // DIFFUSE ILLUMINATION
	
        // Check if light source is directional or not
        
        var vectorL = vec3();

		if ( pos_Light_Source[3] == 0.0) {
			// Directional light source
			// Focus at infinite distance -> direction is already given 
			vectorL = pos_Light_Source.slice(0, 3);
		}
		else {
			for ( var i = 0 ; i < 3; i++ ) {
				vectorL[i] = pos_Light_Source[i] - pointP[i];
			}
		}
		
		normalize(vectorL);

        // Compute the dot product

        var cosNL = dotProduct(vectorN, vectorL);

        if (cosNL < 0.0) {
			cosNL = 0.0;		// No direct illumination
		}

        // SEPCULAR ILLUMINATION 

		var vectorV = vec3();

		// Check the projection type
		if ( projectionType == 0 ) {
			// orthogonal
			vectorV[2] = 1.0;
		}
		else {
			// perspective
			// viewer at (0, 0, 0)
			vectorV = symmetric(pointP);	// quero vector do ponto para o observador
		}
		
		normalize(vectorV);
		 

		var vectorH = add(vectorL, vectorV);
		
		normalize(vectorH);
        
		var cosNH = dotProduct(vectorN, vectorH);
		
		if (cosNH < 0.0 || cosNL <= 0.0 ) {
			cosNH = 0.0;
		}

        // Compute the color values and store in the colors array
        
		// Copy ambient lighting
		// Copy difuse lighting
		for (var i = 0; i < 3; i++) {
			Tcolors[vertIndex + i] = ambientTerm[i];
			
			Tcolors[vertIndex + i] += (diffuseTerm[i] * cosNL);

			Tcolors[vertIndex + i] += (specularTerm[i] * Math.pow(cosNH, nPhong));
		}
		

		// Avoid exceeding 1.0
    }
	// Associating the data to the vertex shader
	
	// This can be done in a better way !!

	initBuffersBorda();

	if( primitiveType == gl.LINE_LOOP ) {
		
		// To simulate wireframe drawing!
		
		// No faces are defined! There are no hidden lines!
		
		// Taking the vertices 3 by 3 and drawing a LINE_LOOP
		
		var i;
		
		for( i = 0; i < bordaVertexPositionBuffer.numItems / 3; i++ ) {
		
			gl.drawArrays( primitiveType, 3 * i, 3 ); 
		}
	}	
	else {
				
		gl.drawArrays(primitiveType, 0, bordaVertexPositionBuffer.numItems); 
		
	}	
}

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
		/* pos_Viewer[0] = pos_Viewer[1] = pos_Viewer[3] = 0.0;
		
		pos_Viewer[2] = 1.0; */
		
		// Allow the user to control the size of the view volume
	}
	else {	

		// A standard view volume.
		
		// Viewer is at (0,0,0)
		
		// Ensure that the model is "inside" the view volume
		
		pMatrix = perspective( 45, 1, 0.05, 10 );
		
		tz = -2.25;

		/* pos_Viewer[0] = pos_Viewer[1] = pos_Viewer[2] = 0.0;
		
		pos_Viewer[3] = 1.0;  */

	}
	
	// Passing the Projection Matrix to apply the current projection
	
	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	
	gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));

	/* gl.uniform4fv( gl.getUniformLocation(shaderProgram, "viewerPosition"),
        flatten(pos_Viewer) ); */
	
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
	
	drawModelBorda(angleXX, angleYY, angleZZ,
		sx, sy, sz,
		tx, ty, tz,
		mvMatrix,
		primitiveType );

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
				
			}else if(!tabuleiro.currentTeam && ((angleXX%360 < 40 || angleXX%360 > 45 ) && (Math.abs(angleXX%360) < 320 || Math.abs(angleXX%360) > 325))){
				angleXX += rotationXX_DIR * rotationXX_SPEED * (90 * elapsed) / 1000.0;
				//console.log("x: "+Math.abs(angleXX%360))
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
			//console.log("z: "+Math.abs(angleZZ%360));
			if(tabuleiro.currentTeam && (angleZZ%360 < 180 || angleZZ%360 > 185)){
				angleZZ += rotationZZ_DIR * rotationZZ_SPEED * (70 * elapsed) / 1000.0;
			}/* else if (angleZZ%360 > 180 && angleZZ%360 < 183){
				tabuleiro.jogou = false;
				rotationZZ_ON = 0;
			} */

			else if(!tabuleiro.currentTeam && (Math.abs(angleZZ%360) < 0 || Math.abs(angleZZ%360) > 4)){
				angleZZ += rotationZZ_DIR * rotationZZ_SPEED * (70 * elapsed) / 1000.0;

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


