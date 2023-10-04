import { channelNameToId } from './channels';
import { ChatPostMessageArguments } from '@slack/web-api';
import { SlackClient } from './client';
import { token } from '../constants';

// Updates on a specific message. Calling twice will override the first response.
export async function respond({
  responseUrl,
  payload,
}: {
  responseUrl: string;
  payload: Omit<ChatPostMessageArguments, 'channel'> | string;
}) {
  const message: Omit<ChatPostMessageArguments, 'channel'> =
    typeof payload === 'string'
      ? {
          text: payload,
        }
      : {
          text: '',
          ...payload,
        };
  const data = await fetch(responseUrl, {
    method: 'POST',
    body: JSON.stringify(message),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  console.log('data from respond:', data);
}

export async function chat({
  channel,
  payload,
}: {
  channel: ChatPostMessageArguments['channel']; // e.g. @username or #channelname
  payload:
    | Pick<
        ChatPostMessageArguments,
        'blocks' | 'attachments' | 'text' | 'mrkdwn'
      >
    | string;
}) {
  const channelId = await channelNameToId(channel);
  if (!channelId) {
    console.error(`Unable to find channel with name ${channel}`);
    return;
  }

  const message =
    typeof payload === 'string'
      ? {
          channel: channelId,
          text: payload,
        }
      : {
          channel: channelId,
          text: '',
          ...payload,
        };

  try {
    const client = new SlackClient();
    const data = await client.chat.postMessage(message);

    console.log('data from fetch:', data);
  } catch (err) {
    console.log('fetch Error:', err);
  }
}
