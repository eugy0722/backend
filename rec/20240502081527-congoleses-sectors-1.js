const table = "markets-sectors";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(table, [
      {
        id_market: 1,
        id_sector: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(table, null, {});
  },
};