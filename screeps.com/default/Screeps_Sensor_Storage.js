
let Sensor = require("GOAP_Sensor")
let WorldState = require("Screeps_WorldState")

function Storage()
{
	Sensor.call(this, { name: "Storage" })
}

Storage.prototype.tick = function(agent, state)
{
	let energy = agent.store.getUsedCapacity(RESOURCE_ENERGY);
	state.set(WorldState.get("hasEnergy"), energy > 0)
}

module.exports = Storage
