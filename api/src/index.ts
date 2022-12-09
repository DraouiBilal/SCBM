import express from 'express';
import routers from './routers';
import {exec} from 'child_process';

const app = express()

app.use(express.json())

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

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})