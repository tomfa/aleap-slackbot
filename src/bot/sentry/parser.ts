import { SentryEvent, SentryWebhookEvent } from './types';

const ignoredTags = [
  'handled',
  'environment',
  'mechanism',
  'level',
  'sentry:release',
  'kind',
];

export const parseSentryEvent = (data: unknown): SentryEvent => {
  const d = data as SentryWebhookEvent;
  console.log(`Parsing Sentry event`);
  console.log(JSON.stringify(d, undefined, 2));
  return {
    url: d.url,
    title: d.event.title,
    message: d.message,
    environment: d.event.environment,
    release: d.event.release || '?',
    tags: Object.fromEntries(
      d.event.tags
        .map((t) => t.slice(0, 2))
        .filter(([k]) => !ignoredTags.includes(k)),
    ),
  };
};
