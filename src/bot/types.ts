import { Member } from '@slack/web-api/dist/response/UsersListResponse';

require('dotenv').config();

export type User = Member & { hasImage: boolean } & Required<
    Pick<Member, 'profile' | 'id'>
  >;
