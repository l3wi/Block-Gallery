import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client"

export const client = new ApolloClient({
  uri: "https://gateway.thegraph.com/api/2145662e4b64b1671b456e9aea591df4/subgraphs/id/0x3c3cab03c83e48e2e773ef5fc86f52ad2b15a5b0-0",
  cache: new InMemoryCache()
})

export const getLatestProjects = async () => {
  try {
    const info = await client.query({
      query: gql`
        query {
          projects(
            first: 12
            where: { active: true }
            orderBy: projectId
            orderDirection: desc
          ) {
            projectId
            name
            description
            artistName
            invocations
            complete
            curationStatus
            dynamic
            locked
            tokens(first: 1) {
              tokenId
            }
          }
        }
      `
    })
    return info.data
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getSingleProject = async (id) => {
  console.log(id)
  try {
    const info = await client.query({
      query: gql`
        query Project($id: String!) {
          projects(where: { projectId: $id }) {
            projectId
            name
            description
            artistName
            invocations
            complete
            curationStatus
            dynamic
            locked
            tokens(first: 20) {
              tokenId
            }
          }
        }
      `,
      variables: { id },
      fetchPolicy: "no-cache"
    })
    console.log(info)
    return info.data
  } catch (error) {
    console.log(error)
    return error
  }
}
