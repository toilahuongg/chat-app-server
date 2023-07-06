import { RedisClientType, createClient } from "redis";

export default class RedisServer {
  private static instance: RedisServer;
  private client!: ReturnType<typeof createClient>;

  constructor() {
    this.init();
  }
  async init() {
    const client = createClient();
    client.on('error', err => console.log('Redis Client Error', err));
    await client.connect();
    console.log('Redis server connected');
    this.client = client;
  }

  getClient() {
    return this.client;
  }
  
  static getInstance() {
    if (!RedisServer.instance) {
      RedisServer.instance = new RedisServer();
    }
    return RedisServer.instance
  }
}
