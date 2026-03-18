module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkDelete('incidents', null, {
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });

    await queryInterface.bulkDelete('heroes', null, {
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  },

  down: async () => {},
};