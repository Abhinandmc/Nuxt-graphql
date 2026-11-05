
import { createYoga } from 'graphql-yoga'
import { createSchema } from 'graphql-yoga'
import { typeDefs } from '../graphql/schema'
import { resolvers } from '../graphql/resolver'

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Response },
})

export default defineEventHandler(async (event) => {
  return yoga.fetch(
    getRequestURL(event),
    {
      method: event.method,
      headers: event.headers,
      body: ['GET', 'HEAD'].includes(event.method ?? '')
        ? undefined
        : await readRawBody(event),
    }
  )
})
