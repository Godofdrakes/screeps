let Enum = require("Enum")

let WorldFlags = new Enum("WorldFlags",
[
	"hasEnergy",
	"foundSpawn",
	"foundEnergy",
])

module.exports = Object.freeze(WorldFlags)
