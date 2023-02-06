module.exports = (sequelize, DataTypes) => {
	return sequelize.define('Pokemon', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: { msg: 'Le nom du pokémon est obligatoire.' },
				notNull: { msg: 'Le nom du pokémon est une propriété est obligatoire.' }
			}
		},
		hp: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				isInt: { msg: 'utlisez des nombres' },
				notNull: { msg: 'Les hp du pokémon est une propriété est obligatoire.' }
			}
		},
		cp: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				isInt: { msg: 'utlisez des nombres' },
				notNull: { msg: 'Le cp du pokémon est une propriété est obligatoire.' }
			}
		},
		picture: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				isUrl: { msg: 'Utiliser une url' },
				notNull: { msg: 'La photo du pokémon est une propriété est obligatoire.' }
			}
		},
		types: {
			type: DataTypes.STRING,
			allowNull: false,
			get() {
				return this.getDataValue('types').split(',')
			},
			set(types) {
				this.setDataValue('types', types.join())
			}
		}
	}, {
		timestamps: true,
		createdAt: 'created',
		updatedAt: false
	})
}