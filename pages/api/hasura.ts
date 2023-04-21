// pages/api/hasura.js
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { gql } from '@apollo/client';

const HASURA_SECRET = process.env.HASURA_SECRET ? process.env.HASURA_SECRET : '';

if (!HASURA_SECRET) {
  throw new Error('Cannot find HASURA_SECRET');
}

const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.HASURA_URL,
    headers: {
      'x-hasura-admin-secret': HASURA_SECRET
    }
  }),
  cache: new InMemoryCache()
});

export default async function handler(req: any, res: any) {
  const { iataCodes } = req.query;

  const query = gql`
    query GetAirportsByIataCodes($iataCodes: [String!]!) {
      airports(where: { iata_code: { _in: $iataCodes } }) {
        iata_code
        latitude
        longitude
      }
    }
  `;
  console.log('emm: query is ', query)

  try {
    const { data } = await client.query({ query, variables: { iataCodes: JSON.parse(iataCodes) } });
    res.status(200).json(data.airports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from Hasura.' });
  }
}
