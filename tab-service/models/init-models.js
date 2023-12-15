import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import vextab from './vextab.js'
export default function initModels(sequelize) {
 vextab.init(sequelize,DataTypes)


  return {
    vextab
  };
}
