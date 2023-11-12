import { createClient } from 'urql';

const { HASURA_SECRET, HASURA_URL } = process.env;

export function getClient() {
  return createClient({
    url: HASURA_URL!,
    fetchOptions: {
      headers: {
        'x-hasura-admin-secret': HASURA_SECRET!,
      }
    },
    exchanges: []
  });
}

