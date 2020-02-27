let AStar = require("AStar")
let State = require("GOAP_State")

function GOAP_AStar(args)
{
	AStar.call(this, args)

	this.actions = new Map()
}

GOAP_AStar.prototype = Object.create(AStar.prototype)

Object.defineProperty(GOAP_AStar.prototype, 'constructor',
{
	value: GOAP_AStar,
	enumerable: false,
	writable: true
})

GOAP_AStar.prototype.openNode = function()
{
	let node = AStar.prototype.openNode.call(this)

	if (node !== null)
	{
		console.log(`node   : ${node.state}`)
		console.log(` action: ${node.actionName}`)
	}

	return node
}

GOAP_AStar.prototype.isGoal = function(node)
{
	// Node state satisfies all the conditions of goal state
	if (node.state.missing(this.goal.state) === 0)
	{
		console.log(`found: ${node.state}`)
		return true
	}

	return false
}

GOAP_AStar.prototype.getKey = function(node)
{
	return node.state.toJSON()
}

GOAP_AStar.prototype.getChildren = function(node)
{
	let children = []

	for (let [name, action] of this.actions)
	{
		if (node.state.missing(action.preState) !== 0)
		{
			// Action cannot affect state
			continue
		}

		let postState = new State()
		postState.merge(node.state)
		postState.merge(action.postState)

		if (node.state.equal(postState))
		{
			// Action has no effect on state
			continue
		}

		children.push({
			state: postState,
			actionName: name,
			actionCost: action.cost
		})
	}

	return children
}

GOAP_AStar.prototype.getDScore = function(node)
{
	return node.actionCost
}

GOAP_AStar.prototype.getHScore = function(node)
{
	return node.state.missing(this.goal.state)
}

GOAP_AStar.prototype.addToPath = function(path, node)
{
	path.push(node.actionName)
}

GOAP_AStar.prototype.init = function(start, goal, actions)
{
	let startNode = { state: start, actionName: "", actionCost: 0 }
	let goalNode = { state: goal, actionName: "", actionCost: 0 }
	this.actions = actions

	console.log(`goal: ${goal}`)

	AStar.prototype.init.call(this, startNode, goalNode)
}

module.exports = GOAP_AStar
