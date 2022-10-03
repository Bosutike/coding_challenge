"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Reports", "adultEvaluation", {
      type: Sequelize.INTEGER,
      after: "status",
    });
    await queryInterface.addColumn("Reports", "medicalEvaluation", {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn("Reports", "racyEvaluation", {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn("Reports", "spoofEvaluation", {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn("Reports", "violenceEvaluation", {
      type: Sequelize.INTEGER,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Reports", "adultEvaluation");
    await queryInterface.removeColumn("Reports", "medicalEvaluation");
    await queryInterface.removeColumn("Reports", "racyEvaluation");
    await queryInterface.removeColumn("Reports", "spoofEvaluation");
    await queryInterface.removeColumn("Reports", "violenceEvaluation");
  },
};
