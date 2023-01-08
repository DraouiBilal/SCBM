import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { getClients } from "./events";

export const sockets = {
    clients: new Map<string, Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>>(),
}

export const initSocket = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    socket.on('initial_connection', ({device:{id}}:{device:{id: string,name: string}})=>sockets.clients.set(id, socket));
    socket.on('get_clients', getClients);
}

