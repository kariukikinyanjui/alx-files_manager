const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

class AuthController {
  static async getConnect (req, res) {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const base64Credentials = authorizationHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');
    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

    const user = await dbClient.db.collection('users').findOne({ email, password: hashedPassword });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = uuidv4();
    await redisClient.set(`auth_${token}`, user._id.toString(), 24 * 3600);

    return res.status(200).json({ token });
  }

  static async getDisconnect (req, res) {
    const token = req.headers['x-token'];
    const userId = await redisClient.get(`auth_${token}`);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await redisClient.del(`auth_${token}`);
    return res.sendStatus(204);
  }
}

module.exports = AuthController;
