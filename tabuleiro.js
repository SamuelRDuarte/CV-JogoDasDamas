class Tabuleiro {

	constructor( ) {
		//dimensões do quadrado
		var squareW=1.0; 
		var squareH=0.4;

		//ponto central do quadrado y=0(sempre)
		var centro = -4*squareW;
		var x = centro;
		var z = centro;
		var colorBlack = true; //quadrado do canto superior esquerdo vai ser preto
		this.squares = new Array(8);
		for (var i = 0; i < this.squares.length; i++) {  //linha
			this.squares[i] = new Array(8);
			for (var j = 0; j < this.squares[i].length; j++) { //coluna
				this.squares[i][j] = new Quadrado(x,0,z,squareW,squareH, colorBlack);
				colorBlack = !colorBlack;
				x++; //passa para a proxima coluna
			}
			colorBlack = !colorBlack;
			z++; //passa para a proxima linha
			x = centro; //volta para a primeira coluna
		}

		const readTeamStartPositions = [	[0,0],[0,2],[0,4],[0,6],
											[1,1],[1,3],[1,5],[1,7],
											[2,0],[2,2],[2,4],[2,6] ];
		const begeTeamStartPositions = [	[5,1],[5,3],[5,5],[5,7],
											[6,0],[6,2],[6,4],[6,6],
											[7,1],[7,3],[7,5],[7,7] ];

		this.damas = [];
		console.log(this.squares);
		for(var i = 0; i < readTeamStartPositions.length; i++){
			//console.log(readTeamStartPositions[i]);
			var k = parseInt(readTeamStartPositions[i][0]);
			
			var j = parseInt(readTeamStartPositions[i][1]);
			
			if(typeof this.squares[0][0] != undefined){
				var coord = this.squares[k][j].getCoordenadas();
				this.damas[i] = new Damas(coord[0],coord[1],coord[2],0.5,0.5,true)
			}
		}
		
		for(var i = 0; i<begeTeamStartPositions.length; i++){
			var k = begeTeamStartPositions[i][0];
			var j = begeTeamStartPositions[i][1];

			if(typeof this.squares[0][0] != undefined){
				var coord = this.squares[k][j].getCoordenadas();
				this.damas[i+readTeamStartPositions.length] = new Damas(coord[0],coord[1],coord[2],0.5,0.5,false)
			}
		}
		console.log(this.damas);
		
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

	getDamas() {
		return this.damas;
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
		var cor = 0.75;			//trocar a ordem da cor
		if (this.colorType) {
			cor = 0.25;
		}

		var length = this.vertices.length;
		for (var i = 0; i < length; i++) {
			this.colors[i] = cor;
		}
	}

	getCoordenadas() {
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

class Damas{
	constructor(x,y,z,comp=0.5,alt=0.5, team){
		this.equipa = team;
		this.id = [x,y,z];

		this.vertices = [	x-comp/2,	y+alt,	    z+comp/2,   //P1
							x-comp/2,	y+alt,	    z-comp/2,   //P2
							x+comp/2,	y+alt,		z-comp/2,   //P3
							x+comp/2,	y+alt,		z+comp/2,   //P4
							x+comp/2,	y,	z-comp/2,   //P5
							x+comp/2,	y,	z+comp/2,   //P6
							x-comp/2,	y,	z+comp/2,   //P7
							x-comp/2,	y,	z-comp/2];  //P8
			

		this.vertexIndices = [	0,3,5,	5,6,0,	// Front (P1,P4,P6,P7)	
				1,2,4,	4,7,1,	// Back	 (P2,P3,P5,P8)   	
				0,1,2,	2,3,0,	// Top	  (P1,P2,P3,P4)  	
				6,7,4,	4,5,6,	// Bottom	(P7,P8,P5,P6)
				3,2,4,	4,5,3,	// Right    (P4,P3,P5,P6)	
				0,1,7,	7,6,0];	// Left		 (P1,P2,P8,P7)
		
		this.colors =  []
		 
		if (this.equipa) { //team 1(red)
			var length = this.vertices.length;
			for (var i = 0; i < length; i++) {
				this.colors.push(0.9);
				this.colors.push(0.0);
				this.colors.push(0.0);
			}
		}else{	//team2 (bege?)
			var length = this.vertices.length;
			for (var i = 0; i < length; i++) {
				this.colors.push(0.9);
				this.colors.push(0.9);
				this.colors.push(0.6);
			}
		}
		
	}

	getEquipa(){ return this.equipa;}

	getID(){ return this.id;}

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