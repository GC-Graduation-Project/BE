import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class vextab extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    idvextab: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    member_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    img_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    img_time: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    img_path: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'vextab',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idvextab" },
        ]
      },
    ]
  });
  }
}
