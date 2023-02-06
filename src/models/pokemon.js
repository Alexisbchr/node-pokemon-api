const validTypes = [
	"Plante",
	"Feu",
	"Eau",
	"Insecte",
	"Normal",
	"Electrik",
	"Poison",
	"Fée",
	"Vol",
	"Combat",
	"Psy",
];

module.exports = (sequelize, DataTypes) => {
	return sequelize.define(
		"Pokemon",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: {
					msg: "Ce nom est déjà pris",
				},
				validate: {
					notEmpty: {msg: "Le nom du pokémon est obligatoire."},
					notNull: {
						msg: "Le nom du pokémon est une propriété est obligatoire.",
					},
					isLength: {
						args: [3, 10],
						msg: "Le nom du pokémon doit faire entre 3 et 10 caractères.",
					},
				},
			},
			hp: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					isInt: {msg: "utlisez des nombres"},
					notNull: {
						msg: "Les  du pokémon est une propriété est obligatoire.",
					},
					max: 999,
					min: 0,
				},
			},
			cp: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					isInt: {msg: "utlisez des nombres"},
					notNull: {
						msg: "Le cp du pokémon est une propriété est obligatoire.",
					},
					max: 999,
					min: 0,
				},
			},
			picture: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					isUrl: {msg: "Utiliser une url"},
					notNull: {
						msg: "La photo du pokémon est une propriété est obligatoire.",
					},
				},
			},
			types: {
				type: DataTypes.STRING,
				allowNull: false,

				get() {
					return this.getDataValue("types").split(",");
				},
				set(types) {
					this.setDataValue("types", types.join());
				},
				validate: {
					isTypeisValid(value) {
						if (!value) {
							throw new Error(
								"Le type du pokémon est une propriété est obligatoire."
							);
						}
						if (value.split(",").length > 3) {
							throw new Error(
								"Un pokémon ne peut avoir plus de trois types."
							);
						}
						value.split(",").forEach((type) => {
							if (!validTypes.includes(type)) {
								throw new Error(
									`le type doit appartenir à la liste suivante: ${validTypes.join(
										", "
									)}`
								);
							}
						});
					},
				},
			},
		},
		{
			timestamps: true,
			createdAt: "created",
			updatedAt: false,
		}
	);
};
