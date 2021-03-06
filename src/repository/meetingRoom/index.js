import { get, post } from '../../utils/http';

export const queryAllMeetingRooms = async () => {
  let url = `/meetingRooms`;
  const body = await get(url);
  return body.data;
};

export const updateDeviceStatus = async content => {
  let url = `/meetingRooms`;
  return post(url, content);
};

export const uploadAudio = async (data) => {
  let url = `/myMeeting/upload/audio`;
  const body = await post(url, data);
  return body.data;
};

export const recording = async (data) => {
  let url = `/myMeeting/recording`;
  const body = await post(url, data);
  return body.data;
};
