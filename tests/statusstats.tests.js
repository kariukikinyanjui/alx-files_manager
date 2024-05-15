describe('GET /status', () => {
  it('should return the status of Redis and DB', async () => {
    const response = await request(app).get('/status');
    expect(response.statusCode).toBe(200);
    expect(response.body.redis).toBeDefined();
    expect(response.body.db).toBeDefined();
  });
});

describe('GET /stats', () => {
  it('should return the stats of Redis and DB', async () => {
    const response = await request(app).get('/stats');
    expect(response.statusCode).toBe(200);
    expect(response.body.redis).toBeDefined();
    expect(response.body.db).toBeDefined();
  });
});

