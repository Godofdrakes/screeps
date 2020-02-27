
let Screeps =
{
	Actions: require("Screeps_Actions"),
	Flags: require("Screeps_WorldState"),
	Sensors: require("Screeps_Sensors"),
}

let GOAP =
{
	AStar: require("GOAP_AStar"),
	State: require("GOAP_State"),
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

	Sensors: new Map(
	[
		[ "Storage", new Screeps.Sensors.Storage() ],
	]),

	World: new GOAP.State(),
	
	Goal: new GOAP.State(
	[
		[ Screeps.Flags.get("hasEnergy"), true ],
	])
}

let Planner = new GOAP.AStar()

module.exports.loop = function()
{
	let agent = Game.creeps["Agent"]

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

	if (agent.memory["world"] != null)
	{
		Agent.World = new GOAP.State()
		Agent.World.fromJSON(agent.memory["world"])
	}

	for (let [name, sensor] of Agent.Sensors)
	{
		sensor.tick(agent, Agent.World)
	}

	agent.memory["world"] = Agent.World.toJSON()

//	console.log(Agent.World)

	let plan = agent.memory.plan || []

	if (plan.length > 0)
	{
		if (agent.memory.planInit)
		{
			agent.memory.planInit = false

			let actionName = agent.memory.plan[agent.memory.planIndex]
			let action = Agent.Actions.get(actionName)
			if (!action.enter(agent))
			{
				console.log("failed to enter: " + action)
				agent.memory.plan = null
				agent.memory.planIndex = 0
				agent.memory.planInit = false
			}
		}

		{
			let actionName = agent.memory.plan[agent.memory.planIndex]
			let action = Agent.Actions.get(actionName)

			if (action == null)
			{
				throw Error(`Failed to get action ${actionName} at index ${agent.memory.planIndex} of plan ${plan}`)
			}
	
			if (action.tick(agent))
			{
				if (action.exit(agent))
				{
					agent.memory.planInit = true
					++agent.memory.planIndex
				}
				else
				{
					console.log("failed to exit: " + action)
					agent.memory.plan = null
					agent.memory.planIndex = 0
					agent.memory.planInit = false
				}
			}
		}

		if (agent.memory.planIndex >= agent.memory.plan.length)
		{
			agent.memory.plan = null
			agent.memory.planIndex = 0
			agent.memory.planInit = false
		}
	}
}

module.exports.plan = function()
{
	Planner.init(Agent.World, Agent.Goal, Agent.Actions)

	let plan = []
	let count = 0

	console.log("planning")

	while (true)
	{
		console.log(`\niteration: ${count}`)

		if (count++ > 100)
		{
			console.log("Planning timed out")
			break
		}

		if (Planner.run())
		{
			console.log("Planning complete")
			plan = Planner.finalPath
			break
		}
	}

	console.log(`Plan length: ${plan.length}`)

	for (let index = 0, num = plan.length; index < num; ++index)
	{
		console.log(`${index}: ${plan[index]}`)
	}

	if (plan.length > 0)
	{
		let agent = Game.creeps["Agent"]

		if (agent != null)
		{
			agent.memory.plan = plan
			agent.memory.planIndex = 0
			agent.memory.planInit = true
		}
	}
}
