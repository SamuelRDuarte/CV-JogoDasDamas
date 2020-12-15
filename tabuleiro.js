class Tabuleiro {

	constructor( ) {
		this.overQuadrado = [7,0]; //[linha,coluna]
		//dimensões do quadrado
		var squareW=1.0; 
		var squareH=0.4;
		this.jogou = false;
		this.vertices = [];
		this.colors = [];
		this.normalVertices = [];

		//ponto central do quadrado y=0(sempre)
		var centro = -4*squareW;
		var x = centro;
		var z = centro;
		var colorBlack = true; //quadrado do canto superior esquerdo vai ser preto
		
		this.slotsOcupados = new Array(8);
		this.selectedSquare = null;

		this.currentTeam = false; //false -> equipa branca
		this.Team1cor = "#ff991a";
		this.Team2cor = "Red";
		this.pecasPerdidasRead = [];
		this.pecasPerdidasBege = [];

		this.winner = null;
		
		this.squares = new Array(8);
		for (var i = 0; i < this.squares.length; i++) {  //linha
			this.squares[i] = new Array(8);
			this.slotsOcupados[i] = new Array(8);
			for (var j = 0; j < this.squares[i].length; j++) { //coluna
				this.squares[i][j] = new Quadrado(x,0,z,squareW,squareH, colorBlack);
				colorBlack = !colorBlack;
				x++; //passa para a proxima coluna
			}
			colorBlack = !colorBlack;
			z++; //passa para a proxima linha
			x = centro; //volta para a primeira coluna
		}
		this.selectedQuadrado = null;
		this.possiblePlays = new Array();

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
				this.damas[i] = new Damas(coord[0],coord[1],coord[2],0.5,0.5,true);
				this.slotsOcupados[k][j] = this.damas[i];
			}
		}
		
		for(var i = 0; i<begeTeamStartPositions.length; i++){
			var k = begeTeamStartPositions[i][0];
			var j = begeTeamStartPositions[i][1];

			if(typeof this.squares[0][0] != undefined){
				var coord = this.squares[k][j].getCoordenadas();
				this.damas[i+readTeamStartPositions.length] = new Damas(coord[0],coord[1],coord[2],0.5,0.5,false);
				this.slotsOcupados[k][j] = this.damas[i+readTeamStartPositions.length];
			}
		}
		console.log(this.damas);
		this.setVertices();
		this.setColors();
		this.setNormalVertices();
		
	}

	desistir(){
		this.winner = !this.currentTeam;
	}


	setWinner(){
		if(this.pecasPerdidasBege.length == 12){
			this.winner = true;
		}
		else if(this.pecasPerdidasRead.length == 12){
			this.winner = false;
		}
	}

	getVertices(){ return this.vertices;}

	getColors() { return this.colors;}

	getNormalVertices() { return this.normalVertices;}

	getWinner(){
		return this.winner;
	}

	getScore(){
		return [this.pecasPerdidasRead.length, this.pecasPerdidasBege.length];
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

	getoverQuadrado(){ return this.overQuadrado;}

	setoverQuadrado(x,y){
		var old = this.overQuadrado;
		this.overQuadrado = [x,y];
		var q = this.squares[x][y];
		var old_q = this.squares[old[0]][old[1]];
		if(!this.checkinPossiblePlay(old[0],old[1])){ //se não tiver nas PossiblePlays faz reset há cor
			console.log("old: "+old);
			console.log("positions: "+this.possiblePlays);
			old_q.changeColor(true);
		}else{										//else mantém a cor de selecionado
			old_q.changeColorSelected(false);
		}
		q.changeColor(false);
		console.log(q);
		//initBuffersQuadrado(q);
		//initBuffersQuadrado(old_q);
	}

	setselectQuadrado(x,y){

		//console.log(this.slotsOcupados[x][y].getEquipa());
		if(this.selectedQuadrado == null){		
			if(this.slotsOcupados[x][y] != null && this.slotsOcupados[x][y].getEquipa() == this.currentTeam){
				this.selectedQuadrado = this.overQuadrado;
				var q = this.squares[this.selectedQuadrado[0]][this.selectedQuadrado[1]];
				var dama = this.slotsOcupados[this.selectedQuadrado[0]][this.selectedQuadrado[1]];
				//dama.apagarDama();
				q.changeColorSelected(false);	
				this.getPossiblePlays(this.selectedQuadrado[0],this.selectedQuadrado[1]);	
				
			}		
		}else{
			console.log("else");
			
			if(this.checkinPossiblePlay(this.overQuadrado[0], this.overQuadrado[1])){
				this.jogada(this.selectedQuadrado, this.overQuadrado);
				console.log("read: "+this.pecasComidasRead);
				console.log("bege: "+this.pecasComidasBege);
			}
			this.deselectQuadrado();
		}	
		
	}

	jogada(slotinicial, slotfinal){
		var dama = this.slotsOcupados[slotinicial[0]][slotinicial[1]];
		var coords = this.squares[slotfinal[0]][slotfinal[1]].getCoordenadas();
		dama.setCoordenadas(coords,0.5,0.5);
		this.slotsOcupados[slotinicial[0]][slotinicial[1]] = null;
		this.slotsOcupados[slotfinal[0]][slotfinal[1]] = dama;
		var damaCapturada = null;
		if(Math.abs(slotfinal[1]-slotinicial[1]) == 2){//houve captura
			console.log("Captura");
			if(!this.currentTeam){ //equipa branca
				console.log("result: "+(slotfinal[1]-slotinicial[1]))
				if(slotinicial[1]-slotfinal[1] == 2){
					damaCapturada = this.slotsOcupados[slotinicial[0]-1][slotinicial[1]-1];
					this.slotsOcupados[slotinicial[0]-1][slotinicial[1]-1] = null; //tirar peça do tabuleiro
				}
				else if(slotinicial[1]-slotfinal[1] == -2){
					damaCapturada = this.slotsOcupados[slotinicial[0]-1][slotinicial[1]+1];
					this.slotsOcupados[slotinicial[0]-1][slotinicial[1]+1] = null; //tirar peça do tabuleiro
				}
				console.log("DAMA_Red: "+ damaCapturada);
				this.pecasPerdidasRead.push(damaCapturada);
			}else{
				if(slotinicial[1]-slotfinal[1] == 2){
					damaCapturada = this.slotsOcupados[slotinicial[0]+1][slotinicial[1]-1];
					this.slotsOcupados[slotinicial[0]+1][slotinicial[1]-1] = null; //tirar peça do tabuleiro
				}
				else if(slotinicial[1]-slotfinal[1] == -2){
					damaCapturada = this.slotsOcupados[slotinicial[0]+1][slotinicial[1]+1];
					this.slotsOcupados[slotinicial[0]+1][slotinicial[1]+1] = null; //tirar peça do tabuleiro
				}
				this.pecasPerdidasBege.push(damaCapturada);
			}
			damaCapturada.apagarDama(); 
		}

		this.currentTeam = !this.currentTeam;
		this.jogou = true;
		this.setWinner();
	}

	deselectQuadrado(){
		for(var i =0; i < this.possiblePlays.length;i++){
			var temp = this.possiblePlays[i];
			var removeColorPossible = this.squares[temp[0]][temp[1]];
			removeColorPossible.changeColorSelected(true);
		}
		this.possiblePlays = []; 
		var q = this.squares[this.selectedQuadrado[0]][this.selectedQuadrado[1]];
		q.changeColorSelected(true);
		this.selectedQuadrado = null;
	}

	getselectQuadrado(){
		return this.selectedQuadrado;
	}

	checkinPossiblePlay(z,x){
		for(var i =0; i < this.possiblePlays.length;i++){
			var temp = this.possiblePlays[i];
			if(z == temp[0] && x == temp[1]){
				return true;
			}
		}
		return false;
	}

	checkPosition(z,x){
		if(z < 0 || z > 7 || x < 0|| x > 7){
			return false;
		}
		else{
			return true;
		}
	}

	getPossiblePlays(z,x){
		if(!this.currentTeam){ //equipa branca
			if(this.checkPosition(z-1,x-1)){
				if(this.slotsOcupados[z-1][x-1] == null){
					this.possiblePlays.push([z-1,x-1]);
					var q = this.squares[this.selectedQuadrado[0]-1][this.selectedQuadrado[1]-1];
					q.changeColorSelected(false); 
				}
				else if(this.checkPosition(z-2,x-2)){
					if(this.slotsOcupados[z-2][x-2] == null && this.slotsOcupados[z-1][x-1].getEquipa() != this.currentTeam){
						this.possiblePlays.push([z-2,x-2]);
						var q = this.squares[this.selectedQuadrado[0]-2][this.selectedQuadrado[1]-2];
						q.changeColorSelected(false); 
					}	
				}		
			}
			
			if(this.checkPosition(z-1,x+1)){
				if(this.slotsOcupados[z-1][x+1] == null){
					this.possiblePlays.push([z-1,x+1]);
					var q = this.squares[this.selectedQuadrado[0]-1][this.selectedQuadrado[1]+1];
					console.log(q);
					q.changeColorSelected(false); 
				}
				else if(this.checkPosition(z-2,x+2)){
					if(this.slotsOcupados[z-2][x+2] == null && this.slotsOcupados[z-1][x+1].getEquipa() != this.currentTeam){
						this.possiblePlays.push([z-2, x+2]);
						var q = this.squares[this.selectedQuadrado[0]-2][this.selectedQuadrado[1]+2];
						q.changeColorSelected(false); 
					}	
				}
			}
			
		}else{ //equipa vermelha

			if(this.checkPosition(z+1,x-1)){
				if(this.slotsOcupados[z+1][x-1] == null){
					this.possiblePlays.push([z+1,x-1]);
					var q = this.squares[this.selectedQuadrado[0]+1][this.selectedQuadrado[1]-1];
					q.changeColorSelected(false); 
				}
				else if(this.checkPosition(z+2,x-2)){
					if(this.slotsOcupados[z+2][x-2] == null && this.slotsOcupados[z+1][x-1].getEquipa() != this.currentTeam){
						this.possiblePlays.push([z+2,x-2]);
						var q = this.squares[this.selectedQuadrado[0]+2][this.selectedQuadrado[1]-2];
						q.changeColorSelected(false); 
					}	
				}
			}

			if(this.checkPosition(z+1,x+1)){
				if(this.slotsOcupados[z+1][x+1] == null){
					this.possiblePlays.push([z+1,x+1]);
					var q = this.squares[this.selectedQuadrado[0]+1][this.selectedQuadrado[1]+1];
					console.log(q);
					q.changeColorSelected(false); 
				}
				else if(this.checkPosition(z+2,x+2)){
					if(this.slotsOcupados[z+2][x+2] == null && this.slotsOcupados[z+1][x+1].getEquipa() != this.currentTeam){
						this.possiblePlays.push([z+2, x+2]);
						var q = this.squares[this.selectedQuadrado[0]+2][this.selectedQuadrado[1]+2];
						q.changeColorSelected(false); 
					}	
				}
			}
			
		}

	}

	changeTabuleiroColor(cor){
		for(var i = 0; i < this.squares.length; i++){
			var linha = this.squares[i];
			for(var j = 0; j < linha.length; j++){
				linha[j].setCor(cor);
			}
		}
	}

	changeTeam1Color(cor){
		for(var i = 0; i < this.damas.length; i++){
			if(!this.damas[i].getEquipa()){
				this.damas[i].setCor(cor);
			}
		}
	}

	changeTeam2Color(cor){
		for(var i = 0; i < this.damas.length; i++){
			if(this.damas[i].getEquipa()){
				this.damas[i].setCor(cor);
			}
		}
	}

	getTeam1cor() { return this.Team1cor;}

	setTeam1cor(cor) { this.Team1cor = cor;}

	getTeam2cor() { return this.Team2cor;}
	setTeam2cor(cor) { this.Team2cor = cor;}

	setVertices(x=-0.5,y=-0.3,z=-0.5,comp=10,alt=0.5){
		this.vertices = [	//FRONT
			x-comp/2,	y,	    z+comp/2,   //P1
			x+comp/2,	y,		z+comp/2,   //P4
			x+comp/2,	y-alt,	z+comp/2,   //P6

			x+comp/2,	y-alt,	z+comp/2,   //P6
			x-comp/2,	y-alt,	z+comp/2,   //P7
			x-comp/2,	y,	    z+comp/2,   //P1

			//BACK
			x-comp/2,	y,	    z-comp/2,   //P2
			x+comp/2,	y,		z-comp/2,   //P3
			x+comp/2,	y-alt,	z-comp/2,   //P5
			
			x+comp/2,	y-alt,	z-comp/2,   //P5
			x-comp/2,	y-alt,	z-comp/2,
			x-comp/2,	y,	    z-comp/2,   //P2

			//TOP
			x-comp/2,	y,	    z+comp/2,   //P1
			x-comp/2,	y,	    z-comp/2,   //P2
			x+comp/2,	y,		z-comp/2,   //P3

			x+comp/2,	y,		z-comp/2,   //P3
			x+comp/2,	y,		z+comp/2,   //P4
			x-comp/2,	y,	    z+comp/2,   //P1

			//BOTTOM
			x-comp/2,	y-alt,	z+comp/2,   //P7
			x-comp/2,	y-alt,	z-comp/2,  //P8
			x+comp/2,	y-alt,	z-comp/2,   //P5

			x+comp/2,	y-alt,	z-comp/2,   //P5
			x+comp/2,	y-alt,	z+comp/2,   //P6
			x-comp/2,	y-alt,	z+comp/2,   //P7

			//RIGHT
			x+comp/2,	y,		z+comp/2,   //P4
			x+comp/2,	y,		z-comp/2,   //P3
			x+comp/2,	y-alt,	z-comp/2,   //P5

			x+comp/2,	y-alt,	z-comp/2,   //P5
			x+comp/2,	y-alt,	z+comp/2,   //P6
			x+comp/2,	y,		z+comp/2,   //P4

			//LEFT
			x-comp/2,	y,	    z+comp/2,   //P1
			x-comp/2,	y,	    z-comp/2,   //P2
			x-comp/2,	y-alt,	z-comp/2,  //P8

			x-comp/2,	y-alt,	z-comp/2,  //P8
			x-comp/2,	y-alt,	z+comp/2,   //P7
			x-comp/2,	y,	    z+comp/2];   //P1 
	}

	setNormalVertices(){
		computeVertexNormals(this.vertices,this.normalVertices);
	}
	setColors(){
		for(var i = 0; i< this.vertices.length; i+=3){
			this.colors[i] = (149/255);
			this.colors[i+1] = (122/255);
			this.colors[i+2] = (86/255);
		}
	}
}

