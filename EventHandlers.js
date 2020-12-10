function setEventListeners( canvas ){

    // NEW ---Handling the mouse

    // From learningwebgl.com

    canvas.onmousedown = handleMouseDown;

    document.onmouseup = handleMouseUp;

    document.onmousemove = handleMouseMove;

    // NEW ---Handling the keyboard

    // From learningwebgl.com

    function handleKeyDown(event) {

        currentlyPressedKeys[event.keyCode] = true;
    }

    function handleKeyUp(event) {

        currentlyPressedKeys[event.keyCode] = false;
    }

    document.onkeydown = handleKeyDown;

    document.onkeyup = handleKeyUp;

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
    };


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

    lastMouseY = event.clientY;
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

    if (currentlyPressedKeys[33]) {

        // Page Up

        sx *= 0.9;

        sz = sy = sx;
    }
    if (currentlyPressedKeys[34]) {

        // Page Down

        sx *= 1.1;

        sz = sy = sx;
    }
    if (currentlyPressedKeys[37]) {

        // Left cursor key

        if( rotationYY_ON == 0 ) {

            rotationYY_ON = 1;
        }

        rotationYY_SPEED -= 0.25;
    }
    if (currentlyPressedKeys[39]) {

        // Right cursor key

        if( rotationYY_ON == 0 ) {

            rotationYY_ON = 1;
        }

        rotationYY_SPEED += 0.25;
    }
    if (currentlyPressedKeys[38]) {

        // Up cursor key

        if( rotationXX_ON == 0 ) {

            rotationXX_ON = 1;
        }

        rotationXX_SPEED -= 0.25;
    }
    if (currentlyPressedKeys[40]) {

        // Down cursor key

        if( rotationXX_ON == 0 ) {

            rotationXX_ON = 1;
        }

        rotationXX_SPEED += 0.25;
    }
}
