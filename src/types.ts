require("dotenv").config();
import { App, Block, KnownBlock } from "@slack/bolt";

export class ChatBot extends App {
  async dm({
    user,
    blocks,
    text = "",
  }: {
    user: string;
    blocks?: Array<Block | KnownBlock>;
    text?: string;
  }) {
    const token = process.env.SLACK_BOT_TOKEN;
    await this.client.chat.postMessage({ channel: user, token, blocks, text });
  }
}

// TODO: Depend on @slack/bolt types
export type Profile = { image_192: string; image_original?: string };
export type User = {
  id: string;
  deleted: boolean;
  is_bot: boolean;
  name: string;
  real_name: string;
  profile: Profile;
  hasImage: () => Promise<boolean>;
};
