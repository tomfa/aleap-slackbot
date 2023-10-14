import { EventSchemas, Inngest } from 'inngest';
import { serve } from 'inngest/next';
import { handleFaceQuiz } from '../../bot/handlers/facequiz';
import { guessNameFromPicture } from '../../bot/events/guessNameFromPicture';

export const inngest = new Inngest({
  id: 'async-handler',
  schemas: new EventSchemas().fromRecord<Events>(),
});

type StatusRequest = {
  data: {
    channelId: string;
    app: string;
    username: string;
  };
};
type GuessNameEvent = {
  data: {
    channel: string;
    selectedOption: string;
  };
};
type FaceQuizEvent = {
  data: {
    userId: string;
    responseUrl: string;
  };
};
type DeployEvent = {
  data: {
    username: string;
    channelId: string;
    app: string;
  };
};

type Events = {
  status: StatusRequest;
  guessName: GuessNameEvent;
  faceQuiz: FaceQuizEvent;
  deploy: DeployEvent;
};

const faceQuizRequest = inngest.createFunction(
  { id: 'face-quiz' },
  { event: 'faceQuiz' },
  async ({ event, step }) => {
    await handleFaceQuiz(event.data);
    return { event };
  },
);

const guessNameRequest = inngest.createFunction(
  { id: 'guess-name' },
  { event: 'guessName' },
  async ({ event, step }) => {
    await guessNameFromPicture(event.data);
    return { event };
  },
);

export default serve({
  client: inngest,
  functions: [faceQuizRequest, guessNameRequest],
});
