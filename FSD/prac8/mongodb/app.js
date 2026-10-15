const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const databaseName = process.env.MONGODB_DATABASE || "pg_finder";
const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();

    const collection = client.db(databaseName).collection("properties");

    // CREATE
    const newProperty = {
      name: "Smith Faldu PG",
      city: "Ahmedabad",
      monthlyRent: 8500,
      roomType: "Double",
      availableRooms: 12,
      facilities: ["Wi-Fi", "Meals"],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createResult = await collection.insertOne(newProperty);
    const propertyId = createResult.insertedId;
    console.log("Created property:", propertyId.toString());

    // READ one property by its MongoDB ID
    let property = await collection.findOne({ _id: propertyId });
    console.log("Property before update:", property);

    // UPDATE the property
    const updateResult = await collection.updateOne(
      { _id: propertyId },
      {
        $set: {
          monthlyRent: 9000,
          availableRooms: 10,
          updatedAt: new Date(),
        },
      },
    );
    console.log("Properties updated:", updateResult.modifiedCount);

    // READ the updated property
    property = await collection.findOne({ _id: propertyId });
    console.log("Property after update:", property);

    // DELETE the property
    const deleteResult = await collection.deleteOne({ _id: propertyId });
    console.log("Properties deleted:", deleteResult.deletedCount);

    // READ multiple properties in Ahmedabad
    const ahmedabadProperties = await collection
      .find({ city: "Ahmedabad" })
      .sort({ monthlyRent: 1 })
      .toArray();

    console.log("Ahmedabad properties:");
    console.table(ahmedabadProperties.map(({ _id, ...item }) => item));
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error("MongoDB CRUD example failed:", error.message);
  process.exitCode = 1;
});
