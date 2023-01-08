import {Server} from 'socket.io';
import {Server as WebServer } from 'http';
import {IncomingMessage, ServerResponse} from 'http';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { initSocket } from './initSocket';

export const initSocketIO = (server: WebServer<typeof IncomingMessage, typeof ServerResponse>): Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> => {
    const io = new Server(server);
    
    io.on('connection', (socket) => {
        console.log('a user connected');

        initSocket(socket);
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });

    return io;
}

