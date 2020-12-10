class Tabuleiro {

	constructor( ) {
		//dimensões do quadrado
		var squareW=1.0; 
		var squareH=0.4;

		//ponto central do quadrado y=0(sempre)
		var centro = -4*squareW;
		var x = centro;
		var z = centro;
		var color = true;
		this.squares = new Array(8);
		for (var i = 0; i < this.squares.length; i++) {  //linha
			this.squares[i] = new Array(8);
			for (var j = 0; j < this.squares[i].length; j++) { //coluna
				this.squares[i][j] = new Quadrado(x,0,z,squareW,squareH, color);
				color = !color;
				x++; //passa para a proxima coluna
			}
			color = !color;
			z++; //passa para a proxima linha
			x = centro; //volta para a primeira coluna
		}

		
	}

	getSquaresVertices() {
		var vertices = new Array();
		for (var i = 0; i < this.squares.length; i++) {
			for (var j = 0; j < this.squares[i].length; j++) {
				retVal.push(squares[i][j].getVertices());
			}
		}
		return vertices;
	}

	getSquares() {
		return this.squares;
	}

}

class Quadrado {

	// colorBool is boolean for there are two and only two colors
	// x, y and z are idCoord (center of top face)
	// s is side
	// h is height
	constructor(x ,y=0.0,z ,comp=1.0,alt=0.5, color) {
		this.colorType = color;
		this.id = [x,y,z];
		this.vertices = [	x-comp/2,	y,	    z+comp/2,   //P1
							x-comp/2,	y,	    z-comp/2,   //P2
							x+comp/2,	y,		z-comp/2,   //P3
							x+comp/2,	y,		z+comp/2,   //P4
							x+comp/2,	y-alt,	z-comp/2,   //P5
							x+comp/2,	y-alt,	z+comp/2,   //P6
							x-comp/2,	y-alt,	z+comp/2,   //P7
                            x-comp/2,	y-alt,	z-comp/2];  //P8
                            
		
		this.vertexIndices = [	0,3,5,	5,6,0,	// Front (P1,P4,P6,P7)	
								1,2,4,	4,7,1,	// Back	 (P2,P3,P5,P8)   	
								0,1,2,	2,3,0,	// Top	  (P1,P2,P3,P4)  	
								6,7,4,	4,5,6,	// Bottom	(P7,P8,P5,P6)
								3,2,4,	4,5,3,	// Right    (P4,P3,P5,P6)	
								0,1,7,	7,6,0];	// Left		 (P1,P2,P8,P7)

		this.colors =  []
		var cor = 0.25;			//trocar a ordem da cor
		if (this.colorType) {
			cor = 0.75;
		}

		var length = this.vertices.length;
		for (var i = 0; i < length; i++) {
			this.colors[i] = cor;
		}
	}

	getID() {
		return this.id;
	}

	getColorType() {
		return this.colorType;
	}

	getVertices() {
		return this.vertices;
	}

	getVertexIndices() {
		return this.vertexIndices;
	}

	getColors() {
		return this.colors;
	}
}