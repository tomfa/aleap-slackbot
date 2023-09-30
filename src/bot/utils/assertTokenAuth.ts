import { NextApiRequest } from 'next';
import { allowedTokens } from '../constants';

export function assertTokenAuth(req: NextApiRequest) {
  const token = req.query.token as string;
  if (allowedTokens.includes(token)) {
    return;
  }
  const httpAuth = req.headers.authorization?.split(' ')[1];
  if (httpAuth && allowedTokens.includes(httpAuth)) {
    return;
  }
  throw new Error(`Attempted accessing http handler without valid token`);
}
