import { Pathfinder } from "./pathfinder.js";

class Character{
	constructor(name, x, y, imgURL){
		this.name = name;
		this.x = x; //In grid units
		this.y = y; //In grid units
		this._xPixel;
		this._yPixel;
		this.destX = x;
		this.destY = y;
		this.prevX = x;
		this.prevY = y;
		this.stepSize = 0.47;
		this._path = [];
		this.pathfinder = new Pathfinder(this);
		this.imgURL = imgURL;
		this.bitmap = null;
		this.layer = null;
	};

	
	//------------------------ Initializaion -----------------------------------------

	registerBitmap(imgCache){
		
		return new Promise( (resolve) => {
				this.bitmap = document.createElement("img");
				imgCache.set(this.imgURL, this.bitmap);
				this.bitmap.addEventListener("load",  () => { console.log(`Character ${this.name} has been loaded.`); resolve(true) });
				this.bitmap.addEventListener("error", () => { console.log(`Character ${this.name} has been loaded.`); resolve(true) });
				this.bitmap.src = this.imgURL;
			})
	};


	//------------------------ Sprite Manipulation -----------------------------------------

	
	draw(x, y){

		if(x === undefined){
			x = this._xPixel;
			y = this._yPixel;
		};

		this.layer.drawImage(this.bitmap, x - this.bitmap.width / 2, y - this.bitmap.height);
	};

	setLayer(layer){
		this.layer = layer;
	};

	setImageURL(imgURL){
		this.imgURL = imgURL;
	};



	
	//--------------------------- Pixel Manipulation ----------------------------


	getPosition(){
		return [this.x, this.y]
	};

	setPosition(x, y){
		this.x = x;
		this.y = y;
	};

	setPreviousPosition(x, y){
		this.prevX = x;
		this.prevY = y;
	};

	//All of the conversion to isometric happens in this function. All other movement and positioning uses grid unit.
	getPixelPosition(tileMap, x, y){
		
		let [xPos, yPos] = tileMap.getTileCoords(x, y);
		let charaOffSetX = -8; //An image's origin is the point on the image where it will be placed on the canvas (i.e the the top left corner).
		let charaOffSetY = 17; //we must adjust this point for the character to be placed on a canvas in a way that it will align with the center of the floor.

		return [ xPos + charaOffSetX, yPos + charaOffSetY ]
	};

	updatePixelPosition(tileMap, x, y){
		let [ xPos, yPos ] = this.getPixelPosition(tileMap, x, y);

		this._xPixel = xPos;
		this._yPixel = yPos;
	};

	stepForward(tileMap, newX, newY){

		if(this.x < this.destX){ newX = Math.min(this.x + this.stepSize, this.destX) };
		if(this.x > this.destX){ newX = Math.max(this.x - this.stepSize, this.destX) };
		if(this.y < this.destY){ newY = Math.min(this.y + this.stepSize, this.destY) };
		if(this.y > this.destY){ newY = Math.max(this.y - this.stepSize, this.destY) };

		return {x:newX, y:newY}
	};



	///--------------------------- Grid Navigation -----------------------------------------------------------


	move(tileMap){
		let newX = this.x;
		let newY = this.y;
		let oldOccupiedCells = this.getOccupiedCells(newX, newY);

		// if(this.x < this.destX){newX = this.x + this.stepSize};
		// if(this.x > this.destX){newX = this.x - this.stepSize};
		// if(this.y < this.destY){newY = this.y + this.stepSize};
		// if(this.y > this.destY){newY = this.y - this.stepSize};

		let {x, y} = this.stepForward(tileMap, newX, newY);
		newX = x;
		newY = y;

		
		let newOccupiedCells = this.getOccupiedCells(newX, newY);

		let newCells = newOccupiedCells.filter( cell1 => !oldOccupiedCells.find(cell2 => cell1[0] === cell2[0] && cell1[1] === cell2[1]) );
		let oldCells = oldOccupiedCells.filter( cell1 => !newOccupiedCells.find(cell2 => cell1[0] === cell2[0] && cell1[1] === cell2[1]) );

		this.setPosition(newX, newY);
		newCells.forEach(cell => {this.enterCell(tileMap, cell[0], cell[1])}, this);
		oldCells.forEach(cell => {this.leaveCell(tileMap, cell[0], cell[1])}, this);
	};

	setPath( newPath ){
		this._path = newPath;
	};

	isAtDestination(){
		return this.x === this.destX && this.y === this.destY
	};

	getOccupiedCells(x, y){
		let cellX1 = Math.floor(x);
		let cellY1 = Math.floor(y);

		let cellX2 = ( x > cellX1 ) ? cellX1 + 1 : cellX1;
		let cellY2 = ( y > cellY1 ) ? cellY1 + 1 : cellY1;

		let occupiedCells = [ [cellX1, cellY1] ]

		if(cellX1 !== cellX2 || cellY1 !== cellY2){
			occupiedCells.push([cellX2, cellY2])
		};

		return occupiedCells
	}

	updateMove(tileMap){
		if(!this.isAtDestination()){
			this.move(tileMap)
		}
		
		else if(this._path.length > 0){
			let nextCell = this._path.pop();
			this.updateDestination(nextCell.x, nextCell.y)
		};
	};

	updateDestination(x, y){
		this.destX = x;
		this.destY = y;
	};


	update(tileMap, x, y){
		this.updateMove(tileMap);
		this.updatePixelPosition(tileMap, x, y);
	};

	onMouseClick(tileMap){
		//
	};

	directions = [
		[-1,  0], //up
		[ 1,  0], //down
		[ 0,  1], //left
		[ 0, -1], //right
	];

	canTraverse(tileMap, x, y){
		
		//Convert any position variables to integers
		x = Math.floor(x);
		y = Math.floor(y);

		return tileMap.isInBounds(x, y) && !tileMap.isBarrier(x, y) && !tileMap.isOccupied(x, y)
	};

	enterCell(tileMap, x, y){
		tileMap.addEntityToCell(this, x, y)
	};

	leaveCell(tileMap, x, y){
		tileMap.removeEntityFromCell(this, x, y)
	};

	startCharacterMove(directionIndex, tileMap){
	
		let [dX, dY] = this.directions[directionIndex];
		let newX = this.x + dX;
		let newY = this.y + dY;

		if(this.canTraverse(tileMap, newX, newY)){
			this.updateDestination(newX, newY);

			this.update(tileMap, this.x, this.y)
		}; 
	};
};

export { Character }