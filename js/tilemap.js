class TileMap{
		constructor(screenLayer, width, height, tileWidth, tileHeight, imgURL){
			this.width = width;
			this.height = height;
			this.tileWidth = tileWidth;
			this.tileHeight = tileHeight;
			this.layer = screenLayer;
			this.imgURL = imgURL;
			this.mapBitmap = null;
			this.mapLayers = [];
			this.gridData = [];
			this.selectedTile = [];
			this.highlightedTile = [];
			this.path = [];
			this.entities = [];

		};

		loadBitmap(callBack){
			this.mapBitmap = document.createElement("img");
			this.mapBitmap.addEventListener("load", () => {this.draw()});
			this.mapBitmap.src = this.imgURL;
		};

		setGridData(grid){
			this.gridData = grid.map(row => row.map(cell => [cell, [], null]));;
		};

		getCell(x, y){
			return this.gridData[y][x]
		};

		getCellGroundData(x, y){
			return this.getCell(x, y)[0]
		};


		getTileFromScreenCoords(screenX, screenY){

			let cellX = Math.floor(((screenY) / this.tileHeight) + (screenX / this.tileWidth)); 
			let cellY = Math.floor(((screenY) / this.tileHeight) - (screenX / this.tileWidth));

			return [cellX, cellY];
		};

		cartesianToIsometric(x, y){
			return [ x - y, ( x + y ) / 2 ]
		};

		isometricToCartesian(x, y){
			let cartX = (x + ( y / 2) ) / 2;
			let cartY = x - y;

			return [cartX, cartY]
		};

		pixelToTile(x, y){
			return [x / this.tileWidth, y / this.tileHeight]
		};

		getTileCoords(x, y){
			//To move to the next tile, we must move 1/2 tile width on the x axis, and 1/2 tile width on the y axis.
			//Additionally, an isometric move has a cartesian x and y component, so moving along either isometric axis affects both cartesian x and y.
			let tileX = (x - y) * (this.tileWidth / 2); //When moving along the x isometric axis the cartesian x increases and the y decreases.
			let tileY = (x + y) * (this.tileHeight / 2); //When moving along the y isometric axis the cartesian x increases and the y increases.

			return [ tileX, tileY ]
		};

		isInBounds(x, y){
			return y >= 0 &&  y < this.gridData.length && x >= 0 && x < this.gridData[y].length
		};

		isBarrier(x, y){
			let barrierTileIndexes = [0, 1, 2, 3, 15]; //Tiles that the character can't walk over.
			return barrierTileIndexes.indexOf(this.gridData[y][x][0]) > -1
		};

		isOccupied(x, y){
			return this.getCell(x, y)[1].length > 0
		};

		addEntityToCell(entity, x, y){
			let cell = this.getCell(x, y)[1];
			cell.push(entity);
		};

		removeEntityFromCell(entity, x, y){
			let cell = this.getCell(x, y)[1];
			this.getCell(x, y)[1] = cell.filter(ent => ent !== entity); 
		};

		onMouseMove(screenX, screenY){
			
			let [cellX, cellY] = this.getTileFromScreenCoords(screenX, screenY);
			this.highlightedTile = [cellX, cellY];
		};

		onMouseClick(screenX, screenY){

			let [cellX, cellY] = this.getTileFromScreenCoords(screenX, screenY);
			this.clickedTile = [cellX, cellY];
		};

		update(input){
			this.highlightedTile  = input.hoveredTile;
			this.selectedTile     = input.clickedTile;
		};

		draw(){

			this.layer.clear();
			this.drawGrid();
			this.drawHighlight(...this.highlightedTile);
		};

		//This particular render method draws the tiles in a diamond shape, where the grid looks like a standard cartesian grid only rotated.
		drawGrid(){
			for(let y = 0; y < this.gridData.length; y ++){
				
				let row = this.gridData[y];
				for(let x = 0; x < row.length; x++){
					this.drawImageTile(x, y, row[x][0]);
				};
			};

			for(let i = 0; i < this.path.length; i++){
				this.drawFlatTile(this.path[i].x, this.path[i].y, "blue")
			};
		};

		//Just a little tweak to make water tiles appear slightly lower on the map.
		waterHeightOffset(index){
			return ( index < 4 ) ? 5 : 0;
		};

		drawImageTile(x, y, index){
			let [tileX, tileY] = this.getTileCoords(x, y);
			this.layer.drawImageSlice(this.mapBitmap, index * this.tileWidth, 0, this.tileWidth, this.mapBitmap.height, tileX - this.tileWidth / 2, tileY + this.waterHeightOffset(index) - 11, this.tileWidth, this.mapBitmap.height);
		};

		drawFlatTile(x, y, color){
			let [tileX, tileY] = this.getTileCoords(x, y);
			let topLeft     = [ tileX, tileY ];
			let topRight    = [ tileX + (this.tileWidth / 2), tileY + (this.tileHeight / 2) ];
			let bottomLeft  = [ tileX, tileY + this.tileHeight ];
			let bottomRight = [ tileX - (this.tileWidth /2), tileY + (this.tileHeight / 2) ];

			let coords = [...topLeft, ...topRight, ...bottomLeft, ...bottomRight];

			this.layer.drawFlatTile(...coords, color );
		};

		drawHighlight(x, y){

			if( this.isInBounds(x, y) ){
				this.drawFlatTile(x, y, "yellow")
			};
		};

	};
export { TileMap }