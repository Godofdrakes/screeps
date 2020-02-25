
function State()
{
	this._care = 0
	this._mask = 0
}

State.prototype.set = function(index, value)
{
	this._setCare(index, true)
	this._setMask(index, value)

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
	return this._care & (1 << index)
}

State.prototype._setMask = function(index, value)
{
	const flag = 1 << index

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

State.prototype._setMask = function(bits, index)
{
	return this._mask & (1 << index)
}

State.prototype.equal = function(other, careMask)
{
	for (let index = 0, num = 32; index < num; ++index)
	{
		if (careMask && !careMask._getCare(index))
		{
			continue
		}

		if (other._getMask(index) !== this._getMask(index))
		{
			return false
		}
	}

	return true
}

State.prototype.missing = function(other, careMask)
{
	let count = 0

	for (let index = 0, num = 32; index < num; ++index)
	{
		if (careMask && !careMask._getCare(index))
		{
			continue
		}

		if (this._getMask(index) !== other._getMask(index))
		{
			++count
		}
	}
	
	return count
}

State.prototype.toString = function()
{
	return `[State ${this.toJSON()}]`
}

State.prototype.toJSON = function()
{
	var ret = ""

	for (var index = 0, num = 32; index < num; ++index)
	{
		ret += this._getCare(index) ? "1" : "0"
		ret += this._getMask(index) ? "1" : "0"
	}

	return ret
}

State.prototype.fromJSON = function(json)
{
	for (var index = 0, num = 32; index < num; index)
	{
		const careIndex = index * 2
		const maskIndex = careIndex + 1

		this._setCare(index, json.charAt(careIndex) == "1")
		this._setMask(index, json.charAt(maskIndex) == "1")
	}
}

module.exports = State
