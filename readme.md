# `prismy-session-redis`

Session storage for `prismy-session`

```
npm i prismy-session prismy-session-redis
```

```ts
import { prismy, JsonBody, After } from 'prismy'
import { createSessionMiddleware, Session } from 'prismy-session'
import MemoryStore from 'prismy-session/MemoryStore'

const sessionMiddleware = createSessionMiddleware({
  store: new MemoryStore(),
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
