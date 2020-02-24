var GOAPWorld = require("GOAPWorld")

function Action_Base(args)
{
	this.name = args.name || "Invalid"
	this.cost = args.cost || 0
	this.preState = null
	this.postState = null
}

Action_Base.prototype.toString = function()
{
	return "[GOAPAction " + this.name + "]"
}

Action_Base.prototype.enter = function(agent)
{
	return true // @todo: success
}

Action_Base.prototype.exit = function(agent)
{
	return true // @todo: success
}

Action_Base.prototype.tick = function(agent)
{
	return true // @todo: is done
}

module.exports = Action_Base
