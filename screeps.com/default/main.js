
let Screeps =
{
	Actions: require("Screeps/Action"),
	WorldState: require("Screeps/WorldState"),
}

let GOAP =
{
	Planner: require("GOAP/Planner"),
	State: require("GOAP/State"),
}

let Agent =
{
	Actions: new Map(
	[
		[ "MoveToSource", new Screeps.Actions.MoveToSource() ],
		[ "HarvestSource", new Screeps.Actions.HarvestSource() ],
		[ "MoveToSpawn", new Screeps.Actions.MoveToSpawn() ],
		[ "DepositSource", new Screeps.Actions.DepositSource() ],
	]),

	World: new GOAP.State(
	[
		[ GOAP.Flags.hasEnergy, false ],
	]),
	
	Goal: new GOAP.State(
	[
		[ GOAP.Flags.hasEnergy, true ],
	])
}

var Planner = new GOAP.Planner()

module.exports.loop = function()
{
	let agent = Game.creep["Agent"]

	if (agent == null)
	{
		var err = Game.spawns["Home"].spawnCreep([WORK, CARRY, MOVE], "Agent")
		if (err != OK)
		{
			console.log(`Failed to spawn Agent [Err:${err}]`)
		}

		return
	}

	if (agent.spawning)
	{
		return // wait for spawn to finish
	}
}

module.exports.plan = function()
{
	Planner.init(Agent.World, Agent.Goal, Agent.Actions)

	let plan = []
	let count = 0

	while (true)
	{
		if (count++ < 100)
		{
			console.log("Planning timed out")
			break
		}

		if (Planner.run())
		{
			console.log("Planning complete")
			plan = Planner.getPlan()
			break
		}
	}

	console.log(`Plan length: ${plan.length}`)

	for (let index = 0, num = plan.length; index < num; ++index)
	{
		console.log(`${index}: ${plan[index]}`)
	}
}
