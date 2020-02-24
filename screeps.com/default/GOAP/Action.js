
function Action()
{
	this.name = "ActionBase"
	this.cost = 0
	this.preState = []
	this.postState = []
}

Action.prototype.toString = function()
{
	return "[Action " + this.name + "]"
}

Action.prototype.enter = function(agent)
{
	return true // @todo: success
}

Action.prototype.exit = function(agent)
{
	return true // @todo: success
}

Action.prototype.tick = function(agent)
{
	return true // @todo: is done
}

module.exports = Action
