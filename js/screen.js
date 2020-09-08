class Screen{
		constructor(container, width, height){
			this.width = width;
			this.height = height;
			this.container = container;

			this.container.style.width = `${width}px`;
			this.container.style.height = `${height}px`;
			
			this.layers = new Map();
		};

		createLayer(name){
			let newLayer = new Layer(name, this.width, this.height);
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

		getScreenCoordsWithOffset(x, y){
			let rect = this.container.getBoundingClientRect();
			let screenX = x - (this.width / 2) - rect.left;
			let screenY = y - 50 - rect.top;

			return [screenX, screenY]
		};

		setDimensions(width, height){
			this.width = width;
			this.height = height;

			this.layers.forEach( (layer) => {
				layer.updateDimensions(width, height);
				layer.context.translate(width / 2, 50);
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
		constructor(name, width, height){
			this.canvas = document.createElement("canvas");
			this.canvas.id = `${name}-canvas`;

			this.canvas.width = width;
			this.canvas.height = height;
			this.context = this.canvas.getContext("2d");
			this.context.translate(width / 2, 50);
			this.children = [];
		};

		clear(){
			this.context.clearRect(-this.canvas.width / 2, -50, this.canvas.width, this.canvas.height);
		};

		updateDimensions(width, height){
			this.canvas.width  = width;
			this.canvas.height = height;
		};

		draw(){
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
			this.context.drawImage(img, x, y)
		};

		drawImageSlice(img, sx, sy, sWidth, sHeight, dx, dy,dWidth, dHeight){
			this.context.drawImage(img, sx, sy, sWidth, sHeight, dx, dy,dWidth, dHeight)
		};

		drawFlatTile(x1, y1, x2, y2, x3, y3, x4, y4, color){
			this.context.beginPath();
			this.context.moveTo(x1, y1);
			this.context.lineTo(x2, y2);
			this.context.lineTo(x3, y3);
			this.context.lineTo(x4, y4);
			this.context.closePath();
			this.context.fillStyle = color;
			this.context.fill();
		};
	};

	export {Screen, Layer}