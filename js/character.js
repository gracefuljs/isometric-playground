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
		this._path = [];
		this.pathfinder = new Pathfinder(this);
		this.imgURL = imgURL;
		this.bitmap = null;
		this.layer = null;
	};

	

	//////////////////////////
	/// Sprite Manipulation
	//////////////////////////

	
	draw(x, y){

		if(x === undefined){
			x = this._xPixel;
			y = this._yPixel;
		};

		this.layer.clear();
		this.layer.drawImage(this.bitmap, x - this.bitmap.width / 2, y - this.bitmap.height);
	};

	setLayer(layer){
		this.layer = layer;
	};

	setImageURL(imgURL){
		this.imgURL = imgURL;
	};

	loadBitmap(callBack){
		this.bitmap = document.createElement("img");
		this.bitmap.addEventListener("load", callBack );
		this.bitmap.src = this.imgURL;
	};

	

	//////////////////////////
	/// Pixel Manipulation
	//////////////////////////


	getPosition(){
		return [this.x, this.y]
	};

	setPosition(x, y){
		this.x = x;
		this.y = y;
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


	//////////////////////////
	/// Grid Navigation
	//////////////////////////

	move(x, y){
		this.setPosition(x, y);
	};

	setPath( newPath ){
		this._path = newPath;
	};

	isAtDestination(){
		return this.x === this.destX && this.y === this.destY
	};

	shouldMove(){
		return this._path.length > 0 || !this.isAtDestination()
	};

	updateMove(){
		if ( this.shouldMove() ){
			if(this._path.length > 0){
				let nextCell = this._path.pop();
				this.move(nextCell.x, nextCell.y);
			};
		};
	}

	update(tileMap, x, y){
		this.updateMove();
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

		return tileMap.isInBounds(x, y) && !tileMap.isBarrier(x, y)
	};

	startCharacterMove(directionIndex, tileMap){
	
		let [dX, dY] = this.directions[directionIndex];
		let newX = this.x + dX;
		let newY = this.y + dY;

		if(this.canTraverse(tileMap, newX, newY)){
			this.x = newX;
			this.y = newY;
			this.destX = newX;
			this.destY = newY;

			this.update(tileMap, this.x, this.y)
		} 
	};
};

export { Character }