const {LOCK} = require("sequelize");
const {Pokemon} = require("../db/sequelize");
const {Op} = require("sequelize");

module.exports = (app) => {
	app.get("/api/pokemons", (req, res) => {
		if (req.query.name) {
			const name = req.query.name;
			return Pokemon.findAll({
				where: {
					name: {
						[Op.like]: `%${name}%`,
					},
				},
				limit: 4,
			}).then((pokemons) => {
				const message = `Il y a ${pokemons.length} pokémons qui correseponde à ${name}.`;
				res.json({message, data: pokemons});
			});
		} else {
			Pokemon.findAll()
				.then((pokemons) => {
					const message =
						"La liste des pokémons a bien été récupérée.";
					res.json({message, data: pokemons});
				})
				.catch((error) => {
					const message = `La liste des pokémons n'a pas pu être récupéré. 
                         Réessayez dans quelques instants.`;
					res.status(500).json({message, data: error});
				});
		}
	});
};
