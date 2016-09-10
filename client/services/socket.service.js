import io from 'socket.io-client';
import { serverHost } from 'CONFIG/app.config';
const socket = io(serverHost);

export default socket;

socket.emit('hello', '233');
socket.on('word', function(msg) {
  console.log('握手成功。message: ' + msg);
});
