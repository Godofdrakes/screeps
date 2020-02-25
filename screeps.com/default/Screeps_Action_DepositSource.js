
let GOAP = 
{
	Action: require("GOAP_Action"),
	State: require("GOAP_State")
}

let Screeps =
{
	Flags: require("Screeps_WorldState")
}

function DepositSource()
{
	GOAP.Action.call(this)

	this.name = "DepositSource"
	this.cost = 1

	this.preState.set(Screeps.Flags.inRange_Spawn, true)
	this.preState.set(Screeps.Flags.hasEnergy, true)

	this.postState.set(Screeps.Flags.inRange_Spawn, false)
	this.postState.set(Screeps.Flags.hasEnergy, false)
}

DepositSource.prototype.getTarget = function(agent)
{
	return Game.getObjectById(agent.memory.targetId)
}

DepositSource.prototype.enter = function(agent)
{
	if (agent.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
	{
		return this.getTarget(agent) !== null
	}
	
	return false
}

DepositSource.prototype.exit = function(agent)
{
	return agent.store.getUsedCapacity(RESOURCE_ENERGY) === 0
}

DepositSource.prototype.tick = function(agent)
{
	if (agent.store.getUsedCapacity(RESOURCE_ENERGY) === 0)
	{
		return true
	}
	
	var target = this.getTarget(agent)
	if (target === null)
	{
		return true
	}
	
	var err = agent.transfer(target, RESOURCE_ENERGY)
	if (err == ERR_FULL)
	{
		agent.drop(RESOURCE_ENERGY)
	}
	
	return false
}

module.exports = DepositSource
