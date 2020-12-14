function setEventListeners( canvas ){

    // NEW ---Handling the mouse

    // From learningwebgl.com

    canvas.onmousedown = handleMouseDown;

    document.onmouseup = handleMouseUp;

    document.onmousemove = handleMouseMove;

    // NEW ---Handling the keyboard

    // From learningwebgl.com

    // function handleKeyDown(event) {

    //     currentlyPressedKeys[event.keyCode] = true;
    // }

    // function handleKeyUp(event) {

    //     currentlyPressedKeys[event.keyCode] = false;
    // }

    // document.onkeyup = handleKeyUp;
    
    // document.onkeydown = handleKeyDown;

    document.addEventListener('keydown', function(event) {
        if (event.code == 'KeyA') {
            if(!tabuleiro.currentTeam){
                var q = tabuleiro.getoverQuadrado();
                var x = (q[1]+7)%8;
                tabuleiro.setoverQuadrado(q[0],x);
                console.log(tabuleiro.getoverQuadrado());
            }else{
                var q = tabuleiro.getoverQuadrado();
                var x = (q[1]+1)%8;
                tabuleiro.setoverQuadrado(q[0],x);
                console.log(tabuleiro.getoverQuadrado());
            }
            
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.code == 'KeyD' ) {
            if(!tabuleiro.currentTeam){
                var q = tabuleiro.getoverQuadrado();
                var x = (q[1]+1)%8;
                tabuleiro.setoverQuadrado(q[0],x);
                console.log(tabuleiro.getoverQuadrado());
            }else{
                var q = tabuleiro.getoverQuadrado();
                var x = (q[1]+7)%8;
                tabuleiro.setoverQuadrado(q[0],x);
                console.log(tabuleiro.getoverQuadrado());
            }
        }
    });
      
    document.addEventListener('keydown', function(event) {
        if (event.code == 'KeyW' ) {
            if(!tabuleiro.currentTeam){
                var q = tabuleiro.getoverQuadrado();
                var y = (q[0]+7)%8;
                tabuleiro.setoverQuadrado(y,q[1]);
                console.log(tabuleiro.getoverQuadrado());
            }else{
                var q = tabuleiro.getoverQuadrado();
                var y = (q[0]+1) % 8;
                tabuleiro.setoverQuadrado(y,q[1]);
                console.log(tabuleiro.getoverQuadrado());
            }
            
        }
    });
      
    document.addEventListener('keydown', function(event) {
        if (event.code == 'KeyS' ) {
            if(!tabuleiro.currentTeam){
                var q = tabuleiro.getoverQuadrado();
                var y = (q[0]+1) % 8;
                tabuleiro.setoverQuadrado(y,q[1]);
                console.log(tabuleiro.getoverQuadrado());
            }else{
                var q = tabuleiro.getoverQuadrado();
                var y = (q[0]+7)%8;
                tabuleiro.setoverQuadrado(y,q[1]);
                console.log(tabuleiro.getoverQuadrado());
            }
            
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.keyCode == 13 ) {
            var q = tabuleiro.getoverQuadrado();
            tabuleiro.setselectQuadrado(q[0],q[1]);
            console.log(tabuleiro.getselectQuadrado());
        }
    });

      
    
    // Dropdown lists


    var projection = document.getElementById("projection-selection");

    projection.addEventListener("click", function(){

        // Getting the selection

        var p = projection.selectedIndex;

        switch(p){

            case 0 : projectionType = 0;
                break;

            case 1 : projectionType = 1;
                break;
        }
    });

    var boardColor = document.getElementById("boardColor-selection");

    boardColor.addEventListener("click", function(){

        // Getting the selection

        var p = boardColor.selectedIndex;
        tabuleiro.changeTabuleiroColor(p);
    });

    var team1Color = document.getElementById("team1Color-selection");

    team1Color.addEventListener("click", function(){

        // Getting the selection

        var p = team1Color.selectedIndex;
        tabuleiro.changeTeam1Color(p);
        switch(p){
            case 0:
                document.getElementById("teamBege-score").style.backgroundColor = "#ff991a";
                tabuleiro.setTeam1cor("#ff991a");
                break;
            case 2:
                document.getElementById("teamBege-score").style.backgroundColor = "#B5651D";
                tabuleiro.setTeam1cor("#B5651D");
                break;
            case 1:
                document.getElementById("teamBege-score").style.backgroundColor = "gray";
                tabuleiro.setTeam1cor("gray");
                break;
            case 3:
                document.getElementById("teamBege-score").style.backgroundColor = "beige";
                tabuleiro.setTeam1cor("beige");
                break;
        }
    });

    var team2Color = document.getElementById("team2Color-selection");

    team2Color.addEventListener("click", function(){

        // Getting the selection

        var p = team2Color.selectedIndex;
        tabuleiro.changeTeam2Color(p);
        switch(p){
            case 0:
                document.getElementById("teamRead-score").style.backgroundColor = "red";
                tabuleiro.setTeam2cor("red");
                break;
            case 1:
                document.getElementById("teamRead-score").style.backgroundColor = "Blue";
                tabuleiro.setTeam2cor("Blue");
                break;
            case 2:
                document.getElementById("teamRead-score").style.backgroundColor = "Brown";
                tabuleiro.setTeam2cor("Brown");
                break;
            case 3:
                document.getElementById("teamRead-score").style.backgroundColor = "Green";
                tabuleiro.setTeam2cor("Green");
                break;
        }
    });

    // Button events

    document.getElementById("XX-on-off-button").onclick = function(){

        // Switching on / off

        if( rotationXX_ON ) {

            rotationXX_ON = 0;
        }
        else {

            rotationXX_ON = 1;
        }
    };

    document.getElementById("XX-direction-button").onclick = function(){

        // Switching the direction

        if( rotationXX_DIR == 1 ) {

            rotationXX_DIR = -1;
        }
        else {

            rotationXX_DIR = 1;
        }
    };

    document.getElementById("XX-slower-button").onclick = function(){

        rotationXX_SPEED *= 0.75;
    };

    document.getElementById("XX-faster-button").onclick = function(){

        rotationXX_SPEED *= 1.25;
    };

    document.getElementById("YY-on-off-button").onclick = function(){

        // Switching on / off

        if( rotationYY_ON ) {

            rotationYY_ON = 0;
        }
        else {

            rotationYY_ON = 1;
        }
    };

    document.getElementById("YY-direction-button").onclick = function(){

        // Switching the direction

        if( rotationYY_DIR == 1 ) {

            rotationYY_DIR = -1;
        }
        else {

            rotationYY_DIR = 1;
        }
    };

    document.getElementById("YY-slower-button").onclick = function(){

        rotationYY_SPEED *= 0.75;
    };

    document.getElementById("YY-faster-button").onclick = function(){

        rotationYY_SPEED *= 1.25;
    };

    document.getElementById("ZZ-on-off-button").onclick = function(){

        // Switching on / off

        if( rotationZZ_ON ) {

            rotationZZ_ON = 0;
        }
        else {

            rotationZZ_ON = 1;
        }
    };

    document.getElementById("ZZ-direction-button").onclick = function(){

        // Switching the direction

        if( rotationZZ_DIR == 1 ) {

            rotationZZ_DIR = -1;
        }
        else {

            rotationZZ_DIR = 1;
        }
    };

    document.getElementById("ZZ-slower-button").onclick = function(){

        rotationZZ_SPEED *= 0.75;
    };

    document.getElementById("ZZ-faster-button").onclick = function(){

        rotationZZ_SPEED *= 1.25;
    };

    document.getElementById("reset-button").onclick = function(){

        // The initial values
        resetView();
    };

    document.getElementById("reset-game").onclick = function(){
        reset();
    };

    document.getElementById("give-up").onclick = function(){
        tabuleiro.desistir();

    }

}


