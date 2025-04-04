import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const Trip = sequelize.define(
  "Trip",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id",
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "NO ACTION",
      onUpdate: "CASCADE",
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "start_date",
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "end_date",
    },
    interests: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    budget: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    travel_style: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "travel_style",
    },
    accommodation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    transportation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    itinerary: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("planned", "ongoing", "completed", "cancelled"),
      defaultValue: "planned",
    },
    created_at: {
      type: DataTypes.DATE,
      field: "created_at",
    },
    updated_at: {
      type: DataTypes.DATE,
      field: "updated_at",
    },
  },
  {
    tableName: "trips",
    underscored: true,
    timestamps: true,
  }
);

// Set up associations
Trip.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
  onDelete: "NO ACTION",
  onUpdate: "CASCADE",
});

User.hasMany(Trip, {
  foreignKey: "user_id",
  sourceKey: "id",
  onDelete: "NO ACTION",
  onUpdate: "CASCADE",
});

export default Trip;
