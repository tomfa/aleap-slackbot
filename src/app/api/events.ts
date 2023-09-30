import { NextApiRequest, NextApiResponse } from 'next';
import { challenge } from '../../bot/events/challenge';
import { validateSlackRequest } from '../../bot/utils/validate';
import { signingSecret } from '../../bot/constants';
import { AppMentionEvent } from '@slack/bolt/dist/types/events/base-events';
import {
  guessNameFromPicture,
  GuessNameFromPictureEvent,
} from '../../bot/events/guessNameFromPicture';

export default async function events(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const type = req.body.type;
  const event = req.body.event as Event;

  if (type === 'url_verification') {
    challenge(req, res);
  } else if (validateSlackRequest(req, signingSecret)) {
    if (type === 'event_callback') {
      console.log('Received event_type:', type);

      if (event.type === 'app_mention') {
        return;
      }
      if (event.type === 'guess_name_from_picture') {
        await guessNameFromPicture(req, res, event);
        return;
      }
      console.log('Unhandled event:', JSON.stringify(event, null, 2));
    } else {
      console.log('body:', req.body);
    }
  }
}

type Event = AppMentionEvent | GuessNameFromPictureEvent;
