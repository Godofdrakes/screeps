
var GOAP = 
{
	Action: require("GOAPAction"),
	Flags: require("GOAPFlags"),
	World: require("GOAPWorld")
}

function Action_MoveToSpawn()
{
	GOAP.Action.call(this, { name: "MoveToSpawn", cost: 1 })

	this.preState = new GOAP.World(GOAP.Flags)
	
	this.postState = new GOAP.World(GOAP.Flags)
	this.postState[GOAP.Flags.inRange_Spawn] = true
}

Action_MoveToSpawn.prototype.getTarget = function(agent)
{
	return Game.getObjectById(agent.memory.targetId)
}

Action_MoveToSpawn.prototype.setTarget = function(agent, target)
{
	return agent.memory.targetId = target.id
}

Action_MoveToSpawn.prototype.enter = function(agent)
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

Action_MoveToSpawn.prototype.exit = function(agent)
{
	agent.memory.path = []
	agent.memory.pathIndex = 0
	return true
}

Action_MoveToSpawn.prototype.tick = function(agent)
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

module.exports = Action_MoveToSpawn
