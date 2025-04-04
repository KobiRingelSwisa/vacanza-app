import sequelize from "./config/database.js";
import User from "./models/User.js";
import Trip from "./models/Trip.js";

async function resetDatabase() {
  try {
    // Drop existing tables using raw SQL
    await sequelize.query('DROP TABLE IF EXISTS "Trips" CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS "Users" CASCADE;');
    console.log("All tables dropped successfully!");

    // Sync User model first
    console.log("Creating Users table...");
    await User.sync({ force: true });
    console.log("Users table created successfully!");

    // Then sync Trip model
    console.log("Creating Trips table...");
    await Trip.sync({ force: true });
    console.log("Trips table created successfully!");

    // Verify the tables were created with correct types
    const [results] = await sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Users' AND column_name = 'id';
    `);
    console.log("Users table id column type:", results[0].data_type);

    const [tripResults] = await sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Trips' AND column_name = 'userId';
    `);
    console.log("Trips table userId column type:", tripResults[0].data_type);

    console.log("Database reset successful!");
  } catch (error) {
    console.error("Error resetting database:", error);
    if (error.parent) {
      console.error("Database error details:", error.parent);
    }
  } finally {
    process.exit();
  }
}

resetDatabase();