class Quadrado {

	// colorBool is boolean for there are two and only two colors
	// x, y and z are idCoord (center of top face)
	// s is side
	// h is height
	constructor(x ,y=0.0,z ,comp=1.0,alt=0.5, color,corid=0) {
		this.colorBlack = color;
		this.id = [x,y,z];
		this.corID = corid;
		this.vertices = [];
		/* this.vertices = [	x-comp/2,	y,	    z+comp/2,   //P1
							x-comp/2,	y,	    z-comp/2,   //P2
							x+comp/2,	y,		z-comp/2,   //P3
							x+comp/2,	y,		z+comp/2,   //P4
							x+comp/2,	y-alt,	z-comp/2,   //P5
							x+comp/2,	y-alt,	z+comp/2,   //P6
							x-comp/2,	y-alt,	z+comp/2,   //P7
                            x-comp/2,	y-alt,	z-comp/2];  //P8 */
		
		this,this.setVertices(x,y,z,comp,alt);
		
		/* this.vertexIndices = [	0,3,5,	5,6,0,	// Front (P1,P4,P6,P7)	
								1,2,4,	4,7,1,	// Back	 (P2,P3,P5,P8)   	
								0,1,2,	2,3,0,	// Top	  (P1,P2,P3,P4)  	
								6,7,4,	4,5,6,	// Bottom	(P7,P8,P5,P6)
								3,2,4,	4,5,3,	// Right    (P4,P3,P5,P6)	
								0,1,7,	7,6,0];	// Left		 (P1,P2,P8,P7) */

		this.colors =  []
		this.setCor(corid)
		
	}

