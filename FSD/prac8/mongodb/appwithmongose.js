const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.0:27017";

const databaseName = process.env.MONGODB_DATABASE || "pg_finder";

// 1. DEFINE SCHEMA
const propertySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    monthlyRent: {
      type: Number,
      required: true,
      min: 0,
    },
    roomType: {
      type: String,
      required: true,
    },
    availableRooms: {
      type: Number,
      required: true,
      min: 0,
    },
    facilities: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

// 2. CREATE MODEL
const Property = mongoose.model("Property", propertySchema);

async function main() {
  try {
    // CONNECT TO MONGODB
    await mongoose.connect(uri, {
      dbName: databaseName,
    });

    console.log("Connected to MongoDB");

    // CREATE
    const newProperty = await Property.create({
      name: "Smith Faldu PG",
      city: "Ahmedabad",
      monthlyRent: 8500,
      roomType: "Double",
      availableRooms: 12,
      facilities: ["Wi-Fi", "Meals"],
    });

    const propertyId = newProperty._id;

    console.log("Created property:", propertyId.toString());

    // READ ONE PROPERTY
    let property = await Property.findById(propertyId);

    console.log("Property before update:", property.toObject());

    // UPDATE PROPERTY
    const updateResult = await Property.updateOne(
      { _id: propertyId },
      {
        $set: {
          monthlyRent: 9000,
          availableRooms: 10,
        },
      },
      {
        runValidators: true,
      },
    );

    console.log("Properties updated:", updateResult.modifiedCount);

    // READ UPDATED PROPERTY
    property = await Property.findById(propertyId);

    console.log("Property after update:", property.toObject());

    // DELETE PROPERTY
    const deleteResult = await Property.deleteOne({
      _id: propertyId,
    });

    console.log("Properties deleted:", deleteResult.deletedCount);

    // READ MULTIPLE PROPERTIES IN AHMEDABAD
    const ahmedabadProperties = await Property.find({
      city: "Ahmedabad",
    })
      .sort({ monthlyRent: 1 })
      .lean();

    console.log("Ahmedabad properties:");
    console.table(ahmedabadProperties);
  } catch (error) {
    console.error("Mongoose CRUD example failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();
