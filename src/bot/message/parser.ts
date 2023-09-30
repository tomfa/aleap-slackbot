export const parseMessageEvent = (data: unknown): MessageEvent => {
  const d = data as MessageEvent;
  console.log(`Parsing Message event`);
  console.log(JSON.stringify(d, undefined, 2));
  return {
    url: d.url,
    title: d.title,
    tags: d.tags || {},
    sentiment: d.sentiment || 'NEUTRAL',
    description: d.description,
    subtext: d.subtext,
    channel: d.channel,
  };
};

export type MessageEvent = {
  sentiment: 'HAPPY' | 'NEUTRAL' | 'SAD';
  url?: {
    href: string;
    title: string;
  };
  title: string;
  description?: string;
  subtext?: string;
  tags?: Record<string, string>;
  channel?: string;
};
