import {get} from '../../utils/http'

export const queryAllMeetingRooms = async () => {
  let url = `/meetingRooms`;
  const body = await get(url);
  return body.data;
};

