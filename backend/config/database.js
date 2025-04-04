import "dotenv/config";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: console.log,
    define: {
      timestamps: true,
      underscored: true,
    },
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful!");

    const [results] = await sequelize.query(
      "SELECT current_database(), current_user"
    );
    console.log("Connected to database:", results[0].current_database);
    console.log("Connected as user:", results[0].current_user);
  } catch (error) {
    console.log("Database connection failed: ", error);
    process.exit(1);
  }
};

testConnection();

export default sequelize;
