import { NextApiResponse } from 'next';

export function ack(res: NextApiResponse) {
  res.status(200).send({ message: 'OK' });
  return;
}
