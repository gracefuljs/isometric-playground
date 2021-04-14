import { Game } from './game.js';
import { Debugger } from './debugger.js';

(function(){

	let game = new Game();
	let container = document.querySelector(".container");
	game.createScreen(container, window.innerWidth, window.innerHeight);

	//Game layers
	game.screen.createLayer("background");
	game.screen.createLayer("tileMap");
	game.screen.createLayer("undercharacter");
	game.screen.createLayer("characterMap", true);
	game.screen.createLayer("guiMap");

	//Debugging
	game.createBackgroundLayer();

	//Game Object
	game.createTileMap(game.getScreenWidth(), game.getScreenHeight(), 60, 30, "tileset.png", "grid.json");
	game.createPlayer("Violet", 1, 8, "violet.png");

	game.createCharacter("Jenna", 4, 7, "jenna.png");
	game.createCharacter("Alaya", 11, 5, "alaya.png");
	game.createCharacter("Shie", 1, 2, "shie.png");

	//Game Compile Data
	game.compileData(
		[
			"grid.json"
		]);


	window.addEventListener("load",()=>{ game.init()});
	document.querySelector(".container").addEventListener("mousemove", (event) => {game.mouseHandler(event)});
	window.addEventListener("resize", () => {game.screen.updateScreen(window.innerWidth, window.innerHeight);console.log(game.screen.container.offsetLeft)});
	document.querySelector(".container").addEventListener("click", (event)=>{game.clickHandler(event)});
	window.addEventListener("keydown", (event)=>{game.keyHandler(event)})


	
})()
