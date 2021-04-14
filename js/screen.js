class Screen{
	constructor(container, width, height){
		this.width = width;
		this.height = height;
		this.container = container;

		this.container.style.width  = `${width}px`;
		this.container.style.height = `${height}px`;
		
		this.layers   = new Map();
		this.viewPort = new ViewPort(this, 0, 0, this.width, this.height);
	};

	createLayer(name, shouldSort){
		let newLayer = new Layer(this, name, this.width, this.height, shouldSort);
		newLayer.canvas.setAttribute("class", "screen-layer");
		newLayer.canvas.style.zIndex = this.layers.length;

		this.layers.set(name, newLayer);
		this.container.appendChild(newLayer.canvas);
	};

	getLayer(name){
		return this.layers.get(name).context
	};

	getLayerCanvas(name){
		return this.layers.get(name).canvas
	};

	getScreenLayer(name){
		return this.layers.get(name)
	};

	getWidth(){
		return this.width
	};

	getHeight(){
		return this.height
	};

	getScreenCoordsWithOffset(x, y){
		let rect     = this.container.getBoundingClientRect();
		let viewPort = this.viewPort.getOrigin();
		
		let screenX = x + viewPort.x - rect.left;
		let screenY = y + viewPort.y - rect.top;

		return [screenX, screenY]
	};

	setDimensions(width, height){
		this.width  = width;
		this.height = height;

		this.viewPort.setDimensions(this.width, this.height);

		this.layers.forEach( (layer) => {
			layer.updateDimensions(width, height);
		});
	};

	updateScreen(newWidth, newHeight){
		this.setDimensions(newWidth, newHeight);
		this.draw();
	};

	clearScreen(){
		this.layers.forEach( (layer) => {
			layer.clear();
		})
	};

	draw(input){
		this.layers.forEach( (layer) => {
			layer.draw(input);
		})
	};

};

class Layer{
	constructor(parent, name, width, height, shouldSort = false){
		this.canvas = document.createElement("canvas");
		this.canvas.id = `${name}-canvas`;

		this.canvas.width = width;
		this.canvas.height = height;
		this.context = this.canvas.getContext("2d");
		this.parent   = parent;
		this.children = [];
		this.shouldSort = shouldSort;
		this.useViewPort = true;
	};

	clear(){
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	};

	updateDimensions(width, height){
		this.canvas.width  = width;
		this.canvas.height = height;
	};

	sortChildren(){
		if(!this.shouldSort) return false;

		this.children.sort( (a, b) => a.y - b.y)
	};

	setUseViewPort(value){
		this.useViewPort = value;
	};

	getViewPort(){
		return this.parent.viewPort
	}

	draw(){
		this.clear();
		this.sortChildren();
		this.children.forEach((child) => {
			child.draw();
		})
	};

	addChild(child){
		this.children.push(child)
	};

	removeChild(child){
		this.children = this.children.filter( (currentChild) => currentChild !== child )
	};

	drawImage(img, x, y){

		if(this.useViewPort){
			let viewPort = this.getViewPort().getOrigin();
			x = x - viewPort.x;
			y = y - viewPort.y;
		};

		this.context.drawImage(img, x, y)
	};

	drawImageSlice(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight){
		
		if(this.useViewPort){
			let viewPort = this.getViewPort().getOrigin();
			dx = dx - viewPort.x;
			dy = dy - viewPort.y;
		};
		
		this.context.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
	};

	drawFlatTile(x1, y1, x2, y2, x3, y3, x4, y4, color){
		
		if(this.useViewPort){
			let viewPort = this.getViewPort().getOrigin();

			let xCoords = [x1, x2, x3, x4].map( (x) => x - viewPort.x);
			let yCoords = [y1, y2, y3, y4].map( (y) => y - viewPort.y);

			
			x1 = xCoords[0];
			x2 = xCoords[1];
			x3 = xCoords[2];
			x4 = xCoords[3];

			y1 = yCoords[0];
			y2 = yCoords[1];
			y3 = yCoords[2];
			y4 = yCoords[3];

		};

		this.context.beginPath();
		this.context.moveTo(x1, y1);
		this.context.lineTo(x2, y2);
		this.context.lineTo(x3, y3);
		this.context.lineTo(x4, y4);
		this.context.closePath();
		this.context.fillStyle = color;
		this.context.fill();
	};

	drawText(text, x, y, color, font){
		let defaultColor = "#000000";
		let defaultFont  = "12pt Arial";

		this.context.fillStyle = color || defaultColor;
		this.context.font = font || defaultFont;

		this.context.fillText(text, x, y);
	};
};

class ViewPort{
	constructor(parent, originX, originY, width, height){
		this.parent  = parent;
		this.originX = originX;
		this.originY = originY;
		this.width   = width;
		this.height  = height;
	};

	setOrigin(x, y){
		this.originX = x;
		this.originY = y;
	};

	getOrigin(){
		return {x:this.originX, y:this.originY}
	};

	centerOnPoint(x, y){
		this.originX = x - (this.width  / 2);
		this.originY = y - (this.height / 2);
	};

	setDimensions(width, height){
		this.width  = ( width  < this.parent.getWidth()  ) ? width : this.parent.getWidth();
		this.height = ( height < this.parent.getHeight() ) ? height: this.parent.getHeight();
	};
}

	export {Screen, Layer}