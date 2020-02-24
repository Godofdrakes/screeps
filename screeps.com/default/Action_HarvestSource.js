
var GOAP = 
{
	Action: require("GOAPAction"),
	Flags: require("GOAPFlags"),
	World: require("GOAPWorld")
}

function Action_HarvestSource()
{
	GOAP.Action.call(this, { name: "HarvestSource", cost: 1 })

	this.preState = new GOAP.World(GOAP.Flags)
	this.preState[GOAP.Flags.inRange_Source] = true

	this.postState = new GOAP.World(GOAP.Flags)
	this.postState[GOAP.Flags.inRange_Source] = false
	this.postState[GOAP.Flags.hasEnergy] = true
}

Action_HarvestSource.prototype.getTarget = function(agent)
{
	return Game.getObjectById(agent.memory.targetId)
}

Action_HarvestSource.prototype.enter = function(agent)
{
	if (agent.store.getFreeCapacity[RESOURCE_ENERGY] !== 0)
	{
		return this.getTarget(agent) !== null
	}
	
	return false
}

Action_HarvestSource.prototype.exit = function(agent)
{
	return agent.store.getFreeCapacity(RESOURCE_ENERGY) === 0
}

Action_HarvestSource.prototype.tick = function(agent)
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

module.exports = Action_HarvestSource
