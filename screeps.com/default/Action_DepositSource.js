
var GOAP = 
{
	Action: require("GOAPAction"),
	Flags: require("GOAPFlags"),
	World: require("GOAPWorld")
}

function Action_DepositSource()
{
	GOAP.Action.call(this, { name: "DepositSource", cost: 1 })

	this.preState = new GOAP.World(GOAP.Flags)
	this.preState[GOAP.Flags.inRange_Spawn] = true
	this.preState[GOAP.Flags.hasEnergy] = true

	this.postState = new GOAP.World(GOAP.Flags)
	this.postState[GOAP.Flags.inRange_Spawn] = false
	this.postState[GOAP.Flags.hasEnergy] = false
}

Action_DepositSource.prototype.getTarget = function(agent)
{
	return Game.getObjectById(agent.memory.targetId)
}

Action_DepositSource.prototype.enter = function(agent)
{
	if (agent.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
	{
		return this.getTarget(agent) !== null
	}
	
	return false
}

Action_DepositSource.prototype.exit = function(agent)
{
	return agent.store.getUsedCapacity(RESOURCE_ENERGY) === 0
}

Action_DepositSource.prototype.tick = function(agent)
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

module.exports = Action_DepositSource
