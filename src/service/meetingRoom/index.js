import { queryAllMeetingRooms, updateDeviceStatus } from '../../repository/meetingRoom';

export const queryMeetingRoomList = () => {
  return queryAllMeetingRooms();
};

export const updateDevicePowerStatus = () => {
  return updateDeviceStatus();
};
