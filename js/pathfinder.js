////--------------------Nodes
function Node(x, y, parentNode){
	let parent = ( parentNode !== undefined ) ? parentNode : null;

	this.x = x;
	this.y = y;
	this.parent = parent;
	this.gCost = 0;
	this.hCost = 0;
	this.fCost = 0;
};

Node.prototype.toString = function(){
	return `[Coords: (${this.x}, ${this.y}), gCost:${this.gCost}, hCost:${this.hCost}, fcost:${this.fcost}]`
};

Node.prototype.isInBounds = function(grid){
	return x < grid[0].length && x >= 0 && y >= 0 && y < grid.length
};

Node.prototype.useManhattan = function(goalPoint){
	return Math.abs(this.x - goalPoint.x) + Math.abs(this.y - goalPoint.y); 
};

Node.prototype.setHCost = function(goalPoint){
	this.hCost = this.useManhattan(goalPoint)
}

Node.prototype.setGCost = function(){
	this.gCost = this.parent.gCost + 1;
};

Node.prototype.setFCost = function(){
	this.fCost = this.hCost + this.gCost
};

Node.prototype.setAllDistanceCosts = function(goalPoint){
	this.setGCost();
	this.setHCost(goalPoint);
	this.setFCost();
};


//Pathfinder
function Pathfinder(owner){
	this.owner = owner;
	this.startPoint = null;
	this.goalPoint = null;
	this.currentNode = null;
	this.openNodes = [];
	this.closedNodes = [];
	this.finalPath = [];
};

Pathfinder.prototype.connections = [[0,1], [0,-1], [1,0], [-1,0]];

Pathfinder.prototype.initLists = function(){
	this.openNodes   = [];
	this.closedNodes = [];
	this.finalPath   = [];
};

Pathfinder.prototype.retracePath = function(node){

	this.finalPath.push(node);

	if(node.parent !== null){
		
		this.retracePath(this.finalPath[this.finalPath.length -1].parent)
	};
};

Pathfinder.prototype.findLowestFCost = function(){
	this.openNodes.sort( (a, b) => a.fCost - b.fCost );
	return this.openNodes[0] 
};

Pathfinder.prototype.closeNode = function(node){
	this.removeNodeFromList(this.openNodes, node);
	this.closedNodes.push(node);
};

Pathfinder.prototype.recalculateTotalDistance = function(node, newParent){
 	let gCost = newParent.gCost + 1;
 	let hCost = node.useManhattan(this.goalPoint);

 	return gCost + hCost
};

Pathfinder.prototype.updateOpenNodes = function(nodeList){
	nodeList.forEach( (nodeCandidate) => {
		if( this.isClosed(nodeCandidate) ) return;

		if( !this.inOpenNodes(nodeCandidate) ){
			this.openNodes.push(nodeCandidate)
		}

		else{
			let newFCost = this.recalculateTotalDistance(nodeCandidate, this.currentNode);

			if(newFCost < nodeCandidate.fCost){
				nodeCandidate.fCost = newFCost;
				nodeCandidate.parent = this.currentNode;
			}
		}
	});
};

Pathfinder.prototype.inOpenNodes = function(node){
	return this.openNodes.find( (checkedNode) => checkedNode.x === node.x && checkedNode.y === node.y) !== undefined
};

Pathfinder.prototype.isClosed = function(node){
	return this.closedNodes.find( (checkedNode) => checkedNode.x === node.x && checkedNode.y === node.y ) !== undefined
};

Pathfinder.prototype.getNodeNeighbors = function(tileMap, parent){
	let neighbors = this.connections.map( (coords) => {
		let nodeX = parent.x + coords[0];
		let nodeY = parent.y + coords[1];

		const isCellValid = this.owner.canTraverse(tileMap, nodeX, nodeY);

		return ( isCellValid ) ? new Node(nodeX, nodeY, parent) : null
	})

	return neighbors.filter( (node) => node !== null )
};

Pathfinder.prototype.findNextNode = function(tileMap, node){
	let nodeNeighbors = this.getNodeNeighbors(tileMap, node);
	nodeNeighbors.forEach( (checkNode) => {checkNode.setAllDistanceCosts(this.goalPoint)});

	this.updateOpenNodes(nodeNeighbors);
	let nextNode = this.findLowestFCost(this.openNodes);
	return nextNode
};

Pathfinder.prototype.removeNodeFromList = function(arr, node){
	let index = arr.findIndex( (checkedNode) => node.x === checkedNode.x && node.y === checkedNode.y);

	if( index >= 0 ){
		arr.splice(index, 1)
	};
};

Pathfinder.prototype.search = function(tileMap, startX, startY, goalX, goalY){

	console.log("Search!");
	this.initLists();
	
	this.startPoint = new Node(startX, startY);
	this.goalPoint  = new Node(goalX, goalY);

	this.openNodes.push(this.startPoint);

	this.currentNode = this.startPoint;
	console.log(this.startPoint.x, this.startPoint.y)
	console.log(this.goalPoint.x, this.goalPoint.y)

    while(this.openNodes.length > 0){	

		if(this.currentNode.y === this.goalPoint.y && this.currentNode.x === this.goalPoint.x){
		    
		    this.retracePath(this.currentNode);

		    console.log(this.finalPath)

 		    return this.finalPath
		   
	    }

	    else{

	    	this.closeNode(this.currentNode);
	    	this.currentNode = this.findNextNode(tileMap, this.currentNode);
	    }
	}

	return []
};

export {Pathfinder};
