import { get, post } from '../../utils/http';

export const queryAllMeetingRooms = async () => {
  let url = `/meetingRooms`;
  const body = await get(url);
  return body.data;
};

export const updateDeviceStatus = async content => {
  let url = `/meetingRooms`;
  const body = await post(url, content);
  return body.data;
};

export const uploadAudio = async (data) => {
  let url = `/myMeeting/upload/audio`;
  const body = await post(url, data);
  return body.data;
};
