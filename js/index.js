import { Pathfinder } from './pathfinder.js';
import { Screen, Layer } from './screen.js';
import { TileMap } from './tilemap.js';
import { Character } from './character.js';
import { Input } from './input.js';

(function(){

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
				  	this.layer.context.fillText('Loading...', -this.layer.canvas.width/5, this.layer.canvas.height/2);
				}
			}});
			gui.draw(this)

			this.loadGraphics()
				.then( () => {
					this.initCharacters();
					window.requestAnimationFrame((timestamp) => this.loop(timestamp));
					this.isLoading = false;
				});
		};

		initScreen(container, width, height){
			this.screen = new Screen(container, width, height);
		};

		//For debugging purposes
		initBackgroundLayer(){
			let layer = this.screen.getScreenLayer("background");
			layer.canvas.classList.add("background");
		};

		initTileMap(width, height, tileWidth, tileHeight, imgURL, gridData){
			let layer = this.getTileMapLayer();

			this.tileMap = new TileMap(layer, width, height, tileWidth, tileHeight, imgURL);
			layer.addChild(this.tileMap);

			this.tileMap.setGridData(grid);
		};

		createPlayer(name, x, y, imgURL){
			let layer = this.getCharacterLayer();

			this.player = new Character(name, x, y, imgURL);
			this.player.setLayer( layer );
			layer.addChild(this.player);
			this.registerCharacter("player", this.player);
		};

		createCharacter(name, x, y, imgURL){
			let layer = this.getCharacterLayer();

			let character = new Character(name, x, y, imgURL);
			character.setLayer(layer);
			layer.addChild(character);
			this.registerCharacter(name, character);
		};

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

		update(timestamp){
			this.characters.forEach( (character) => {character.update(this.tileMap, character.x, character.y)}, this );
		};

		loop(timestamp){
			this.update(timestamp);
			this.screen.clearScreen();
			this.screen.draw(this.inputHandler);
			window.requestAnimationFrame((timestamp)=>{this.loop(timestamp)});
		};

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
			
			if( this.inputHandler.isKeyDirectional() ){
				let key = this.inputHandler.getKey();
				let directionIndex = this.inputHandler.DIRECTIONS.indexOf(key);
				this.player.startCharacterMove(directionIndex, this.tileMap)
			};
		};


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

	};



	//Game Data
	let grid = [
		[15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
		[15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
		[15,  8,  8,  8,  8,  8,  8, 14, 14, 14, 14, 14, 15, 15, 15, 15],
		[15,  8,  8,  8,  0,  0,  8,  8,  8, 11, 10, 14, 14, 14, 14, 15],
		[15,  8,  8,  8,  0,  0,  8,  8,  8,  8, 11, 11, 11, 11, 11, 15],
		[ 8,  8,  8,  8,  1,  8,  8,  8,  8,  8, 10,  8, 10, 11, 11, 15],
		[ 8,  8,  8,  1,  1,  8,  8,  8,  8,  8,  8,  8,  8, 10,  8, 15],
		[15,  8,  8,  1,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8, 10, 15],
		[15,  8,  1,  1,  8,  8,  8,  7,  7,  7,  8,  8,  8,  8,  8, 15],
		[15,  1,  1,  8,  8,  15, 8,  8,  7,  7,  8,  8,  8,  8,  8, 15],
		[15,  1,  8,  8,  8,  8,  8,  8,  7,  7,  7,  8,  8,  8,  8, 15],
		[15,  1,  8,  8,  8,  8,  8,  8,  8,  8,  7,  7,  8,  8,  8, 15],
		[15,  1,  1,  1, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
		[15,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, 15],
		[15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
	];

	//Game
	let game = new Game();
	let container = document.querySelector(".container");
	game.initScreen(container, window.innerWidth, window.innerHeight);

	//Game layers
	game.screen.createLayer("background");
	game.screen.createLayer("tileMap");
	game.screen.createLayer("undercharacter");
	game.screen.createLayer("characterMap", true);
	game.screen.createLayer("guiMap");

	//Debugging
	game.initBackgroundLayer();

	//Game Object
	game.initTileMap(game.getScreenWidth(), game.getScreenHeight(), 60, 30, "images/tileset.png", grid);
	game.createPlayer("Violet", 1, 8, "images/violet.png");

	game.createCharacter("Jenna", 4, 7, "images/jenna.png");
	game.createCharacter("Alaya", 11, 5, "images/alaya.png");
	game.createCharacter("Shie", 1, 2, "images/shie.png");


	window.addEventListener("load",()=>{ game.init()});
	document.querySelector(".container").addEventListener("mousemove", (event) => {game.mouseHandler(event)});
	window.addEventListener("resize", () => {game.screen.updateScreen(window.innerWidth, window.innerHeight);console.log(game.screen.container.offsetLeft)});
	document.querySelector(".container").addEventListener("click", (event)=>{game.clickHandler(event)});
	window.addEventListener("keydown", (event)=>{game.keyHandler(event)})


	
})()
