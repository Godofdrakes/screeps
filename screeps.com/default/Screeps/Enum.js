function Enum(name, array)
{
	this.name = name
	this.array = array
	this.count = array.length

	for (var index = 0; index < this.count; ++index)
	{
		this[this.array[index]] = index
	}

	return Object.freeze(this)
}

module.exports = Enum
