
var GOAP = 
{
	Action: require("GOAPAction"),
	Flags: require("GOAPFlags"),
	World: require("GOAPWorld")
}

function Action_MoveToSource()
{
	GOAP.Action.call(this, { name: "MoveToSource", cost: 1 })

	this.preState = new GOAP.World(GOAP.Flags)
	
	this.postState = new GOAP.World(GOAP.Flags)
	this.postState[GOAP.Flags.inRange_Source] = true
}

Action_MoveToSource.prototype.getTarget = function(agent)
{
	return Game.getObjectById(agent.memory.targetId)
}

Action_MoveToSource.prototype.setTarget = function(agent, target)
{
	return agent.memory.targetId = target.id
}

Action_MoveToSource.prototype.enter = function(agent)
{
	var sources = agent.room.find(FIND_SOURCES)
	for (var source of sources)
	{
		if (source.energy > 0)
		{
			var path = agent.room.findPath(agent.pos, source.pos)
			if (path !== null && path.length > 0)
			{
				console.log(`moving to: ${source.id}`)
				agent.memory.path = path
				agent.memory.pathIndex = 0
				this.setTarget(agent, source)
				return true
			}
		}
	}

	return false
}

Action_MoveToSource.prototype.exit = function(agent)
{
	agent.memory.path = []
	agent.memory.pathIndex = 0
	return true
}

Action_MoveToSource.prototype.tick = function(agent)
{
	var path = agent.memory.path

	//console.log(`index: ${agent.memory.pathIndex}`)

	if (agent.memory.pathIndex < path.length)
	{
		if (agent.move(path[agent.memory.pathIndex].direction) == OK)
		{
			agent.memory.pathIndex += 1
		}
		return false
	}

	return true
}

module.exports = Action_MoveToSource
