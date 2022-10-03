"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Reports extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Reports.init(
    {
      imageId: DataTypes.INTEGER,
      isValid: DataTypes.BOOLEAN,
      status: DataTypes.INTEGER,
      adultEvaluation: DataTypes.INTEGER,
      medicalEvaluation: DataTypes.INTEGER,
      racyEvaluation: DataTypes.INTEGER,
      spoofEvaluation: DataTypes.INTEGER,
      violenceEvaluation: DataTypes.INTEGER,
      evaluationAvg: DataTypes.NUMERIC,
    },
    {
      sequelize,
      modelName: "Reports",
    }
  );
  return Reports;
};
