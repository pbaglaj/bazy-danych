const { Model, DataTypes } = require('sequelize');

class Hero extends Model {}

const initHeroModel = (sequelize) => {
  Hero.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(120),
        allowNull: false,
        unique: true,
      },
      power: {
        type: DataTypes.ENUM('flight', 'strength', 'telepathy', 'speed', 'invisibility'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('available', 'busy', 'retired'),
        allowNull: false,
        defaultValue: 'available',
      },
      missions_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
    },
    {
      sequelize,
      modelName: 'Hero',
      tableName: 'heroes',
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      hooks: {
        beforeValidate: (hero) => {
          if (typeof hero.name === 'string') {
            hero.name = hero.name.trim();
          }
        },
      },
      scopes: {
        available: {
          where: { status: 'available' },
        },
        withPower(power) {
          return {
            where: { power },
          };
        },
        withMissions: {
          order: [['missions_count', 'DESC']],
        },
      },
    }
  );

  return Hero;
};

module.exports = initHeroModel;
