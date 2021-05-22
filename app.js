const express = require('express')
const socketio = require('socket.io')

const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('index')
})

port = process.env.PORT || 3000
const server = app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})

// Initialize socket for the server
// After unsuccessfully connecting with const io = socketio(server),
// https://socket.io/docs/v4/troubleshooting-connection-issues/
// indicates the correct way:
const io = socketio(server, {
    'transports': [
        'websocket', // You are trying to reach a plain WebSocket server
        'polling' // The server is not reachable
    ], allowEIO3: true // The client is not compatible with the version of the server
});

io.on('connection', socket => {
    console.log("New user connected")

    socket.username = "Anonymous"

    // Change username
    socket.on('change_username', data => {
        socket.username = data.username
    })

    // New message
    socket.on('new_message', data => {
        console.log("new message")
        io.sockets.emit('receive_message', { message: data.message, username: socket.username })
    })

    // Typing event
    socket.on('typing', data => {
        socket.broadcast.emit('typing', { username: socket.username })
    })

})