	setCor(corid){
		this.corID = corid;
		if(this.colorBlack){
			switch(corid){
				case 1://blue
					this.setColors([0.0, 0.0, 1.0]);
					break;
				case 2://castanho escuro
					this.setColors([0.40, 0.26, 0.13]);
					break;
				case 3: //verde escuro
					this.setColors([0.4, 0.5, 0.4]);
					break;
				default://preto
					this.setColors([0.25,0.25,0.25]);
					break;
			}
		}else{
			switch(corid){
				case 1://cinzento
					this.setColors([0.6, 0.6, 0.7]);
					break;
				case 2://castanho claro
					this.setColors([0.7, 0.5, 0]);
					break;
				case 3: //branco
					this.setColors([1,1,1]);
					break;
				default://branco
					this.setColors([1,1,1]);
					break;
			}
		}
	}

	setColors(cor){
		/* var cor = 0.75;			//trocar a ordem da cor
		if (this.colorBlack) {
			cor = 0.25;
		} */

		var length = this.vertices.length;
		for (var i = 0; i < length; i+=3) {
			this.colors[i] = cor[0];
			this.colors[i+1] = cor[1];
			this.colors[i+2] = cor[2];
		}
	}

	getCoordenadas() {
		return this.id;
	}

	getColorBlack() {
		return this.colorBlack;
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

	changeColor(reset){
		if(reset){
			/* var cor = 0.75;
			if (this.colorBlack) {
				cor = 0.25;
			}
			for (var i = 0; i < this.colors.length; i++) {
				this.colors[i] = cor;
			} */
			this.setCor(this.corID);
		}else{
			for(var i = 0; i < this.colors.length; i+=3){
				this.colors[i] = 0.6;
				this.colors[i+1] = 0.1;
				this.colors[i+2] = 0.9; 
			}
		}
		
	}

	changeColorSelected(reset){
		if(reset){
			/* var cor = 0.75;			//trocar a ordem da cor
			if (this.colorBlack) {
				cor = 0.25;
			}

			var length = this.vertices.length;
			for (var i = 0; i < length; i++) {
				this.colors[i] = cor;
			} */
			this.setCor(this.corID);
		}else{
			for(var i = 0; i < this.colors.length; i+=3){
				this.colors[i] = 0.1;
				this.colors[i+1] = 1;
				this.colors[i+2] = 0.1; 
			}
		}
	}

	setVertices(x,y,z,comp,alt){
		this.vertices = [	//FRONT
			x-comp/2,	y,	    z+comp/2,   //P1
			x+comp/2,	y,		z+comp/2,   //P4
			x+comp/2,	y-alt,	z+comp/2,   //P6

			x+comp/2,	y-alt,	z+comp/2,   //P6
			x-comp/2,	y-alt,	z+comp/2,   //P7
			x-comp/2,	y,	    z+comp/2,   //P1

			//BACK
			x-comp/2,	y,	    z-comp/2,   //P2
			x+comp/2,	y,		z-comp/2,   //P3
			x+comp/2,	y-alt,	z-comp/2,   //P5
			
			x+comp/2,	y-alt,	z-comp/2,   //P5
			x-comp/2,	y-alt,	z-comp/2,
			x-comp/2,	y,	    z-comp/2,   //P2

			//TOP
			x-comp/2,	y,	    z+comp/2,   //P1
			x-comp/2,	y,	    z-comp/2,   //P2
			x+comp/2,	y,		z-comp/2,   //P3

			x+comp/2,	y,		z-comp/2,   //P3
			x+comp/2,	y,		z+comp/2,   //P4
			x-comp/2,	y,	    z+comp/2,   //P1

			//BOTTOM
			x-comp/2,	y-alt,	z+comp/2,   //P7
			x-comp/2,	y-alt,	z-comp/2,  //P8
			x+comp/2,	y-alt,	z-comp/2,   //P5

			x+comp/2,	y-alt,	z-comp/2,   //P5
			x+comp/2,	y-alt,	z+comp/2,   //P6
			x-comp/2,	y-alt,	z+comp/2,   //P7

			//RIGHT
			x+comp/2,	y,		z+comp/2,   //P4
			x+comp/2,	y,		z-comp/2,   //P3
			x+comp/2,	y-alt,	z-comp/2,   //P5

			x+comp/2,	y-alt,	z-comp/2,   //P5
			x+comp/2,	y-alt,	z+comp/2,   //P6
			x+comp/2,	y,		z+comp/2,   //P4

			//LEFT
			x-comp/2,	y,	    z+comp/2,   //P1
			x-comp/2,	y,	    z-comp/2,   //P2
			x-comp/2,	y-alt,	z-comp/2,  //P8

			x-comp/2,	y-alt,	z-comp/2,  //P8
			x-comp/2,	y-alt,	z+comp/2,   //P7
			x-comp/2,	y,	    z+comp/2];   //P1 
	}

	
}

class Damas{
	constructor(x,y,z,comp=0.5,alt=0.5, team){
		this.equipa = team;
		this.id = [x,y,z];
		this.vertices = [];

		/* this.vertices = [	x-comp/2,	y+alt,	    z+comp/2,   //P1
							x-comp/2,	y+alt,	    z-comp/2,   //P2
							x+comp/2,	y+alt,		z-comp/2,   //P3
							x+comp/2,	y+alt,		z+comp/2,   //P4
							x+comp/2,	y,	z-comp/2,   //P5
							x+comp/2,	y,	z+comp/2,   //P6
							x-comp/2,	y,	z+comp/2,   //P7
							x-comp/2,	y,	z-comp/2];  //P8 */
		this.setVertices(x,y,z,comp,alt);

		/* this.vertexIndices = [	0,3,5,	5,6,0,	// Front (P1,P4,P6,P7)	
				1,2,4,	4,7,1,	// Back	 (P2,P3,P5,P8)   	
				0,1,2,	2,3,0,	// Top	  (P1,P2,P3,P4)  	
				6,7,4,	4,5,6,	// Bottom	(P7,P8,P5,P6)
				3,2,4,	4,5,3,	// Right    (P4,P3,P5,P6)	
				0,1,7,	7,6,0];	// Left		 (P1,P2,P8,P7) */
		
		this.colors =  [];
		this.setCor(0);
		 
		/* if (this.equipa) { //team 1(red)
			var length = this.vertices.length;
			for (var i = 0; i < length; i++) {
				this.colors.push(0.9);
				this.colors.push(0.0);
				this.colors.push(0.0);
			}
		}else{	//team2 (bege?)
			var length = this.vertices.length;
			for (var i = 0; i < length; i++) {
				this.colors.push(1.0);
				this.colors.push(0.6);
				this.colors.push(0.1);
			}
		} */
		
	}

