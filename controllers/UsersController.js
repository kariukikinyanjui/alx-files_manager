const crypto = require('crypto');
const dbClient = require('../utils/db');

class UsersController {
  static async postNew (req, res) {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).send({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).send({ error: 'Missing password' });
    }

    // Check if the email already exists
    const user = await dbClient.db.collection('users').findOne({ email });
    if (user) {
      return res.status(400).send({ error: 'Already exist' });
    }

    // Hash the password using SHA1
    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

    // Insert the new user into the database
    const result = await dbClient.db.collection('users').insertOne({
      email,
      password: hashedPassword
    });

    // Return the new user with only the email and the id
    return res.status(201).send({
      id: result.insertedId,
      email
    });
  }
}

module.exports = UsersController;
