import { InternalSessionStore } from 'prismy-session'
import redis, {RedisClient, ClientOpts} from 'redis'
import {promisify} from 'util'

export class RedisSessionStore implements InternalSessionStore {
  client: RedisClient
  constructor(options: ClientOpts) {
    this.client = redis.createClient(options)
  }

  async get(key: string): Promise<string | null> {
    return promisify(this.client.get).bind(this.client)(key)
  }

  async set(
    key: string,
    value: string,
    maxAgeInSeconds: number
  ): Promise<void> {
    await promisify(this.client.setex).bind(this.client)(key, maxAgeInSeconds, value)
  }

  async destroy(key: string): Promise<void> {
    await promisify(this.client.del as unknown as (key: string) => Promise<number>).bind(this.client)(key)
  }

  async touch(key: string, maxAgeInSeconds: number): Promise<void> {
    await promisify(this.client.expire).bind(this.client)(key, maxAgeInSeconds)
  }
}

export default RedisSessionStore
