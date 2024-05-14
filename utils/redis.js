const redis = require('redis');

class RedisClient {
  constructor () {
    this.client = redis.createClient();

    this.client.on('error', (err) => {
      console.error('Redis error:', err);
    });
  }

  isAlive () {
    return this.client.ping((err, res) => {
      if (err) {
        return false;
      }
      return res === 'PONG';
    });
  }

  async get (key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, value) => {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      });
    });
  }

  async set (key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  async del (key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, count) => {
        if (err) {
          reject(err);
        } else {
          resolve(count);
        }
      });
    });
  }
}

const redisClient = new RedisClient();
export default redisClient;
