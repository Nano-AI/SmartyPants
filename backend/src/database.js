/*
* database.js - Berkan Mertan (Pratham Team 10)
* A wrapper module that simplifies MongoDB usage and reduces code redundancy for our backend
*/
const { MongoClient } = require('mongodb');
const uri = 'mongodb://0.0.0.0:27017'; // Locally hosted MongoDB url, should prob transfer to an ENV file later

let client, connection;

// General, entry database connection function, invoked upon server startup
async function connectToDatabase() {
  client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    connection = getDB();
  
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    throw error;
  }
}

// Called only in here, to retrieve the DB connection
function getDB() {
  if (!client) {
    throw new Error('You must connect first!');
  }
  return client.db('SmartyPants'); // Replace with your database name
}

// General function for querying the DB, reduces redundancy
async function retrieveData(query) {
    let dataBuffer = [];
    if (connection === undefined) {
        throw new Error('DB has not been connected!');
    }
    const dbresult = await connection.collection("opportunities").find(query);

    for await (const doc of dbresult) {
        dataBuffer.push(doc);
    }

    return dataBuffer;
}

// General function for writing to the DB
async function writeData(dataBlock) {
    if (connection === undefined) {
        throw new Error('DB has not been connected!');
    }
    connection.collection("opportunities").insertOne(dataBlock, function(err, res) {
        if (err) throw err;
        console.log("Data block inserted successfully.");
        db.close();
    });
}

connectToDatabase();

// Export all our wrapped functions
module.exports = { 
    connectToDatabase,
    retrieveData,
    writeData
};
