import { AckFn, RespondArguments, SayFn, SlashCommand } from '@slack/bolt';

import { MessageError } from './errors';
import { ChatBot } from './types';
import { getFaceQuiz } from './quiz';
import { fetchUsers } from './data';

const getFaceQuizCommand =
  (app: ChatBot) =>
  async ({
    command,
    ack,
    say,
  }: {
    command: SlashCommand;
    ack: AckFn<string | RespondArguments>;
    say: SayFn;
  }) => {
    try {
      await ack();
      const slackUsers = await fetchUsers({ app });
      const quiz = await getFaceQuiz({
        exclude: [command.user_id],
        slackUsers,
      });
      await app.dm({ user: command.user_id, blocks: quiz.blocks });
    } catch (error) {
      if (error instanceof MessageError) {
        await app.dm({
          user: command.user_id,
          text: (error as MessageError).message,
        });
      } else {
        throw error;
      }
    }
  };

export const addSlashCommands = (app: ChatBot) => {
  app.command('/facequiz', getFaceQuizCommand(app));
};
