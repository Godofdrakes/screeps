
let GOAP = 
{
	Action: require("GOAP_Action"),
	State: require("GOAP_State")
}

var Screeps =
{
	Flags: require("Screeps_WorldState")
}

function MoveToSource()
{
	GOAP.Action.call(this)

	this.name = "MoveToSource"
	this.cost = 1

	this.postState.set(Screeps.Flags.get("inRange_Source"), true)
}

MoveToSource.prototype.getTarget = function(agent)
{
	return Game.getObjectById(agent.memory.targetId)
}

MoveToSource.prototype.setTarget = function(agent, target)
{
	return agent.memory.targetId = target.id
}

MoveToSource.prototype.enter = function(agent)
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

MoveToSource.prototype.exit = function(agent)
{
	agent.memory.path = []
	agent.memory.pathIndex = 0
	return true
}

MoveToSource.prototype.tick = function(agent)
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

module.exports = MoveToSource
