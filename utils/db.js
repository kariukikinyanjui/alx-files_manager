const MongoClient = require('mongodb').MongoClient;

class DBClient {
  constructor () {
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || 'files_manager';
    this.client = new MongoClient(`mongodb://${this.host}:${this.port}/${this.database}`, { useNewUrlParser: true, useUnifiedTopology: true });
  }

  isAlive () {
    return this.client.connect() !== undefined;
  }

  async nbUsers () {
    const db = this.client.db();
    const collection = db.collection('users');
    return collection.countDocuments();
  }

  async nbFiles () {
    const db = this.client.db();
    const collection = db.collection('files');
    return collection.countDocuments();
  }
}

const dbClient = new DBClient();
export default dbClient;
