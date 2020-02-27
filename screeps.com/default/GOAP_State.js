
function State(array)
{
	this._care = 0
	this._mask = 0

	if (array)
	{
		for (let index = 0, num = array.length; index < num; ++index)
		{
			this.set(array[index][0], array[index][1])
		}
	}
}

State.prototype.set = function(index, value)
{
	if (index === undefined)
		throw Error("Index is undefined")
	
	if (index === null)
		throw Error("Index is null")

	this._setCare(index, true)
	this._setMask(index, value === true)

	return this
}

State.prototype.merge = function(other)
{
	for (let index = 0, num = 32; index < num; ++index)
	{
		if (other._getCare(index))
		{
			this.set(index, other._getMask(index))
		}
	}

	return this
}

State.prototype._setCare = function(index, value)
{
	const flag = 1 << index

	if (value === true)
	{
		this._care |= flag
	}
	else
	{
		this._care &= ~flag
	}

	return this
}

State.prototype._getCare = function(index)
{
	const flag = 1 << index
	return (this._care & flag) === flag
}

State.prototype._setMask = function(index, value)
{
	const flag = (1 << index)
	
	if (value === true)
	{
		this._mask |= flag
	}
	else
	{
		this._mask &= ~flag
	}

	return this
}

State.prototype._getMask = function(index)
{
	const flag = 1 << index
	return (this._mask & flag) === flag
}

State.prototype.equal = function(other)
{
	for (let index = 0, num = 32; index < num; ++index)
	{
		if (this._getCare(index) && other._getCare(index))
		{
			if (this._getMask(index) !== other._getMask(index))
			{
				return false
			}
		}
		else if (this._getCare(index) !== other._getCare(index))
		{
			return false
		}
	}

	return true
}

State.prototype.missing = function(other)
{
	let count = 0

	for (let index = 0, num = 32; index < num; ++index)
	{
		if (other._getCare(index))
		{
			if (this._getMask(index) !== other._getMask(index))
			{
				++count
			}
		}
	}
	
	return count
}

State.prototype.careNum = function()
{
	let count = 0

	for (let index = 0, num = 32; index < num; ++index)
	{
		if (this._getCare(index)) count++
	}

	return count
}

State.prototype.heuristicDifference = function(other)
{
	let count = 0

	for (let index = 0, num = 32; index < num; ++index)
	{
		if (other._getCare(index))
		{
			if (!this._getCare(index))
			{
				count++
			}
			else if (this._getMask(index) != other._getMask(index))
			{
				count++
			}
		}
		else if (this._getCare(index))
		{
			count++
		}
	}

	return count
}

State.prototype.toString = function()
{
	let first = true
	let ret = "[State"

	for (var index = 0, num = 32; index < num; ++index)
	{
		if (!this._getCare(index)) continue
		
		if (first)
			ret += " "
		else
			ret += ", "

		ret += `${index}:${this._getMask(index) ? 1 : 0}`

		first = false
	}

	return ret + "]"
}

State.prototype.toJSON = function()
{
	let ret = ""

	for (let index = 0, num = 32; index < num; ++index)
	{
		ret += this._getCare(index) ? "1" : "0"
		ret += this._getMask(index) ? "1" : "0"
	}

	return ret
}

State.prototype.fromJSON = function(json)
{
	for (let index = 0, num = 32; index < num; ++index)
	{
		const careIndex = index * 2
		const maskIndex = index * 2 + 1

		this._setCare(index, json.charAt(careIndex) == "1")
		this._setMask(index, json.charAt(maskIndex) == "1")
	}
}

module.exports = State
