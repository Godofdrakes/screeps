
function GOAPWorld(flags, array)
{
	Array.call(this)
	
	this.flags = flags

	if (array)
	{
		for (var index = 0, num = array.length; index < num; ++index)
		{
			this[array[index][0]] = array[index][1]
		}
	}
}

GOAPWorld.prototype.save = function(memory)
{
	memory = new Array(this.flags.count)

	for (var index = 0, num = this.flags.count; index < num; ++index)
	{
		memory[index] = this[index]
	}

	return this
}

GOAPWorld.prototype.load = function(memory)
{
	for (var index = 0, num = this.flags.count; index < num; ++index)
	{
		this[index] = memory[index]
	}

	return this
}

GOAPWorld.prototype.append = function(other)
{
	for (var index = 0, num = this.flags.count; index < num; ++index)
	{
		if (other[index] != null)
		{
			this[index] = other[index]
		}
	}
	
	return this
}

GOAPWorld.prototype.equal = function(other)
{
	for (var index = 0, num = this.flags.count; index < num; ++index)
	{		
		if (this[index] !== other[index])
		{
			return false
		}
	}
	
	return true
}

GOAPWorld.prototype.difference = function(other)
{
	var count = 0

	for (var index = 0, num = this.flags.count; index < num; ++index)
	{
		if (other[index] == null)
		{
			continue
		}
		
		if (this[index] !== other[index])
		{
			++count
		}
	}
	
	return count
}

GOAPWorld.prototype.getDifference = function(other)
{
	var missing = []

	for (var index = 0, num = this.flags.count; index < num; ++index)
	{
		if (other[index] === null)
		{
			continue
		}
		
		if (this[index] != other[index])
		{
			missing.push(key)
		}
	}
	
	return missing
}

GOAPWorld.prototype.toString = function()
{
	var first = true
	var ret = "[GOAPWorld"

	for (var index = 0, num = this.flags.count; index < num; ++index)
	{
		if (this[index] == null)
		{
			continue
		}

		if (first === true)
		{
			first = false
		}
		else
		{
			ret += ","
		}

		if (this[index] === true)
		{
			ret += " +"
		}
		else
		{
			ret += " -"
		}
		
		ret += this.flags.array[index]
	}

	return ret + "]"
}

module.exports = GOAPWorld
