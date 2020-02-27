let GOAP =
{
	State: require("GOAP_State")
}

function PlannerNode(args)
{
	this.state = args.state
	this.action = args.action || null
	this.parent = args.parent || null

	this.g = args.g || 0 // cost from start
	this.h = args.h || 0 // heuristic cost to goal
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
		const canAffect = node.state.missing(action.preState) === 0
		const hasEffect = node.state.missing(action.postState) !== 0

		if (canAffect && hasEffect)
		{
			let state = new GOAP.State()
			state.merge(node.state)
			state.merge(action.postState)

			nodes.push(new PlannerNode(
			{
				state: state,
				action: name,
				parent: node,

				g: node.g + action.cost,
				h: state.heuristicDifference(this.goal)
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

		plan.reverse()

		return plan
	}

	return []
}

Planner.prototype.init = function(world, goal, actions)
{
	console.log("init")

	this.reset()

	this.goal = goal
	this.actions = actions

	console.log("goal: " + goal)

	let node = new PlannerNode(
	{
		state: world,
		h: world.heuristicDifference(this.goal)
	})

	this.open.push(node)
}

Planner.prototype.run = function()
{
	if (this.open.length === 0)
	{
		console.log("open nodes exhausted")
		return true
	}

	let node = this.open.pop()

	console.log(`open: ${node.state}`)

	this.closed.push(node)

	if (node.state.missing(this.goal) === 0)
	{
		console.log("found goal")
		this.found = node
		return true
	}

	let nodes = this.getChildren(node)

	console.log(`children: ${nodes.length}`)

	for (let index = 0, num = nodes.length; index < num; ++index)
	{
		let child = nodes[index]

		console.log("action: " + child.action)

		{
			let indexOpen = this.open.findIndex((openNode) =>
				child.state.equal(openNode.state))
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
					console.log("skip: open is better")
					continue
				}
			}
		}

		{
			let indexClosed = this.closed.findIndex((openNode) =>
				child.state.equal(openNode.state))
			if (indexClosed > -1)
			{
				let closedNode = this.closed[indexClosed]

				console.log("closed node found")
				console.log("closed: " + closedNode.state)
				console.log("child : " + child.state)

				if (closedNode.f > child.f)
				{
					// We're a better choice
					console.log("keep: closed is worse")
					this.closed.splice(closedIndex, 1)
				}
				else
				{
					console.log("skip: closed is better")
					continue
				}
			}
		}

		console.log("child: " + child.state)

		this.open.push(child)
	}

	// sort so we pop the next best choice
	this.open.sort((nodeA, nodeB) => nodeA.f < nodeB.f)

	return false // not done
}

module.exports = Planner
