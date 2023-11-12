import type { NextApiRequest, NextApiResponse } from 'next'
import { google } from 'googleapis';
import { getRyanairDetails, getLufthansaDetails, getKlmDetails } from '../../extractors';
import { IFlightDetails } from '../../types/airline';

const httpMethod = 'GET'
const searchKey = 'subject' // subject
const searchTopics = [
  'ryanair',
  'klm',
  'lufthansa',
  // 'Fwd: Confirmation: Berlin - San Francisco (SNJ3IN)',
  // 'Fwd: Booking details | Departure: 08 November 2022 | ZRH-BER'
]

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (Object.is(req.method, httpMethod)) {
    const auth = req.headers.authorization

    const gmail = google.gmail({ version: 'v1', headers: { Authorization: `Bearer ${auth}` } });
    const messages: Array<IFlightDetails> = [];

    try {
      const query = searchTopics.map(s => `${searchKey}: ${s}`).join(' OR ');

      const { data: { messages: list } } = await gmail.users.messages.list({
        userId: 'me',
        q: query,
      });

      if (list?.length) {
        for (const { id } of list) {
          const { data: { payload } } = await gmail.users.messages.get({
            userId: 'me',
            id: id ?? ''
          });

          const data = ((payload?.parts?.length ? payload.parts?.[1]?.body?.data : payload?.body?.data) ?? '')
          const decodedBody = Buffer.from(data, 'base64').toString();

          // ~> this will be from: example flight@klm.com
          const from = payload?.headers?.find(header => header?.name?.toLowerCase() === searchKey)?.value?.toLowerCase();

          let flightInfo = {
            ...(from?.includes('klm') && getKlmDetails(decodedBody) ),
            ...(from?.includes('ryanair') && getRyanairDetails(decodedBody)),
            ...(from?.includes('lufthansa') && getLufthansaDetails(decodedBody)),
          }

          if (Object.keys(flightInfo).length) {
            messages.push(flightInfo as IFlightDetails);
          }
          
          // ~ DO NOTHING!
        }
      }
    } catch (err: any) {
      console.log('Backend ==> ', err);

      return res.status(400).json({
        message: (err as Error).message
      })
    }

    return res.status(200).json({ data: messages })
  }

  return res.json({})
}