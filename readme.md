# `prismy-session-redis`

Session storage for [`prismy-session`](https://github.com/prismyland/prismy-session)

```
npm i prismy-session prismy-session-redis
```

```ts
import { prismy, JsonBody, After } from 'prismy'
import { createSessionMiddleware, Session } from 'prismy-session'
import RedisSessionStore from 'prismy-session-redis'

const sessionMiddleware = createSessionMiddleware({
  store: new RedisSessionStore({
    // Redis client options...
  }),
  secret: 'yolo'
})

export class MyHandler {
  async execute(@Session session: SessionStore) {
    session.get() as any
    session.set()
  }
}

export default prismy([sessionMiddleware, MyHandler])
```
