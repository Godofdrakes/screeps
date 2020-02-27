
function AStar(args)
{
	this.goal = null
	this.result = []

	this.openSet = []
	this.cameFrom = new Map()
	
	this.gScore = new Map() // cost from start (actual)
	this.fScore = new Map() // cost from start to goal (assumed)
}

AStar.prototype.sortOpenNodes = function()
{
	let predicate = (nodeA, nodeB) =>
	{
		let gScoreA = this.gScore.get(this.getKey(nodeA))
		let gScoreB = this.gScore.get(this.getKey(nodeB))
		return gScoreA < gScoreB
	}

	this.openSet.sort(predicate);
}

AStar.prototype.hasOpenNode = function(node)
{
	let nodeKey = this.getKey(node)
	let predicate = (other) => { nodeKey == this.getKey(other) }
	return this.openSet.some(predicate)
}

AStar.prototype.openNode = function()
{
	if (this.openSet.length === 0)
	{
		console.log("nodes exhausted")
		return null
	}

	return this.openSet.pop()
}

AStar.prototype.isGoal = function(node)
{
	throw Error("Not implemented")
}

AStar.prototype.getKey = function(node)
{
	throw Error("Not implemented")
	return ""
}

AStar.prototype.getChildren = function(node)
{
	throw Error("Not implemented")
	return []
}

AStar.prototype.getDScore = function(node)
{
	throw Error("Not implemented")
	return 0
}

AStar.prototype.getHScore = function(node)
{
	throw Error("Not implemented")
	return 0
}

AStar.prototype.addToPath = function(path, node)
{
	throw Error("Not implemented")
}

AStar.prototype.buildPath = function(node)
{
	let path = []
	let nodeKey = this.getKey(node)

	while (this.cameFrom.get(nodeKey) != null)
	{
		this.addToPath(path, node)
		node = this.cameFrom.get(nodeKey)
		nodeKey = this.getKey(node)
	}

	path.reverse()

	return path
}

AStar.prototype.init = function(start, goal)
{
	this.goal = goal
	this.result = []
	
    // The set of discovered nodes that may need to be (re-)expanded.
    // Initially, only the start node is known.
	this.openSet = [ start ]
	this.cameFrom = new Map()
	
	this.gScore = new Map()
	this.fScore = new Map()

	{
		let startKey = this.getKey(start)
		
		 // For node n, cameFrom[n] is the node immediately preceding
		 // it on the cheapest path from start to n currently known.
		this.cameFrom.set(startKey, null)
		
		// For node n, gScore[n] is the cost of the cheapest path
		// from start to n currently known.
		this.gScore.set(startKey, 0)

    	// For node n, fScore[n] := gScore[n] + h(n).
		this.fScore.set(startKey, this.getHScore(start))
	}
}

AStar.prototype.run = function()
{
	let node = this.openNode()

	if (node === null)
	{
		return true
	}

	if (this.isGoal(node))
	{
		this.result = this.buildPath(node)
		return true
	}

	let nodeKey = this.getKey(node)
	let gScoreNode = this.gScore.get(nodeKey)

	for (let child of this.getChildren(node))
	{
		let childKey = this.getKey(child)
		
		// d(current,neighbor) is the weight of the edge from current to neighbor
		// tentative_gScore is the distance from start to the neighbor through current
		let gScoreChild = gScoreNode + this.getDScore(child)

		if (!this.gScore.has(childKey) || this.gScore.get(childKey) > gScoreChild)
		{
			// This path to neighbor is better than any previous one. Record it!
			this.cameFrom.set(childKey, node)
			this.gScore.set(childKey, gScoreChild)
			this.fScore.set(childKey, gScoreChild + this.getHScore(child))

			if (!this.hasOpenNode(child))
			{
				this.openSet.push(child)
			}
		}
	}

	this.sortOpenNodes()

	return false
}

module.exports = AStar
