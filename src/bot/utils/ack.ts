import { NextApiResponse } from 'next';

export function ack(res: NextApiResponse) {
  res.send(null);
}
