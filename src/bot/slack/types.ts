export type SentryEvent = {
  url: string;
  title: string;
  message: string;
  environment: string;
  release: string;
  tags: Record<string, string>;
};

interface Logentry {
  formatted: string;
  message?: any;
  params?: any;
}

interface Geo {
  country_code: string;
  city: string;
  region: string;
}

interface User {
  id: string;
  email: string;
  ip_address: string;
  username: string;
  name: string;
  geo: Geo;
}

interface Data {
  hello: string;
}

interface Env {
  ENV: string;
}

interface Browser {
  name: string;
  version: string;
  type: string;
}

interface ClientOs {
  name: string;
  version: string;
  type: string;
}

interface Contexts {
  browser: Browser;
  client_os: ClientOs;
}

interface SentryInterfacesMessage {
  message: string;
  params: any[];
}

interface Data2 {
  message: string;
  'sentry.interfaces.Message': SentryInterfacesMessage;
}

interface Extra {
  go_deeper: string[][];
  loadavg: number[];
  user: string;
}

interface Extra2 {
  go_deeper: string[];
  loadavg: number[];
  user: string;
}

interface Kwargs {
  level: number;
  message: string;
  data?: any;
  extra: Extra2;
  stack?: boolean;
  tags?: any;
}

interface SentryInterfacesMessage2 {
  message: string;
  params: any[];
}

interface Result {
  message: string;
  'sentry.interfaces.Message': SentryInterfacesMessage2;
}

interface V {
  message: string;
  params: any[];
}

interface Options {
  data?: any;
  tags?: any;
}

interface Vars {
  culprit?: any;
  data: Data2;
  date: string;
  event_id: string;
  event_type: string;
  extra: Extra;
  frames: string;
  handler: string;
  k: string;
  kwargs: Kwargs;
  public_key?: any;
  result: Result;
  self: string;
  stack: boolean;
  tags?: any;
  time_spent?: any;
  v: V;
  message: string;
  client: string;
  options: Options;
  args: string[];
  dsn: string;
  opts: string;
  parser: string;
  root: string;
}

interface Frame {
  function: string;
  module: string;
  filename: string;
  abs_path: string;
  lineno: number;
  pre_context: string[];
  context_line: string;
  post_context: string[];
  in_app: boolean;
  vars: Vars;
  colno?: any;
  data?: any;
  errors?: any;
  raw_function?: any;
  image_addr?: any;
  instruction_addr?: any;
  addr_mode?: any;
  package?: any;
  platform?: any;
  symbol?: any;
  symbol_addr?: any;
  trust?: any;
  snapshot?: any;
}

interface Stacktrace {
  frames: Frame[];
}

interface EmptyMap {}

interface Session {
  foo: string;
}

interface Extra3 {
  emptyList: any[];
  emptyMap: EmptyMap;
  length: number;
  results: number[];
  session: Session;
  unauthorized: boolean;
  url: string;
}

interface Metadata {
  title: string;
}

interface Event {
  event_id: string;
  level: string;
  version: string;
  type: string;
  release?: string;
  logentry: Logentry;
  logger: string;
  platform: string;
  timestamp: number;
  received: number;
  environment: string;
  user: User;
  contexts: Contexts;
  stacktrace: Stacktrace;
  tags: string[][];
  extra: Extra3;
  fingerprint: string[];
  hashes: string[];
  culprit: string;
  metadata: Metadata;
  title: string;
  location?: any;
  _ref: number;
  _ref_version: number;
  nodestore_insert: number;
  id: string;
}

export interface SentryWebhookEvent {
  id: string;
  project: string;
  project_name: string;
  project_slug: string;
  logger?: any;
  level: string;
  culprit: string;
  message: string;
  url: string;
  triggering_rules: any[];
  event: Event;
}
