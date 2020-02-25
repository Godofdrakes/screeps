
function StateMachine(args)
{
	this.name = args.name || "StateMachine"
	this.stateMap = new Map(args.states || [])
}

StateMachine.prototype.enterState = function(agent, state)
{
	if (state.enter(this, agent))
	{
		agent.memory[this.name].state = state.name
		return true
	}

	return false
}

StateMachine.prototype.exitState = function(agent, state)
{
	if (state.exit(this, agent))
	{
		agent.memory[this.name].state = null
		return true
	}

	return false
}

StateMachine.prototype.tickState = function(agent)
{
	var agentState = agent.memory[this.name].state
	var state = this.stateMap.get(agentState)
	
	if (state)
	{
		return state.tick(this, agent)
	}

	return true
}
