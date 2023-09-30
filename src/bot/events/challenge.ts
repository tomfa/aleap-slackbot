import { NextApiRequest, NextApiResponse } from 'next';

export function challenge(req: NextApiRequest, res: NextApiResponse) {
  console.log('req body challenge is:', req.body.challenge);

  res.status(200).send({
    challenge: req.body.challenge,
  });
}
