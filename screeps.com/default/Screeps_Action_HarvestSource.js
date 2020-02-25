
let GOAP = 
{
	Action: require("GOAP_Action"),
	State: require("GOAP_State")
}

let Screeps =
{
	Flags: require("Screeps_WorldState")
}

function HarvestSource()
{
	GOAP.Action.call(this)

	this.name = "HarvestSource"
	this.cost = 1

	this.preState.set(Screeps.Flags.inRange_Source, true)

	this.postState.set(Screeps.Flags.inRange_Source, false)
	this.postState.set(Screeps.Flags.hasEnergy, false)
}

HarvestSource.prototype.getTarget = function(agent)
{
	return Game.getObjectById(agent.memory.targetId)
}

HarvestSource.prototype.enter = function(agent)
{
	if (agent.store.getFreeCapacity[RESOURCE_ENERGY] !== 0)
	{
		return this.getTarget(agent) !== null
	}
	
	return false
}

HarvestSource.prototype.exit = function(agent)
{
	return agent.store.getFreeCapacity(RESOURCE_ENERGY) === 0
}

HarvestSource.prototype.tick = function(agent)
{
	//console.log(`energy: ${agent.store.getFreeCapacity(RESOURCE_ENERGY)}`)

	if (agent.store.getFreeCapacity(RESOURCE_ENERGY) === 0)
		return true
	
	var target = this.getTarget(agent)
	if (target === null)
		return true
	
	var err = agent.harvest(target)
	if (err !== OK)
		return true
	
	return false
}

module.exports = HarvestSource
