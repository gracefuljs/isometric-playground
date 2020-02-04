window.onload = function(){
	let tileMap    = document.getElementById("tileMap"),
		charaMap   = document.getElementById("tileMap"),
		mapCtx     = tileMap.getContext("2d"),
		charaCtx   = charaMap.getContext("2d")
		width      = charaMap.width  = tileMap.width  = 900,
		height     = charaMap.height = tileMap.height = 600;
		
	//Tiles are conventionally twice as wide as they are tall.
	let	tileWidth  = 60,
		tileHeight = 30; 


	let grid = [
		[15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
		[15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
		[15,  8,  8,  8,  8,  8,  8,  8, 15, 15, 15, 15],
		[15,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8, 15],
		[15,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8, 15],
		[15,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8, 15],
		[15,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8, 15],
		[15,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8, 15],
		[15,  1,  1,  1, 15, 15, 15, 15, 15, 15, 15, 15],
		[15,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, 15],
		[15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
	]

	//Move the origin of the tile map to the center of the screen
	mapCtx.translate(width / 4, 50);
	charaCtx.translate(width / 4, 50);
	
	let img = document.createElement("img");
	img.addEventListener("load", () => {draw()});
	img.src = "images/tileset.png";

	//This particular render method draws the tiles in a diamond shape, where the grid looks like a standard cartesian grid only rotated.
	function draw(){
		for(let y = 0; y < grid.length; y ++){
			
			let row = grid[y];
			for(let x = 0; x < row.length; x++){
				drawImageTile(x, y, row[x]);
			}
		}
	}


	function getTileCoords(x, y){
		//To move to the next tile, we must move 1/2 tile width on the x axis, and 1/2 tile width on the y axis.
		//Additionally, an isometric move has a cartesian x and y component, so moving along either isometric axis affects both cartesian x and y.
		let tileX = (x - y) * (tileWidth / 2); //When moving along the x isometric axis the cartesian x increases and the y decreases.
		let tileY = (x + y) * (tileHeight / 2); //When moving along the y isometric axis the cartesian x increases and the y increases.

		return [ tileX, tileY ]
	}

	function drawImageTile(x, y, index){
		let [tileX, tileY] = getTileCoords(x, y);
		mapCtx.drawImage(img, index * tileWidth, 0, tileWidth, img.height, tileX, tileY + (index < 4 ? 5: 0), tileWidth, img.height);

	};

}