//----------------------------------------------------------------------------

// Handling mouse events

// Adapted from www.learningwebgl.com


var mouseDown = false;

var lastMouseX = null;

var lastMouseY = null;

function handleMouseDown(event) {

    mouseDown = true;

    lastMouseX = event.clientX;
    console.log("x: "+event.clientX)

    lastMouseY = event.clientY;
    console.log("y: "+event.clientY)
}

function handleMouseUp(event) {

    mouseDown = false;
}

function handleMouseMove(event) {

    if (!mouseDown) {

        return;
    }

    // Rotation angles proportional to cursor displacement

    var newX = event.clientX;

    var newY = event.clientY;

    var deltaX = newX - lastMouseX;

    angleYY += radians( 10 * deltaX  )

    var deltaY = newY - lastMouseY;

    angleXX += radians( 10 * deltaY  )
    lastMouseX = newX

    lastMouseY = newY;
}

//----------------------------------------------------------------------------

// Handling keyboard events

// Adapted from www.learningwebgl.com

var currentlyPressedKeys = {};

function handleKeys() {

    
      
    // if (currentlyPressedKeys[65] || currentlyPressedKeys[97]) {

    //     // Move Left key a
    //     var q = tabuleiro.getoverQuadrado();
    //     var x = (q[1]+7)%8;
    //     tabuleiro.setoverQuadrado(q[0],x);
    //     console.log(tabuleiro.getoverQuadrado());
        
        
    // }
    // if (currentlyPressedKeys[68] || currentlyPressedKeys[100]){

    //     // Move Right key d
    //     var q = tabuleiro.getoverQuadrado();
    //     var x = (q[1]+1)%8;
    //     tabuleiro.setoverQuadrado(q[0],x);
    //     console.log(tabuleiro.getoverQuadrado());
        
    // }
    // if (currentlyPressedKeys[87] || currentlyPressedKeys[119]) {

    //     // Move Up key  w
    //     var q = tabuleiro.getoverQuadrado();
    //     var y = (q[0]+7)%8;
    //     tabuleiro.setoverQuadrado(y,q[1]);
    //     console.log(tabuleiro.getoverQuadrado());
        
    // }
    // if (currentlyPressedKeys[83] || currentlyPressedKeys[115]) {

    //     // Move Down key s
    //     var q = tabuleiro.getoverQuadrado();
    //     var y = (q[0]+1) % 8;
    //     tabuleiro.setoverQuadrado(y,q[1]);
    //     console.log(tabuleiro.getoverQuadrado());
       
    // }
    // if (currentlyPressedKeys[13]){
    //     var q = tabuleiro.getoverQuadrado();
    //     tabuleiro.setselectQuadrado(q[0],q[1]);
    //     console.log(tabuleiro.getselectQuadrado());
    // }
}
