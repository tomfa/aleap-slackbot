import { NextApiRequest, NextApiResponse } from 'next';
import { challenge } from '../../bot/events/challenge';
import { validateSlackRequest } from '../../bot/utils/validate';
import { signingSecret, verificationToken } from '../../bot/constants';
import { AppMentionEvent } from '@slack/bolt/dist/types/events/base-events';
import { GuessNameFromPictureEvent } from '../../bot/events/guessNameFromPicture';
import { BlockAction, StaticSelectAction } from '@slack/bolt';
import { ack } from '../../bot/utils/ack';
import { sendEvent } from './internal';

const handleEvent = async (req: NextApiRequest, res: NextApiResponse) => {
  const { payload, valid } = validateSlackRequest(
    req,
    verificationToken,
    signingSecret,
  );
  if (!valid) {
    console.error('Invalid request signature found');
    return;
  }

  if (payload.type === 'url_verification') {
    return challenge(req, res);
  }

  if (!isEvent(payload)) {
    console.error('Invalid event found', payload);
    return;
  }

  if (!isBlockAction(payload)) {
    console.error('Unhandled event type:', payload);
    return;
  }
  if (payload.actions.length !== 1) {
    console.error(
      'Expected exactly one action, got multiple:',
      payload.actions,
    );
    return;
  }
  if (!isStaticSelectBlockAction(payload)) {
    console.error('Unhandled event type:', payload);
    return;
  }
  if (isGuessNameFromPictureEvent(payload)) {
    const action = payload.actions[0]!;
    const selectedOption = action.selected_option.value;
    await sendEvent({
      name: 'guessName',
      data: {
        channel: payload.channel?.id || payload.response_url,
        selectedOption,
      },
    });
    return;
  }

  return;
};
export default async function events(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await handleEvent(req, res);
  ack(res);
}

const isEvent = (event: Record<string, any>): event is Event => {
  return typeof event.type === 'string';
};
const isBlockAction = (event: Event): event is BlockAction => {
  return event.type === 'block_actions';
};

const isStaticSelectBlockAction = (
  event: BlockAction,
): event is BlockAction<StaticSelectAction> => {
  return event.actions[0]?.type === 'static_select';
};

const isGuessNameFromPictureEvent = (
  event: BlockAction<StaticSelectAction>,
): event is GuessNameFromPictureEvent => {
  return event.actions[0]?.action_id === 'guess_name_from_picture';
};

type Event = BlockAction | AppMentionEvent | { type: string };
