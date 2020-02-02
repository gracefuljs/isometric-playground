window.onload = function(){
	let tileMap    = document.getElementById("tileMap"),
		charaMap   = document.getElementById("tileMap"),
		mapCtx     = tileMap.getContext("2d"),
		charaCtx   = charaMap.getContext("2d")
		width      = charaMap.width  = tileMap.width  = 900,
		height     = charaMap.height = tileMap.height = 600,
		tileWidth  = 60,
		tileHeight = 30;


	let grid = [
		[15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
		[15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
		[15,  8,  8,  8,  8,  8,  8,  8, 15, 15, 15, 15],
		[15,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8, 15],
		[15,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8, 15],
		[15,  1,  1,  1, 15, 15, 15, 15, 15, 15, 15, 15],
		[15,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, 15],
		[15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
	]

	mapCtx.translate(width / 4, 50);
	charaCtx.translate(width / 4, 50);
	
	let img = document.createElement("img");
	img.addEventListener("load", () => {draw()});
	img.src = "images/tileset.png";

	function draw(){
		for(let y = 0; y < grid.length; y ++){
			
			let row = grid[y];
			for(let x = 0; x < row.length; x++){
				drawImageTile(x, y, row[x]);
				//drawBlock(x, y, Math.floor(Math.random() * 4));
			}
		}
	}


	function drawImageTile(x, y, index){
		mapCtx.save();
		mapCtx.translate((x - y) * (tileWidth / 2), (x + y) * (tileHeight / 2) + (index < 4 ? 5: 0));
		mapCtx.drawImage(img, index * tileWidth, 0, tileWidth, img.height, -tileWidth / 2, 0, tileWidth, img.height);
		

		mapCtx.restore();
	};

	function drawBlock(x, y, z){
		let top   = "#eeeeee",
			right = "#cccccc",
			left  = "#999999";

		mapCtx.save();
		mapCtx.translate((x - y) * (tileWidth / 2), (x + y) * (tileHeight / 2));

		//Draw Top
		mapCtx.beginPath();
		mapCtx.moveTo(0, -z * tileHeight);
		mapCtx.lineTo(tileWidth / 2, tileHeight / 2 - (z * tileHeight));
		mapCtx.lineTo(0, tileHeight - (z * tileHeight) );
		mapCtx.lineTo(-tileWidth / 2, tileHeight / 2 - (z * tileHeight));
		mapCtx.closePath();
		mapCtx.fillStyle = top;
		mapCtx.fill();

		//Draw Left
		mapCtx.beginPath();
		mapCtx.moveTo(-tileWidth / 2, tileHeight / 2 - (z * tileHeight));
		mapCtx.lineTo(0, tileHeight - (z * tileHeight));
		mapCtx.lineTo(0, tileHeight);
		mapCtx.lineTo(-tileWidth / 2, tileHeight / 2);
		mapCtx.closePath();
		mapCtx.fillStyle = left;
		mapCtx.fill();

		//Draw Right
		mapCtx.beginPath();
		mapCtx.moveTo(tileWidth / 2, tileHeight / 2 -( z * tileHeight));
		mapCtx.lineTo(0, tileHeight - (z * tileHeight));
		mapCtx.lineTo(0, tileHeight);
		mapCtx.lineTo(tileWidth / 2, tileHeight / 2);
		mapCtx.closePath();
		mapCtx.fillStyle = right;
		mapCtx.fill();

		mapCtx.restore();
	}

	
	function drawTile(x, y, color){
		mapCtx.save();
		mapCtx.translate((x - y) * (tileWidth / 2), (x + y) * (tileHeight / 2));

		mapCtx.beginPath();
		mapCtx.moveTo(0, 0);
		mapCtx.lineTo(tileWidth / 2, tileHeight / 2);
		mapCtx.lineTo(0, tileHeight);
		mapCtx.lineTo(-tileWidth / 2, tileHeight / 2);
		mapCtx.closePath();
		mapCtx.fillStyle = color;
		mapCtx.fill();

		mapCtx.restore(); 
	}


}