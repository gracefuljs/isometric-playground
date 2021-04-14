import { Pathfinder } from './pathfinder.js';
import { Screen, Layer } from './screen.js';
import { TileMap } from './tilemap.js';
import { Character } from './character.js';
import { Input } from './input.js';

class Game{
	constructor(){
		this.screen = null;
		this.tileMap = null;
		this.isLoading = false;
		this.inputHandler = new Input();
		this.characters = new Map();
		this.player = null;
		this._lastTick = null;
		this.graphicsCache = new Map();
		this.data = [];
	};

	init(){
		
		this.isLoading = true;

		//Create Specialized GUI layer later...
		let gui = this.getGUILayer();
		gui.draw = function (game){
			this.clear();
			this.sortChildren();
			this.children.forEach((child) => {
				child.draw(game);
			})
		};
		gui.addChild({layer:gui, draw(game){
			if(game.isLoading){
				this.layer.context.fillStyle = "#000000";
				this.layer.context.font = '148px serif';
			  	this.layer.context.fillText('Loading...', 0, this.layer.canvas.height / 2);
			}
		}});
		gui.draw(this)

		this.loadMapData("grid.json")
			.then( (data) => {
				this.tileMap.setGridData(data);
				return this.loadGraphics();
			})
			.then( () => {
				console.log("All graphics loaded!")
				this.initCharacters();
				

				this.tileMap.centerViewportOnEntity(this.player);
				window.requestAnimationFrame((timestamp) => this.loop(timestamp));
				this.isLoading = false;
			});
	};

	

	//---------------------Game Object Initialization--------------------------------

	registerCharacter(characterID, characterObject){
		this.characters.set(characterID, characterObject)
	};

	initCharacters(){
		this.characters.forEach( (character) => {
			this.tileMap.addEntityToCell(character, character.x, character.y);
		});

		[this.x, this.y] = this.player.getPosition();
	};

	loadGraphics(){

		let allGraphics = [
		this.tileMap,
		...this.characters.values()
		].map( (graphic) => graphic.registerBitmap(this.graphicsCache), this);

		return Promise.all(allGraphics)

	};

	loadMapData(dataURL){

		let directory = this.getDataDirectory();

		return this.tileMap.init(directory + dataURL)
	};

	compileData(dataList){
		this.data.push(...dataList)
	};


	//------------------------------- Game Object Creation ---------------------------
	
	createScreen(container, width, height){
		this.screen = new Screen(container, width, height);
	};

	//For debugging purposes
	createBackgroundLayer(){
		let layer = this.screen.getScreenLayer("background");
		layer.canvas.classList.add("background");
	};

	createTileMap(width, height, tileWidth, tileHeight, imgURL, dataURL){
		let layer         = this.getTileMapLayer();
		let imgDirectory  = this.getImageDirectory();
		let dataDirectory = this.getDataDirectory();

		this.tileMap = new TileMap(layer, width, height, tileWidth, tileHeight, imgDirectory + imgURL, dataDirectory + dataURL);
		layer.addChild(this.tileMap);
	};

	createPlayer(name, x, y, imgURL){
		let layer     = this.getCharacterLayer();
		let directory = this.getImageDirectory();

		this.player = new Character(name, x, y, directory + imgURL);
		this.player.setLayer( layer );
		layer.addChild(this.player);
		this.registerCharacter("player", this.player);

		//Delete this later
		this.player.parent = this;
	};

	createCharacter(name, x, y, imgURL){
		let layer     = this.getCharacterLayer();
		let directory = this.getImageDirectory();

		let character = new Character(name, x, y, directory + imgURL);
		character.setLayer(layer);
		layer.addChild(character);
		this.registerCharacter(name, character);
	};

	
	//------------------------ Runtime Functions ---------------------------

	update(timestamp){
		this.inputHandler.update();
		this.characters.forEach( (character) => {character.update(this.tileMap, character.x, character.y)}, this );
	};

	loop(timestamp){
		this.update(timestamp);
		this.screen.clearScreen();
		this.screen.draw(this.inputHandler);
		this.tileMap.centerViewportOnEntity(this.player);
		window.requestAnimationFrame((timestamp)=>{this.loop(timestamp)});
	};

	
	//--------------- Event Handlers --------------------------------

	mouseHandler(event){
		this.inputHandler.mouseHandler(this.screen, this.tileMap, event);
		
		let [screenX, screenY] = this.inputHandler.getMouseCoords();
		this.tileMap.onMouseMove(screenX, screenY);
	};

	clickHandler(event){
		this.inputHandler.clickHandler(this.screen, this.tileMap, event);
		let [screenX, screenY] = this.inputHandler.getMouseCoords();
		this.tileMap.onMouseClick(screenX, screenY);
		let path = this.player.pathfinder.search(this.tileMap, this.player.x, this.player.y, this.tileMap.clickedTile[0], this.tileMap.clickedTile[1]);

		this.tileMap.path = path;
		this.player.setPath(path);
	};

	keyHandler(event){
		this.inputHandler.keyHandler(event);
		if(!this.inputHandler.keyPressIsAllowed()){return false}
		
		if( this.inputHandler.isKeyDirectional() && this.player.isAtDestination()){
			let key = this.inputHandler.getKey();
			let directionIndex = this.inputHandler.DIRECTIONS.indexOf(key);
			this.player.startCharacterMove(directionIndex, this.tileMap);
		};
	};


	//------------------------ Getters/Setters-------------------------------

	getScreenWidth(){
		return this.screen.width
	};

	getScreenHeight(){
		return this.screen.height
	};

	getTileMapLayer(){
		return this.screen.getScreenLayer("tileMap")
	};

	getCharacterLayer(){
		return this.screen.getScreenLayer("characterMap")
	};

	getGUILayer(){
		return this.screen.getScreenLayer("guiMap")
	};

	getDataDirectory(){
		return "assets/data/"
	}

	getImageDirectory(){
		return "assets/images/"
	}

};

export{ Game }