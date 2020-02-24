
module.exports =
{
	tick: function(agent)
	{
		if (this._state === null) continue
		
		this._state.tick(this, agent)
	},
	
	setState: function(agent, state)
	{
		if (this._state !== null)
		{
			const success = this._state.exit(this, agent)
			if (!success)
			{
				throw Error("Failed to exit state")
			}
			
			this._state = null
		}
	
		if (state !== null)
		{
			const success = state.enter(this, agent)
			if (!success)
			{
				throw Error("Failed to enter state")
			}
	
			this._state = state
		}
	}
}
