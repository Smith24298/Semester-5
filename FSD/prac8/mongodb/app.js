const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);

async function main() {
  await client.connect();
  const collection = client
    .db(process.env.MONGODB_DATABASE || 'pg_finder')
    .collection('properties');

  await collection.updateOne(
    { name: 'Smith Faldu', city: 'Ahmedabad' },
    {
      $setOnInsert: {
        name: 'Smith Faldu PG',
        city: 'Ahmedabad',
        monthlyRent: 8500,
        roomType: 'Double',
        availableRooms: 12,
        facilities: ['Wi-Fi', 'Meals'],
      },
    },
    { upsert: true },
  );

  const properties = await collection
    .find({ city: 'Ahmedabad' })
    .sort({ monthlyRent: 1 })
    .toArray();

  console.table(properties.map(({ _id, ...property }) => property));
  await client.close();
}

main().catch(async (error) => {
  console.error('MongoDB example failed:', error.message);
  await client.close();
  process.exitCode = 1;
});
