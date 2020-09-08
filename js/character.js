import { Pathfinder } from "./pathfinder.js";

class Character{
		constructor(name, x, y, imgURL){
			this.name = name;
			this.x = x;
			this.y = y;
			this._xPixel;
			this._yPixel;
			this.destX = x;
			this.destY = y;
			this.pathfinder = new Pathfinder(this);
			this.imgURL = imgURL;
			this.bitmap = null;
			this.layer = null;
		};

		draw(x, y){

			if(x === undefined){
				x = this._xPixel;
				y = this._yPixel;
			};

			this.layer.clear();
			this.layer.drawImage(this.bitmap, x - this.bitmap.width / 2, y - this.bitmap.height);
		};

		move(){};

		getCell(){};

		getPosition(){
			return [this.x, this.y]
		};
		
		getPixelPosition(tileMap, x, y){
			
			let [xPos, yPos] = tileMap.getTileCoords(x, y);
			let charaOffSetX = -8; //An image's origin is the point on the image where it will be placed on the canvas (i.e the the top left corner).
			let charaOffSetY = 17; //we must adjust this point for the character to be placed on a canvas in a way that it will align with the center of the floor.

			return [ xPos + charaOffSetX, yPos + charaOffSetY ]
		};

		setImageURL(imgURL){
			this.imgURL = imgURL;
		};

		loadBitmap(callBack){
			this.bitmap = document.createElement("img");
			this.bitmap.addEventListener("load", callBack );
			this.bitmap.src = this.imgURL;
		};

		update(tileMap, x, y){
			let [ xPos, yPos ] = this.getPixelPosition(tileMap, x, y);

			this._xPixel = xPos;
			this._yPixel = yPos;
		};

		setLayer(layer){
			this.layer = layer;
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

		startCharacterMove(event, tileMap){
		
			let d;

			switch(event.key){
				
				case "ArrowUp":
					d = 0;
					
					break;

				case "ArrowDown":
					d = 1; 
					
					break;
				
				case "ArrowLeft": 
					d = 2;
					
					break;
				
				case "ArrowRight": 
					d = 3;

					break;
			};

			let [dX, dY] = this.directions[d];
			let newX = this.x + dX;
			let newY = this.y + dY;

			if(this.canTraverse(tileMap,newX, newY)){
				this.x = newX;
				this.y = newY;

				this.update(tileMap, this.x, this.y)
			} 
		};
	};

	export { Character }