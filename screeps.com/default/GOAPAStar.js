
var GOAP =
{
	Flags: require("GOAPFlags"),
	World: require("GOAPWorld"),
}

function GOAPAStarNode(args)
{
	this.g = args.g || 0 // distance from goal
	this.h = args.h || 0 // heuristic
	this.f = args.f || this.g + this.h // total cost

	this.state = args.state
	this.action = args.action || null
	this.parent = args.parent || null
}

function GOAPAStar(args)
{
	this.open = []
	this.closed = []
	this.transitions = []
}

GOAPAStar.prototype.run = function(worldState, goalState, actions)
{
	var iteration = 0

	this.open.length = 0
	this.closed.length = 0
	this.transitions.length = 0

	// console.log("goal: " + goalState)
	//
	// actions.forEach((action, name, map) =>
	// {
	// 	console.log(`action: '${name}'`)
	//
	// 	for (let field in action)
	// 		console.log(` ${field}: ${action[field]}`)
	// })

	this.open.push(new GOAPAStarNode(
	{
		g: 0,
		h: worldState.difference(goalState),
		state: worldState
	}));

	while(true)
	{
		console.log(" ")

		if (++iteration > 10)
		{
			console.log("max iterations reached")
			return null
		}

		if (this.open.length == 0)
		{
			console.log("open nodes: exhausted")
			return null
		}
		else
		{
			//console.log(`open nodes: ${this.open.length}`)
		}
		
		var node = this.open.pop()

		if (node.state.difference(goalState) == 0)
		{
			//console.log("found goal")
			return getPlan(node)
		}
		else
		{
			//console.log(`node: ${node.state}`)
			//console.log(`node.g: ${node.g}`)
			//console.log(`node.h: ${node.h}`)
			//console.log(`node.f: ${node.f}`)
		}
		
		this.closed.push(node)

		var children = getChildrenFromState(actions, node.state)

		//console.log(`children: ${children.length}`)
		
		for (var index = 0, num = children.length; index < num; index++)
		{
			var name = children[index].name
			var action = children[index].action
			var state = children[index].state
			var cost = node.g + action.cost

			//console.log(`child: ${name}`)

			{
				var openIndex = findNode(this.open, state)
				if (openIndex !== -1)
				{
					//console.log("open node!")

					if (cost < this.open[openIndex].g)
					{
						// We're a better choice
						//console.log("skip open")
						this.open.splice(openIndex, 1)
					}
					else
					{
						//console.log("skip child")
						continue
					}
				}
			}

			{
				var closedIndex = findNode(this.closed, state)
				if (closedIndex !== -1)
				{
					//console.log("closed node!")

					if (cost < this.closed[closedIndex].g)
					{
						//console.log("skip closed")
						this.closed.splice(closedIndex, 1)
					}
					else
					{
						//console.log("skip child")
						continue
					}
				}
			}

			//console.log("opened child node")

			var child = new GOAPAStarNode(
			{
				g: cost,
				h: state.difference(goalState),
				
				state: state,
				action: action,
				parent: node,
			})
			this.open.push(child)
		}
	}
}

function findNode(nodes, state)
{
	console.log("find")
	console.log(state)

	for (var index = 0, num = nodes.length; index < num; ++index)
	{
		console.log(nodes[index].state)

		if (nodes[index].state.equal(state))
		{
			console.log("equal")
			return index
		}
	}
	
	return -1
}

function getChildrenFromState(actions, state)
{
	var children = []

	//console.log("node: " + state)

	for (let [name, action] of actions)
	{
		//console.log(name + ": " + action.preState)

		var missing = state.difference(action.preState)

		//console.log("missing " + missing)

		if (missing == 0)
		{
			var child = {}
			child.name = name
			child.action = action
			child.state = new GOAP.World(GOAP.Flags).append(state).append(action.postState)

			children.push(child)
		}
	}

	return children
}

function getPlan(node)
{
	var plan = new Array()

	while (node != null)
	{
		if (node.action !== null)
		{
			plan.push(node.action.name)
		}

		node = node.parent
	}

	plan.reverse()

	return plan
}

module.exports = GOAPAStar
