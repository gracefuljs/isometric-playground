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
			this.inputHandler = new Input();
			this.characters = new Map();
			this.player = null;
		};

		init(){
			this.loadGraphics();
			window.requestAnimationFrame((timestamp)=>{this.loop(timestamp)});
		};

		initScreen(container, width, height){
			this.screen = new Screen(container, width, height);
		};

		initTileMap(width, height, tileWidth, tileHeight, imgURL, gridData){
			let layer = this.getTileMapLayer();

			this.tileMap = new TileMap(layer, width, height, tileWidth, tileHeight, imgURL);
			this.tileMap.loadBitmap();
			layer.addChild(this.tileMap);

			this.tileMap.setGridData(grid);
		};

		initPlayer(name, x, y, imgURL){
			let layer = this.getCharacterLayer();

			this.player = new Character(name, x, y, imgURL);
			this.player.setLayer( layer );
			this.player.loadBitmap( () => {
				[this.x, this.y] = this.player.getPosition(this.tileMap, x, y);
			});
			window.addEventListener("keydown", (event) => {this.player.startCharacterMove(event, this.tileMap)});
			layer.addChild(this.player);
			this.registerCharacter("player", this.player);
		};

		registerCharacter(characterID, characterObject){
			this.characters.set(characterID, characterObject)
		};


		loadGraphics(){};

		update(){
			this.player.update(this.tileMap, this.player.x, this.player.y);
		};

		loop(timestamp){
			this.update();
			this.screen.clearScreen();
			this.screen.draw(this.inputHandler);
			this.player.draw(this.player.xPos, this.player.yPos);
			window.requestAnimationFrame((timestamp)=>{this.loop(timestamp)});
		};

		mouseHandler(event){
			this.inputHandler.mouseHandler(this.screen, this.tileMap, event);
			
			let [screenX, screenY] = this.inputHandler.getMouseCoords();
			//this.screen.getScreenCoordsWithOffset(...this.inputHandler.getMouseCoords());
			this.tileMap.onMouseMove(screenX, screenY);
		};

		clickHandler(event){
			this.inputHandler.clickHandler(this.screen, this.tileMap, event);
			let [screenX, screenY] = this.inputHandler.getMouseCoords();
			this.tileMap.onMouseClick(screenX, screenY);
			let path = this.player.pathfinder.search(this.tileMap, this.player.x, this.player.y, this.tileMap.clickedTile[0], this.tileMap.clickedTile[1]);

			this.tileMap.path = path;
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
	game.screen.createLayer("tileMap");
	game.screen.createLayer("undercharacter");
	game.screen.createLayer("characterMap");
	game.screen.createLayer("guiMap");

	//Game Object
	game.initTileMap(game.getScreenWidth(), game.getScreenHeight(), 60, 30, "images/tileset.png", grid);
	game.initPlayer("Violet", 1, 8, "images/character2.png");


	window.addEventListener("load",()=>{ game.init()});
	document.querySelector(".container").addEventListener("mousemove", (event) => {game.mouseHandler(event)});
	window.addEventListener("resize", () => {game.screen.updateScreen(window.innerWidth, window.innerHeight)});
	document.querySelector(".container").addEventListener("click", (event)=>{game.clickHandler(event)})


	
})()
