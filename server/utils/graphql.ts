
type GraphQLResponse<T> = {
  data?: T
  errors?: Array<{ message: string }>
}

export async function graphqlRequest<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const response = await $fetch<GraphQLResponse<T>>('/api/graphql', {
    method: 'POST',
    body: {
      query,
      variables,
    },
  })

  if (response.errors?.length) {
    throw new Error(
      response.errors.map((error) => error.message).join(', ')
    )
  }

  if (!response.data) {
    throw new Error('GraphQL returned no data')
  }

  return response.data
}
