
import { MongoClient } from 'mongodb';
//const uri = 'mongodb://localhost:27017';

 const uri= "mongodb://fsd:fsd@ac-sdi8lbi-shard-00-00.6ahzpno.mongodb.net:27017,ac-sdi8lbi-shard-00-01.6ahzpno.mongodb.net:27017,ac-sdi8lbi-shard-00-02.6ahzpno.mongodb.net:27017/?ssl=true&replicaSet=atlas-o9kokj-shard-0&authSource=admin&appName=fsdc3";

    const client = new MongoClient(uri);

/// client---> dbobj --> col collection/table
    try {
        await client.connect();

        console.log("Connected")

	const dbobj=client.db('fsd')
	const col=dbobj.collection('student');

const result = await col.insertOne({name:'Smita',place:'pune', batch:2024});
console.log(`Document inserted with id: ${result.insertedId}`);

}

finally {

await client.close();
}

/*
        const database = client.db('mydatabase');
const collection = database.collection('mycollection');
const result = await collection.insertOne({ name: 'Sam', age:
30, city: 'Pune' });
console.log(`Document inserted with id: ${result.insertedId}`);
} finally {
await client.close();
}
}
main().catch(console.error);

*/