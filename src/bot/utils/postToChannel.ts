import { MessageAttachment, SayArguments } from '@slack/bolt';
import { channelNameToId } from './channels';
import { token } from '../constants';
import { ChatPostMessageArguments } from '@slack/web-api';

// Responds on a specific message. Can only be called once. Calling twice will override the first response.
export async function respond({
  responseUrl,
  payload,
}: {
  responseUrl: string;
  payload: SayArguments | string;
}) {
  const message =
    typeof payload === 'string'
      ? {
          text: payload,
        }
      : {
          text: '',
          ...payload,
        };
  const response = await fetch(responseUrl, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(message),
  });
  const data = await response.json();

  console.log('data from respond:', data);
}

export async function postToChannel({
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
    const url = 'https://slack.com/api/chat.postMessage';
    const response = await fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(message),
    });
    const data = await response.json();

    console.log('data from fetch:', data);
  } catch (err) {
    console.log('fetch Error:', err);
  }
}
