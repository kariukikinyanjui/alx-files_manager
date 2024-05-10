const { MongoClient } = require('mongodb');

class DBClient {
  constructor () {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    this.client = new MongoClient(`mongodb://${host}:${port}`);
    this.client.connect()
      .then(() => {
        this.db = this.client.db(database);
        console.log('Successfully connected to MongoDB');
      })
      .catch((err) => console.error('Connection to MongoDB failed', err));
  }

  isAlive () {
    return !!this.db;
  }

  async nbUsers () {
    return this.db.collection('users').countDocuments();
  }

  async nbFiles () {
    return this.db.collection('files').countDocuments();
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
