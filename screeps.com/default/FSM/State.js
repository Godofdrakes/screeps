function State()
{
	this.name = "State"
}

State.prototype.enter = function(machine, agent)
{
	return true // success?
}

State.prototype.exit = function(machine, gent)
{
	return true // success?
}

State.prototype.tick = function(machine, agent)
{
	return true // complete?
}

module.exports = State
