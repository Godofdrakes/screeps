var Enum = require("Enum")

var GOAP =
{
	Action: require("GOAPAction"),
	Flags: require("GOAPFlags"),
	Planner: require("GOAPAStar"),
	World: require("GOAPWorld"),
}

var ScreepActions = require("ScreepActions")

var World = new GOAP.World(GOAP.Flags,
[
	[ GOAP.Flags.inRange, false ],
	[ GOAP.Flags.hasTarget, false ],
	[ GOAP.Flags.hasEnergy, false ],
])

var World2 = new GOAP.World(GOAP.Flags,
[
	[ GOAP.Flags.inRange, false ],
	[ GOAP.Flags.hasTarget, false ],
	[ GOAP.Flags.hasEnergy, true ],
])

var GetEnergy = new GOAP.World(GOAP.Flags,
[
	[ GOAP.Flags.hasEnergy, true ]
])

var GiveEnergy = new GOAP.World(GOAP.Flags,
[
	[ GOAP.Flags.hasEnergy, false ]
])

var Actions = new Map(
[
	[ "MoveToSource", new ScreepActions.MoveToSource() ],
	[ "HarvestSource", new ScreepActions.HarvestSource() ],
	[ "MoveToSpawn", new ScreepActions.MoveToSpawn() ],
	[ "DepositSource", new ScreepActions.DepositSource() ],
])

var Planner = new GOAP.Planner()

function getStep(agent)
{
	var plan = agent.memory.plan
	var index = agent.memory.step

	if (index >= 0 && index < plan.length)
	{
		return Actions.get(plan[index])
	}

	return null
}

module.exports.loop = function()
{
	var agent = Game.creeps["Agent"]

	if (agent == null)
		return

	if (agent.spawning === true)
		return

	if (agent.memory.plan.length === 0)
		return
	
	var step = getStep(agent)
	
	if (agent.memory.stepDone === true)
	{
		agent.memory.stepDone = false

		if (step != null)
		{
			if (step.exit(agent))
			{
				console.log(`exit step ${step.name}`)
			}
			else
			{
				console.log(`failed to exit step ${step.name}`)

				agent.memory.plan = []
				agent.memory.step = -1
			}
		}

		agent.memory.step++

		console.log(`step: ${agent.memory.step + 1}/${agent.memory.plan.length}`)

		step = getStep(agent)

		if (step == null)
		{
			console.log("plan complete")

			agent.memory.plan = []
			agent.memory.step = -1
		}
		else if (!step.enter(agent))
		{
			console.log(`failed to enter step ${step.name}`)

			agent.memory.plan = []
			agent.memory.step = -1
		}
		else
		{
			console.log(`enter step ${step.name}`)
		}
	}
	
	if (step != null)
	{
		//console.log(`tick: ${step.name}`)
		agent.memory.stepDone = step.tick(agent)
	}
}

module.exports.spawn = function()
{
	var err = Game.spawns["Home"].spawnCreep([WORK, CARRY, MOVE], "Agent")
	if (err == OK)
	{
		console.log("Spawning Agent")

		var agent = Game.creeps["Agent"]
		agent.memory.stepDone = false
		agent.memory.step = -1
		agent.memory.plan = []
	}
	else
	{
		console.log("Failed to spawn Agent")
	}

	return err
}

module.exports.getEnergy = function()
{
	console.log("planning")

	var plan = Planner.run(World, GetEnergy, Actions)

	if (plan && plan.length > 0)
	{
		console.log("Planning finished")

		plan.forEach((step) => console.log(step))

		var agent = Game.creeps["Agent"]

		agent.memory.stepDone = true
		agent.memory.step = -1
		agent.memory.plan = plan
	}
	else
	{
		console.log("Planning failed")
	}
}

module.exports.giveEnergy = function()
{
	console.log("planning")

	var plan = Planner.run(World2, GiveEnergy, Actions)

	if (plan && plan.length > 0)
	{
		console.log("Planning finished")

		plan.forEach((step) => console.log(step))

		var agent = Game.creeps["Agent"]

		agent.memory.stepDone = true
		agent.memory.step = -1
		agent.memory.plan = plan
	}
	else
	{
		console.log("Planning failed")
	}
}
