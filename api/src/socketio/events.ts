import { sockets } from "./initSocket";

export const getClients = () => {
    console.log(sockets.clients.keys());
}