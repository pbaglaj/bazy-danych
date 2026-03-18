module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('heroes', 'missions_count', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addColumn('incidents', 'district', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await queryInterface.addColumn('incidents', 'assigned_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('incidents', 'resolved_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('incidents', 'district');
    await queryInterface.removeColumn('incidents', 'assigned_at');
    await queryInterface.removeColumn('incidents', 'resolved_at');
    await queryInterface.removeColumn('heroes', 'missions_count');
  },
};