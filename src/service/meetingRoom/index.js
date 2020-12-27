import {queryAllMeetingRooms} from '../../repository/meetingRoom'

export const queryMeetingRoomList = () => {
  return queryAllMeetingRooms();
};