	apagarDama(){
		this.vertices = [];
		this.colors = [];
	}

	setCoordenadas(slot){
		this.id = slot;
		this.setVertices(slot[0],slot[1], slot[2], 0.5,0.5);
	}

	getEquipa(){ return this.equipa;}

	getCoordenadas(){ return this.id;}

	getVertices() {
		return this.vertices;
	}

	getVertexIndices() {
		return this.vertexIndices;
	}

	getColors() {
		return this.colors;
	}

	setCor(corid){
		this.corID = corid;
		if(this.equipa){
			switch(corid){
				case 1://blue
					this.setColors([0.0, 0.0, 1.0]);
					break;
				case 2://castanho escuro
					this.setColors([0.40, 0.26, 0.13]);
					break;
				case 3: //verde escuro
					this.setColors([0.4, 0.5, 0.4]);
					break;
				default://red
					this.setColors([0.9,0.0,0.0]);
					break;
			}
		}else{
			switch(corid){
				case 1://cinzento
					this.setColors([0.6, 0.6, 0.7]);
					break;
				case 2://castanho claro
					this.setColors([0.7, 0.5, 0]);
					break;
				case 3: //beige
					this.setColors([0.9,0.9,0.6]);
					break;
				default://orange
					this.setColors([1,0.6,0.1]);
					break;
			}
		}
	}

