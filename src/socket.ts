import { io } from 'socket.io-client';

const socket = io('https://codelang.vercel.app/');

export default socket;
