describe('redisClient', () => {
  it('should connect to Redis successfully', async () => {
    const alive = await redisClient.isAlive();
    expect(alive).toBeTruthy();
  });

  it('should set and get a key-value pair', async () => {
    await redisClient.set('testKey', 'testValue', 5);
    const value = await redisClient.get('testKey');
    expect(value).toBe('testValue');
  });

  it('should delete a key', async () => {
    await redisClient.set('testKey', 'testValue', 5);
    await redisClient.del('testKey');
    const value = await redisClient.get('testKey');
    expect(value).toBeFalsy();
  });
});

