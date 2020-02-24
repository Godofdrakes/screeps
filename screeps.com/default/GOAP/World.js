// For use with arrays of identical length
// Each index is assumed to be a unique flag

module.exports =
{
	append: function(world, other)
	{
		for (var index = 0, num = other.length; index < num; ++index)
		{
			if (other[index] != null)
			{
				world[index] = other[index]
			}
		}
	},

	equal: function(world, other)
	{
		for (var index = 0, num = world.length; index < num; ++index)
		{		
			if (world[index] !== other[index])
			{
				return false
			}
		}
		
		return true
	},

	missing: function(world, other)
	{
		var count = 0
	
		for (var index = 0, num = other.length; index < num; ++index)
		{
			if (other[index] == null)
			{
				continue
			}
			
			if (world[index] !== other[index])
			{
				++count
			}
		}
		
		return count
	},

	toString: function(world, enums)
	{
		var first = true
		var ret = "[World"
	
		for (var index = 0, num = world.length; index < num; ++index)
		{
			if (world[index] == null)
			{
				continue
			}
	
			if (first !== true)
			{
				ret += ","
			}
			
			first = false
	
			if (world[index] === true)
			{
				ret += " +"
			}
			else
			{
				ret += " -"
			}
			
			if (indexToStringMap)
			{
				ret += enums[index]
			}
			else
			{
				ret += index
			}
		}
	
		return ret + "]"
	}
}
