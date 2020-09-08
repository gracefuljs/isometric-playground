class Input{
	constructor(){
		this._x = 0;
		this._y = 0;
	};

	getMouseCoords(){
		return [this._x, this._y]
	}

	setMouseCoords(x, y){
		this._x = x;
		this._y = y;
	}


	mouseHandler(screen, tileMap, event){
		let [screenX, screenY] = screen.getScreenCoordsWithOffset(event.clientX, event.clientY);
		
		this.setMouseCoords(screenX, screenY);
	};

	clickHandler(screen, tileMap, event){
		let coords = this.getMouseCoords();
		return coords
	};

};

export { Input }