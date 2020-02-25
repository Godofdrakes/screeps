let GOAP =
{
	State: require("GOAP/State")
}

function PlannerNode(args)
{
	this.state = args.state
	this.action = args.action || null
	this.parent = args.parent || null

	this.g = args.g || 0 // cost from start
	this.h = args.h || 0 // heuristic
	this.f = this.g + this.h
}

function Planner()
{
	this.open = new Array()
	this.closed = new Array()
	this.actions = new Map()

	this.goal = 0
	this.found = null
}

Planner.prototype.getChildren = function(node)
{
	let nodes = []

	for (let [name, action] of this.actions)
	{
		let state = new GOAP.State()
		state.merge(node.state)
		state.merge(action.postState)

		const canAffect = state.missing(action.preState) === 0
		const hasEffect = state.equal(action.postState) !== true

		if (canAffect && hasEffect)
		{
			nodes.push(new PlannerNode(
			{
				state: state,
				action: name,
				parent: node,

				g: node.g + action.cost,
				h: state.missing(this.goal)
			}))
		}
	}

	return nodes
}

Planner.prototype.reset = function()
{
	this.open = new Array()
	this.closed = new Array()
	this.actions = new Map()
}

Planner.prototype.getPlan = function()
{
	if (this.found)
	{
		let plan = []
		let node = this.found

		while (node.parent !== null)
		{
			plan.push(node.action)
			node = node.parent
		}

		return plan
	}

	return []
}

Planner.prototype.init = function(world, goal, actions)
{
	this.reset()

	this.goal = goal
	this.actions = actions

	let node = new PlannerNode(
	{
		state: world,
		h: this.heuristic(node, goal)
	})
	this.open.push(node)
}

Planner.prototype.run = function()
{
	if (this.open.length === 0)
		return true // no nodes to open

	let node = this.open.pop()

	this.closed.push(node)

	if (GOAP.State.missing(node.state, goal))
	{
		this.found = node
		return true // found goal
	}

	let nodes = this.getChildren(node)

	for (let index = 0, num = nodes.length; index < num; ++index)
	{
		let child = nodex[index]

		{
			let indexOpen = this.open.findIndex((openNode) =>
				GOAP.State.equal(openNode.state, child.state))
			if (indexOpen > -1)
			{
				let openNode = this.open[indexOpen]

				if (openNode.g > child.g)
				{
					// We're a better choice
					this.open.splice(openIndex, 1)
				}
				else
				{
					// We're a worse choice
					continue
				}
			}
		}

		{
			let indexClosed = this.closed.findIndex((openNode) =>
				GOAP.State.equal(openNode.state, child.state))
			if (indexClosed > -1)
			{
				let closedNode = this.closed[indexClosed]

				if (closedNode.g > child.g)
				{
					// We're a better choice
					this.closed.splice(closedIndex, 1)
				}
				else
				{
					continue
				}
			}
		}

		this.open.push(child)
	}

	// sort so we pop the next best choice
	this.open.sort((nodeA, nodeB) =>
		nodeA.missing(this.goal) > nodeB.missing(this.goal))

	return false // not done
}

module.exports = Planner