	setColors(cor){
		/* var cor = 0.75;			//trocar a ordem da cor
		if (this.colorBlack) {
			cor = 0.25;
		} */

		var length = this.vertices.length;
		for (var i = 0; i < length; i+=3) {
			this.colors[i] = cor[0];
			this.colors[i+1] = cor[1];
			this.colors[i+2] = cor[2];
		}
	}

	setVertices(x,y,z,comp,alt){
		this.vertices = [	//FRONT
			x-comp/2,	y+alt,	    z+comp/2,   //P1
			x+comp/2,	y+alt,		z+comp/2,   //P4
			x+comp/2,	y,	z+comp/2,   //P6

			x+comp/2,	y,	z+comp/2,   //P6
			x-comp/2,	y,	z+comp/2,   //P7
			x-comp/2,	y+alt,	    z+comp/2,   //P1

			//BACK
			x-comp/2,	y+alt,	    z-comp/2,   //P2
			x+comp/2,	y+alt,		z-comp/2,   //P3
			x+comp/2,	y,	z-comp/2,   //P5
			
			x+comp/2,	y,	z-comp/2,   //P5
			x-comp/2,	y,	z-comp/2,
			x-comp/2,	y+alt,	    z-comp/2,   //P2

			//TOP
			x-comp/2,	y+alt,	    z+comp/2,   //P1
			x-comp/2,	y+alt,	    z-comp/2,   //P2
			x+comp/2,	y+alt,		z-comp/2,   //P3

			x+comp/2,	y+alt,		z-comp/2,   //P3
			x+comp/2,	y+alt,		z+comp/2,   //P4
			x-comp/2,	y+alt,	    z+comp/2,   //P1

			//BOTTOM
			x-comp/2,	y,	z+comp/2,   //P7
			x-comp/2,	y,	z-comp/2,  //P8
			x+comp/2,	y,	z-comp/2,   //P5

			x+comp/2,	y,	z-comp/2,   //P5
			x+comp/2,	y,	z+comp/2,   //P6
			x-comp/2,	y,	z+comp/2,   //P7

			//RIGHT
			x+comp/2,	y+alt,		z+comp/2,   //P4
			x+comp/2,	y+alt,		z-comp/2,   //P3
			x+comp/2,	y,	z-comp/2,   //P5

			x+comp/2,	y,	z-comp/2,   //P5
			x+comp/2,	y,	z+comp/2,   //P6
			x+comp/2,	y+alt,		z+comp/2,   //P4

			//LEFT
			x-comp/2,	y+alt,	    z+comp/2,   //P1
			x-comp/2,	y+alt,	    z-comp/2,   //P2
			x-comp/2,	y,	z-comp/2,  //P8

			x-comp/2,	y,	z-comp/2,  //P8
			x-comp/2,	y,	z+comp/2,   //P7
			x-comp/2,	y+alt,	    z+comp/2];   //P1 
	}

	
}