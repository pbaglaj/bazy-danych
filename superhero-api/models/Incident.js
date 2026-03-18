const { Model, DataTypes } = require('sequelize');

class Incident extends Model {}

const initIncidentModel = (sequelize) => {
  Incident.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      location: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      district: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      level: {
        type: DataTypes.ENUM('low', 'medium', 'critical'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('open', 'assigned', 'resolved'),
        allowNull: false,
        defaultValue: 'open',
      },
      hero_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'heroes',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      assigned_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      resolved_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Incident',
      tableName: 'incidents',
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      hooks: {
        afterUpdate: async (incident, options) => {
          const previousStatus = incident.previous('status');
          const nextStatus = incident.get('status');

          if (previousStatus !== 'assigned' || nextStatus !== 'resolved' || !incident.hero_id) {
            return;
          }

          const { Hero } = incident.sequelize.models;

          await Hero.increment('missions_count', {
            by: 1,
            where: { id: incident.hero_id },
            transaction: options.transaction,
          });
        },
      },
    }
  );

  return Incident;
};

module.exports = initIncidentModel;
