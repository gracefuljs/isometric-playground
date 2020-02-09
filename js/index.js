window.onload = function(){
	let tileMap    = document.getElementById("tileMap"),
		charaMap   = document.getElementById("characterMap"),
		mapCtx     = tileMap.getContext("2d"),
		charaCtx   = charaMap.getContext("2d"),
		width      = charaMap.width  = tileMap.width  = window.innerWidth,
		height     = charaMap.height = tileMap.height = window.innerHeight;
		
	//Tiles are conventionally twice as wide as they are tall.
	let	tileWidth  = 60,
		tileHeight = 30; 

	//Set the character's position
	let charaX = 7;
	let charaY = 6;


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
		[15,  1,  1,  8,  8,  8,  8,  8,  7,  7,  8,  8,  8,  8,  8, 15],
		[15,  1,  8,  8,  8,  8,  8,  8,  7,  7,  7,  8,  8,  8,  8, 15],
		[15,  1,  8,  8,  8,  8,  8,  8,  8,  8,  7,  7,  8,  8,  8, 15],
		[15,  1,  1,  1, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
		[15,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, 15],
		[15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
	]

	//Move the origin of the tile map to the center of the screen
	mapCtx.translate(width / 2, 50);
	charaCtx.translate(width / 2, 50);
	
	//Load the assets before drawing the screen.
	let img = document.createElement("img");
	img.addEventListener("load", () => {draw()});
	img.src = "images/tileset.png";

	//Load the character's image before drawing the character
	let chara = document.createElement("img");
	chara.addEventListener("load", () => { drawCharacter(charaX, charaY)} );
	chara.src = "images/character.png";
	window.addEventListener("keydown", moveCharacter);

	//This character is drawn on his own canvas
	function drawCharacter(x, y){
		let [tileX, tileY] = getTileCoords(x, y);
		charaCtx.clearRect(-width / 2, -50, width, height)
		charaCtx.drawImage(chara, tileX + 11, tileY - 11);
	};

	//This particular render method draws the tiles in a diamond shape, where the grid looks like a standard cartesian grid only rotated.
	function draw(){
		for(let y = 0; y < grid.length; y ++){
			
			let row = grid[y];
			for(let x = 0; x < row.length; x++){
				drawImageTile(x, y, row[x]);
			}
		}
	};


	function getTileCoords(x, y){
		//To move to the next tile, we must move 1/2 tile width on the x axis, and 1/2 tile width on the y axis.
		//Additionally, an isometric move has a cartesian x and y component, so moving along either isometric axis affects both cartesian x and y.
		let tileX = (x - y) * (tileWidth / 2); //When moving along the x isometric axis the cartesian x increases and the y decreases.
		let tileY = (x + y) * (tileHeight / 2); //When moving along the y isometric axis the cartesian x increases and the y increases.

		return [ tileX, tileY ]
	};

	//Just a little tweak to make water tiles appear slightly lower on the map.
	const waterHeightOffset = (index) => ( index < 4 ) ? 5 : 0;

	function drawImageTile(x, y, index){
		let [tileX, tileY] = getTileCoords(x, y);
		mapCtx.drawImage(img, index * tileWidth, 0, tileWidth, img.height, tileX, tileY + waterHeightOffset(index), tileWidth, img.height);

	};

	function moveCharacter(event){
		switch(event.key){
			
			case "ArrowUp": 
				if(canTraverse(charaX - 1, charaY)){
					charaX --;
					drawCharacter(charaX, charaY);
				}
				
				break;

			case "ArrowDown":
				if(canTraverse(charaX + 1, charaY)){
					charaX ++;
					drawCharacter(charaX, charaY);
				} 
				
				break;
			
			case "ArrowLeft": 
				if(canTraverse(charaX, charaY + 1)){
					charaY ++;
					drawCharacter(charaX, charaY);
				}
				
				break;
			
			case "ArrowRight": 
				if(canTraverse(charaX, charaY - 1)){
					charaY --;
					drawCharacter(charaX, charaY);
				}

				break;
		}
	};

	function canTraverse(x, y){
		
		//Convert any position variables to integers
		x = Math.floor(x);
		y = Math.floor(y);

		let barrierTileIndexes = [0, 1, 2, 3, 15]; //Tiles that the character can't walk over.

		//Check to see if the prospective tile is out of bounds.
		if( y < 0 || y > grid.length){
			return false
		}

		if ( x < 0 || x > grid[y].length){
			return false
		}

		//Check to see if the prospective tile is a barrier tile
		if ( barrierTileIndexes.indexOf(grid[y][x]) > -1){
			return false
		}

		return true
	}

}