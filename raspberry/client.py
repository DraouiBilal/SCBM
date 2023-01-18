import socketio
from time import sleep

sio = socketio.Client()


@sio.event
def connect():
    print('connection established')
    sio.emit('initial_connection', {'device': {
        'id': '4ed3309b-61c2-47d9-a69e-112c4d8164d9',
        'name': 'Raspberry Pi'  
    }})


@sio.event
def open_door(data):
    print('Door opeened')
    sio.emit('door_opened', {'status': 'ok'})


@sio.event
def disconnect():
    print('disconnected from server')


sio.connect('http://localhost:5000')

sleep(2)

sio.emit('get_clients')

sio.wait()
