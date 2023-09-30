import { NextApiRequest } from 'next';
import { allowedTokens } from '../constants';

export function assertTokenAuth(req: NextApiRequest) {
  const token = req.query.token as string;
  const hasAccess = token && allowedTokens.includes(token);
  if (!hasAccess) {
    throw new Error(`Attempted accessing http handler without valid token`);
  }
}
