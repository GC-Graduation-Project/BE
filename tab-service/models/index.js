import Sequelize from 'sequelize';

import config from '../config/config.js';

import initModels from './init-models.js';

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = initModels(sequelize);

export { db, sequelize };