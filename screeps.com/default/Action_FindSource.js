
var GOAP = 
{
	Action: require("GOAPAction"),
	Flags: require("GOAPFlags"),
	World: require("GOAPWorld")
}

function Action_FindSource()
{
	GOAP.Action.call(this, { name: "FindSource", cost: 1 })

	this.preState = new GOAP.World(GOAP.Flags)

	this.postState = new GOAP.World(GOAP.Flags)
	this.postState[GOAP.Flags.hasTarget_Source] = true
}

Action_FindSource.prototype.setTarget = function(agent, target)
{
	return agent.memory.targetId = target.id
}

Action_FindSource.prototype.enter = function(agent)
{
	var sources = agent.room.find(FIND_SOURCES)
	for (var source of sources)
	{
		if (source.energy > 0)
		{
			this.setTarget(agent, source)
			return true
		}
	}

	return false
}

module.exports = Action_FindSource
