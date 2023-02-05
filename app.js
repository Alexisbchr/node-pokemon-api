const express = require("express");
const morgan = require("morgan");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const { Sequelize } = require("sequelize");
const { success, getUniqueId } = require("./helper.js");

let pokemons = require("./mock-pokemon.js");

var app = express();
const port = 3000;

const sequelize = new Sequelize(
	'pokedex',
	'root',
	'',
	{
		host: 'localhost',
		dialect: 'mariadb',
		dialectOptions: {
			timezone: 'Etc/GMT-2'
		},
		logging: false
	}
)
sequelize.authenticate()
	.then(_ => console.log('Connection has been established successfully.'))
	.catch(err => console.error('Unable to connect to the database:', err))


app.use(favicon(__dirname + "/favicon.ico"))
	.use(morgan('dev')).use(bodyParser.json())

app.get("/", (req, res) => res.send("Hello, Expressye!"));


// Envoie la liste de tous les pokémons
app.get("/api/pokemons", (req, res) => {
	// Affiche un message informant que la liste des pokémons est disponible
	const message = `Voici la liste de tous les pokémons`;
	// Répond avec réussite et la liste des pokémons
	res.json(success(message, pokemons));
});


// Récupère les informations d'un pokémon via son ID
app.get("/api/pokemons/:id", (req, res) => {
	// Récupère l'ID passé en paramètre 
	const id = parseInt(req.params.id);
	// Cherche le pokémon dans le tableau
	const pokemon = pokemons.find((pokemon) => pokemon.id === id);
	// Définit le message de retour si le pokemon a été trouvé
	const message = `Le pokémon à bien été trouvé`;
	// Renvoie une réponse au format JSON
	res.json(success(message, pokemon));
});

// Crée un nouveau pokémon
app.post('/api/pokemons', (req, res) => {
	// Récupère un ID unique
	const id = getUniqueId(pokemons);
	// Copie l'objet reçu et lui ajoute l'ID et la date de création
	const pokemonCreated = { ...req.body, ...{ id: id, created: new Date() } }
	// Ajoute le nouveau pokémon au tableau
	pokemons.push(pokemonCreated)
	// Définit le message de retour
	const message = `Le pokémon ${pokemonCreated.name} a bien été crée.`
	// Renvoie une réponse au format JSON
	res.json(success(message, pokemonCreated))
})

// Met à jour un pokémon spécifique avec les données fournies dans la requête et retourne un message de réussite et les données du pokémon enregistré. 
app.put('/api/pokemons/:id', (req, res) => {
	// Récupère l'ID du pokémon à mettre à jour depuis le paramètre de requête
	const id = parseInt(req.params.id);

	// Fusionne les données fournies dans la requête avec l'ID et la date de création de la reqûete
	const pokemonUpdated = { ...req.body, ...{ id: id, created: new Date() } }

	// Met à jour le tableau de pokémon avec la dernière version du pokémon
	pokemons = pokemons.map(pokemon => pokemon.id === id ? pokemonUpdated : pokemon)

	// Prépare un message de réussite
	const message = `Le pokémon ${pokemonUpdated.name} a bien été mis à jour.`

	// Envoie un message et les données du pokémon mis à jour
	res.json(success(message, pokemonUpdated))
})


//Supprime un Pokémon à partir de son ID
app.delete('/api/pokemons/delete/:id', (req, res) => {
	//Récupérer ID du pokémon
	const id = parseInt(req.params.id);
	//Filtrer pour trouver le pokémon à supprimer et supprimer
	pokemons = pokemons.filter(pokemon => pokemon.id !== id)
	//Message de réussite
	const message = `Le pokémon a bien été supprimé.`
	//Réponse à l'utilisateur
	res.json(success(message, pokemons))
})


//Met à jour le pokémon avec l'ID correspondant avec les nouvelles données fournies 
app.put('/api/pokemons/:id', (req, res) => {
	//Récupère l'ID à partir des paramètres de la requête
	const id = parseInt(req.params.id);
	//Crée un nouvel objet de pokémon avec les nouvelles données et l'ID
	const pokemonUpdated = { ...req.body, ...{ id: id, created: new Date() } }
	//Met à jour les données du pokémon correspondant
	pokemons = pokemons.map(pokemon => pokemon.id === id ? pokemonUpdated : pokemon)
	//Crée un message avec le nom du pokémon mis à jour
	const message = `Le pokémon ${pokemonUpdated.name} a bien été mis à jour.`
	//Renvoie une réponse json de succès avec le message et les données mises à jour
	res.json(success(message, pokemonUpdated))
})

// Ce code met à jour un Pokémnon dans le tableau `pokemons`
// à l'aide de l'ID fourni dans la demande req.params.id et le corps
// de la demande contenu dans req.body
app.patch('/api/pokemons/:id', (req, res) => {
	// Récupère l'ID du pokemon a partir de req.params.id
	// et le convertit en entier
	const id = parseInt(req.params.id);

	// Crée un objet pokemonUpdated à partir du corps de la demande
	// et de l'id et de la date de création
	const pokemonUpdated = {
		...req.body,
		...{ id: id, created: new Date() }
	};

	// Met à jour le tableau pokemoms
	pokemons = pokemons.map(pokemon => {
		if (pokemon.id === id) {
			return pokemonUpdated;
		} else {
			return pokemon;
		}
	});

	// Répond avec une reponse réussie et le message 
	// le Pokemon X a bien été mis à jour
	const message = `Le pokémon ${pokemonUpdated.name} a bien été mis à jour.`
	res.json(success(message, pokemonUpdated))
});

app.listen(port, () =>
	console.log(
		`Notre application Node est démarrée sur : http://localhost:${port}`
	)
);
