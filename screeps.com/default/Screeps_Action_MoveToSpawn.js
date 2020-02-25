
let GOAP = 
{
	Action: require("GOAP_Action"),
	State: require("GOAP_State")
}

let Screeps =
{
	Flags: require("Screeps_WorldState")
}

function MoveToSpawn()
{
	GOAP.Action.call(this)

	this.name = "MoveToSpawn"
	this.cost = 1

	this.postState.set(Screeps.Flags.inRange_Spawn, true)
}

MoveToSpawn.prototype.getTarget = function(agent)
{
	return Game.getObjectById(agent.memory.targetId)
}

MoveToSpawn.prototype.setTarget = function(agent, target)
{
	return agent.memory.targetId = target.id
}

MoveToSpawn.prototype.enter = function(agent)
{
	var spawns = agent.room.find(FIND_MY_SPAWNS)
	for (var spawn of spawns)
	{
		var path = agent.room.findPath(agent.pos, spawn.pos)
		if (path !== null && path.length > 0)
		{
			console.log(`moving to: ${spawn.id}`)
			agent.memory.path = path
			agent.memory.pathIndex = 0
			this.setTarget(agent, spawn)
			return true
		}
	}

	return false
}

MoveToSpawn.prototype.exit = function(agent)
{
	agent.memory.path = []
	agent.memory.pathIndex = 0
	return true
}

MoveToSpawn.prototype.tick = function(agent)
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

module.exports = MoveToSpawn
