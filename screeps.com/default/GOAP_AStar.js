let AStar = require("AStar")
let State = require("GOAP_State")

function GOAPAStar()
{
	AStar.call(this)

	this.actions = new Map()
}

GOAPAStar.prototype.isGoal = function(node)
{
	// Node state satisfies all the conditions of goal state
	return node.state.missing(goal.state) === 0
}

GOAPAStar.prototype.getKey = function(node)
{
	return node.state.toJSON()
}

GOAPAStar.prototype.getChildren = function(node)
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
		state.merge(node.state)
		state.merge(action.postState)

		if (node.state.equal(postState))
		{
			// Action has no effect on state
			continue
		}

		return { state: postState, actionName: name, actionCost: action.cost }
	}

	return children
}

GOAPAStar.prototype.getDScore = function(node)
{
	return node.actionCost
}

GOAPAStar.prototype.getHScore = function(node)
{
	return node.state.missing(this.goal.state)
}

GOAPAStar.prototype.addToPath = function(path, node)
{
	path.push(node.actionName)
}

GOAPAStar.prototype.init = function(start, goal, actions)
{
	let startNode = { state: start, actionName: "", actionCost: 0 }
	let goalNode = { state: goal, actionName: "", actionCost: 0 }
	this.actions = actions

	AStar.prototype.init.call(this, startNode, goalNode)
}

module.exports = GOAPAStar
