import test from 'ava'
import RedisSessionStore from '..'
import redis, { ClientOpts } from 'redis'
import { promisify } from 'util'

const clientOptions: ClientOpts = {}
const { ttl, get, flushall } = createRedisTestFunctions(clientOptions)

test.serial('#set sets a value with expire time', async t => {
  // Given
  const store = new RedisSessionStore(clientOptions)

  // When
  await store.set('sid', 'Hello, World!', 10)

  // Then
  const expireTime = await ttl('sid')
  t.true(expireTime === 10)
  const value = await get('sid')
  t.is(value, 'Hello, World!')
})

test.serial('#get returns a value for a key', async t => {
  // Given
  const store = new RedisSessionStore(clientOptions)
  await store.set('sid', 'Hello, World!', 10)

  // When
  const value = await store.get('sid')

  // Then
  t.is(value, 'Hello, World!')
})

test.serial('#get returns null if the value does not exist', async t => {
  // Given
  const store = new RedisSessionStore(clientOptions)

  // When
  const value = await store.get('sid')

  // Then
  t.is(value, null)
})

test.serial('#destroy discards a value for a key', async t => {
  // Given
  const store = new RedisSessionStore(clientOptions)
  await store.set('sid', 'Hello, World!', 10)

  // When
  await store.destroy('sid')

  // Then
  const value = await get('sid')
  t.is(value, null)
})

test.serial('#touch updates expire time for a key', async t => {
  // Given
  const store = new RedisSessionStore(clientOptions)
  await store.set('sid', 'Hello, World!', 10)

  // When
  await store.touch('sid', 100)

  // Then
  const expireTime = await ttl('sid')
  t.true(expireTime === 100)
  const value = await get('sid')
  t.is(value, 'Hello, World!')
})

test.serial.afterEach(async () => {
  await flushall()
})

function createRedisTestFunctions(redisClientOptions: ClientOpts) {
  const client = redis.createClient(redisClientOptions)

  return {
    ttl: promisify(client.ttl).bind(client),
    get: promisify(client.get).bind(client),
    flushall: promisify(client.flushall).bind(client)
  }
}
