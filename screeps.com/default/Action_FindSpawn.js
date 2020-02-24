
var GOAP = 
{
	Action: require("GOAPAction"),
	Flags: require("GOAPFlags"),
	World: require("GOAPWorld")
}

function Action_FindSpawn()
{
	GOAP.Action.call(this, { name: "FindSpawn", cost: 1 })

	this.preState = new GOAP.World(GOAP.Flags)

	this.postState = new GOAP.World(GOAP.Flags)
	this.postState[GOAP.Flags.hasTarget_Spawn] = true
}

Action_FindSource.prototype.setTarget = function(agent, target)
{
	return agent.memory.targetId = target.id
}

Action_FindSource.prototype.enter = function(agent)
{
	var spawns = agent.room.find(FIND_MY_SPAWNS)
	for (var spawn of spawns)
	{
		if (spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
		{
			this.setTarget(agent, spawn)
			return true
		}
	}

	return false
}

module.exports = Action_FindSource
