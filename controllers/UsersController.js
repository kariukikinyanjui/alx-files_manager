import { ObjectId } from 'mongodb';
import sha1 from 'sha1';
import Queue from 'bull';
import dbClient from '../utils/db';
import userUtils from '../utils/user';

const userQueue = new Queue('userQueue');

class UsersController {
  static async postNew (req, res) {
    const userEmail = req.body.email;
    const userPassword = req.body.password;

    if (!userEmail) {
      return res.status(400).json({ error: 'Missing email' });
    }

    if (!userPassword) {
      return res.status(400).json({ error: 'Missing password' });
    }

    const userExists = await dbClient.db.collection('users').findOne({ email: userEmail });

    if (userExists) {
      return res.status(400).json({ error: 'Already exist' });
    }

    const hashedPassword = sha1(userPassword);
    const newUser = {
      email: userEmail,
      password: hashedPassword
    };

    let insertResult;
    try {
      insertResult = await dbClient.db.collection('users').insertOne(newUser);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error creating user.' });
    }

    const createdUser = {
      id: insertResult.insertedId,
      email: userEmail
    };

    userQueue.add({ userId: String(insertResult.insertedId) });

    return res.status(201).json(createdUser);
  }

  static async getMe (req, res) {
    const tokenInfo = await userUtils.getUserIdAndKey(req);

    if (!tokenInfo) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userData = await dbClient.db.collection('users').findOne({
      _id: ObjectId(tokenInfo.userId)
    });

    if (!userData) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userInfo = {
      id: userData._id,
      email: userData.email
    };

    return res.status(200).json(userInfo);
  }
}

export default UsersController;
