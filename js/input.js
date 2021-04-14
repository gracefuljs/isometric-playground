class Input{
	constructor(){
		this._x = 0;
		this._y = 0;
		this._key = null;
		this._lastKeyPressed = null;
		this._timeSinceLastPressed = 0;
		this._keyCooldownTime = 2;
	};

	update(){
		if(this._lastKeyPressed){
			this._timeSinceLastPressed ++;

			if(this._timeSinceLastPressed > this._keyCooldownTime * 2){
				this._timeSinceLastPressed = 0;
				this._lastKeyPressed = null;
			}
		}
	};

	getMouseCoords(){
		return [this._x, this._y]
	};

	setMouseCoords(x, y){
		this._x = x;
		this._y = y;
	};


	mouseHandler(screen, tileMap, event){
		let [screenX, screenY] = screen.getScreenCoordsWithOffset(event.clientX, event.clientY);
		
		this.setMouseCoords(screenX, screenY);
	};

	clickHandler(screen, tileMap, event){
		let coords = this.getMouseCoords();
		return coords
	};

	keyPressIsAllowed(){
		let key = this.getKey();

		if(key === this._lastKeyPressed && this._timeSinceLastPressed < this._keyCooldownTime){
			return false
		}

		this._lastKeyPressed = key;
		this._timeSinceLastPressed = 0;

		return true

	};

	keyHandler(event){
		let key = this.getPressedKey(event);
		this._key = key;
		//TODO
	};

	getPressedKey(event){
		return event.key
	};

	getKey(){
		return this._key
	};

	isKeyDirectional(){
		return this.DIRECTIONS.indexOf(this._key) > -1;
	};

	DIRECTIONS = [
		"ArrowUp",
		"ArrowDown",
		"ArrowLeft",
		"ArrowRight"
	];

};

export { Input }