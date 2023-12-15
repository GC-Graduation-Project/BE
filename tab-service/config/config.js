import dotenv from 'dotenv';

dotenv.config();

const config = {
  username: 'root',
  password: '1234',
  database: 'vextabdb',
  host: 'localhost',
  dialect: 'mysql',
  define: {
    timestamps: false,
  },
};

export default config;