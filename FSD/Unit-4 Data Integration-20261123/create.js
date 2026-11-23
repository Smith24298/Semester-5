
import { MongoClient } from 'mongodb';


async function main() {
const uri = 'mongodb://localhost:27017';
//const uri= "mongodb://fsd:fsd@ac-sdi8lbi-shard-00-00.6ahzpno.mongodb.net:27017,ac-sdi8lbi-shard-00-01.6ahzpno.mongodb.net:27017,ac-sdi8lbi-shard-00-02.6ahzpno.mongodb.net:27017/?ssl=true&replicaSet=atlas-o9kokj-shard-0&authSource=admin&appName=fsdc3";

    const client = new MongoClient(uri);

    try {
await client.connect();
console.log("Connected");


// client-->db -->col-->crud
        //await client.connect();

        console.log("Connected")
        const database = client.db('mydatabase');
const collection = database.collection('mycollection');
const result = await collection.insertOne({ name: 'Sam1234', age:
10, city: 'Pune' });
console.log(result);
console.log(`Document inserted with id: ${result.insertedId}`);
} finally {
await client.close();
}
}
main().catch(console.error);

