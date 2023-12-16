import Sequelize from "sequelize";

class Musicsheet extends Sequelize.Model {
  static initiate(sequelize) {
    Musicsheet.init(
      {
        userId: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
        img: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        time: {
          type: Sequelize.DATE,
          allowNull: false,
          unique: true,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "Musicsheet",
        tableName: "musicsheets",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
}

export default Musicsheet;
