import {
  handleFaceQuiz,
  HandleFaceQuizArgs,
} from '../../bot/handlers/facequiz';
import {
  guessNameFromPicture,
  GuessNameFromPictureArgs,
} from '../../bot/events/guessNameFromPicture';
import { NextApiRequest, NextApiResponse } from 'next';
import { assertTokenAuth } from '../../bot/utils/assertTokenAuth';
import { domainUrl, workerToken } from '../../bot/constants';
import { getBodyPayload } from '../../bot/utils/validate';

export type GuessNameEvent = {
  name: 'guessName';
  data: GuessNameFromPictureArgs;
};
const isGuessNameEvent = (event: any): event is GuessNameEvent =>
  event.name === 'guessName';

export type FaceQuizEvent = {
  name: 'faceQuiz';
  data: HandleFaceQuizArgs;
};
const isFaceQuizEvent = (event: any): event is FaceQuizEvent =>
  event.name === 'faceQuiz';

export const sendEvent = async (
  event: FaceQuizEvent | GuessNameEvent,
  wait: number | 'finish' = 1000,
) => {
  const isKnownEvent = isGuessNameEvent(event) || isFaceQuizEvent(event);
  if (!isKnownEvent) {
    throw new Error('Unknown event type', event);
  }
  const url = new URL('/api/internal', domainUrl).href;
  console.log(`POST "${event.name}" to ${url}`);
  const promiseResult = fetch(url, {
    method: 'POST',
    body: JSON.stringify(event),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${workerToken}`,
    },
  });
  if (wait === 'finish') {
    return promiseResult;
  } else {
    // Hack: Vercel will tear down the worker after response is sent.
    //   We therefore await a bit, to ensure the fetch request is performed.
    //   We can't really wait until finish for Slack events, since Slack will
    //   error if we don't respond with an "ack" quickly.
    //
    // Sigh

    await new Promise((resolve) => setTimeout(resolve, Math.max(wait, 500)));
  }
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
