import { handleFaceQuiz } from '../../bot/handlers/facequiz';
import { guessNameFromPicture } from '../../bot/events/guessNameFromPicture';
import { NextApiRequest, NextApiResponse } from 'next';
import { assertTokenAuth } from '../../bot/utils/assertTokenAuth';
import { domainUrl, workerToken } from '../../bot/constants';
import { getBodyPayload } from '../../bot/utils/validate';

type GuessNameEvent = {
  name: 'guessName';
  data: {
    channel: string;
    selectedOption: string;
  };
};
const isGuessNameEvent = (event: any): event is GuessNameEvent =>
  event.name === 'guessName';

type FaceQuizEvent = {
  name: 'faceQuiz';
  data: {
    userId: string;
    responseUrl: string;
  };
};
const isFaceQuizEvent = (event: any): event is FaceQuizEvent =>
  event.name === 'faceQuiz';

export const sendEvent = (event: FaceQuizEvent | GuessNameEvent) => {
  const isKnownEvent = isGuessNameEvent(event) || isFaceQuizEvent(event);
  if (!isKnownEvent) {
    throw new Error('Unknown event type', event);
  }
  console.log('using domain url', domainUrl);
  const url = new URL('/api/internal', domainUrl).href;
  console.log(`POSTing ${event.name} to ${url}`);
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(event),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${workerToken}`,
    },
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  assertTokenAuth(req, [workerToken]);
  const event = getBodyPayload(req);
  if (isGuessNameEvent(event)) {
    await guessNameFromPicture(event.data);
    res.send('ok');
    return;
  }
  if (isFaceQuizEvent(event)) {
    await handleFaceQuiz(event.data);
    res.send('ok');
    return;
  }
}
