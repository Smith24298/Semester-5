import { MongoClient } from 'mongodb'
async function main() {
const uri = 'mongodb://localhost:27017';
//const uri= "mongodb://fsd:fsd@ac-sdi8lbi-shard-00-00.6ahzpno.mongodb.net:27017,ac-sdi8lbi-shard-00-01.6ahzpno.mongodb.net:27017,ac-sdi8lbi-shard-00-02.6ahzpno.mongodb.net:27017/?ssl=true&replicaSet=atlas-o9kokj-shard-0&authSource=admin&appName=fsdc3";
const client = new MongoClient(uri);
try {
await client.connect();
const database = client.db('mydatabase');
const collection = database.collection('mycollection');
const documents = await collection.find().toArray();
console.log('Documents:');
console.log(documents);
  /*  
    for(i in documents)
        {           
            console.log("Read one by one " +i);
            str="";
            for(j in documents[i])
                str+=documents[i][j]+ "  |  ";
            console.log(str);
        }
*/
} finally {
await client.close();
}
}
main().catch(console.error);