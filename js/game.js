class Game{
	constructor(){
		this._screen = null;
		this._characters new Map();
	};

	loadGraphics(){
		//Load the assets before drawing the screen.
		mapImg = document.createElement("img");
		mapImg.addEventListener("load", () => {draw()});
		mapImg.src = "images/tileset.png";

		//Load the character's image before drawing the character
		characterImg = document.createElement("img");
		characterImg.addEventListener("load", () => { 
			[characterXpos, characterYpos] = getCharacterPosition(characterXCell, characterYCell);
		} );
		characterImg.src = "images/character2.png";
		window.addEventListener("keydown", startCharacterMove);
	};

	loop(timestamp){
		this.update();
		this._screen.clearScreen();
		this._screen.draw();
		drawCharacter(characterXpos, characterYpos);
		window.requestAnimationFrame(loop);
	};

	initGame(){
		this._screen.setScreenDimensions(gameWidth, gameHeight);
		this.loadGraphics();
		window.requestAnimationFrame(loop);
	};

	initScreen(){
		this._screen = new Screen(width, height, mainContainer);
	}


}

class Input{
	constructor(){};

	drawHighlight(x, y){
		lowerLayerContext.clearRect(-gameWidth / 2, -50, gameWidth, gameHeight);

		if( isInBounds(x, y) ){
			drawFlatTile(x, y, "yellow", lowerLayerContext)
		};
	};

	mouseHandler(event){
		let [screenX, screenY] = getScreenCoordsWithOffset(event.clientX, event.clientY);
		let [cellX, cellY]     = getTileFromScreenCoords(screenX, screenY);
		
		drawHighlight(cellX, cellY);
	};

	clickHandler(event){
		let [screenX, screenY] = getScreenCoordsWithOffset(event.clientX, event.clientY);
		let [cellX, cellY] = getTileFromScreenCoords(screenX, screenY);

		selectTile(cellX, cellY);
		let path = pathfinder.search(characterXCell, characterYCell, selectedTile[0], selectedTile[1]);
		test.clear();

		for(let i = 0; i < path.length; i++){
			drawFlatTile(path[i].x, path[i].y, "blue", test.context)
		}
	};
}