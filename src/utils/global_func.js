import { get } from '../utils/http';
export function loadRoomOption () {
  let url = '/meetingRooms/option';
  return get(url);
}
