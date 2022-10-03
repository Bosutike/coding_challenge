"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Reports", "evaluationAvg", {
      type: Sequelize.NUMERIC,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Reports", "evaluationAvg");
  },
};
