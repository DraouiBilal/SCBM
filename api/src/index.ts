import express from 'express';
import { createServer } from 'http';
import {exec} from 'child_process';
import cors from 'cors';
import routers from './routers';
import { initSocketIO } from './socketio';
import dotenv from 'dotenv';
import sendgrid from '@sendgrid/mail'

dotenv.config();

const app = express()
const server = createServer(app);
const io = initSocketIO(server);

if(!process.env.SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY is not defined')
}

sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

app.use(express.json({limit: '3mb'}))

app.use(cors({origin: '*'}))

if(process.env.NODE_ENV === 'development') {
    exec('npx prisma studio')
}

const rootPath = `/api/${process.env.VERSION}`

app.use(`${rootPath}/devices`, routers.devicesRouter)
app.use(`${rootPath}/users`, routers.usersRouter)
app.use(`${rootPath}/histories`, routers.historiesRouter)

if (!process.env.PORT) {
    throw new Error('PORT is not defined')
}

let PORT: number;

try {
    PORT = parseInt(process.env.PORT);
} catch (err) {
    throw new Error('PORT is not a number');
}

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})