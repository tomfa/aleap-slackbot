import WebClient from '@slack/web-api/dist/WebClient';
import { token } from '../constants';

export class SlackClient extends WebClient {
  constructor() {
    super(token);
  }
}
