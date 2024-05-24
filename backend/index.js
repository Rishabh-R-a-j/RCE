const express=require('express');
const cors=require('cors');
const port=process.env.PORT || 8080;

const app=express();
app.use(cors());

const server = app.listen(port, () => console.log('Server started on port 8080'));

const io= require("socket.io")(server,{
    cors: {
        origin: '*'
    },
});

const userSocketMap = {};
function getAllConnectedClients(roomId) {
    // Map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}

io.on('connection',socket=>{
    console.log("Connected to ",socket.id)

    socket.on('join',({roomId,username})=>{
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        console.log(clients)
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit('joined', {
                clients,
                username,
                socketId: socket.id,
            });
        });
    })

    socket.on('code_change',({roomId,code})=>{
        socket.to(roomId).emit('code_change',{code});
    })

    socket.on('sync_code', ({ socketId, code,language }) => {
        console.log(code,language)
        socket.to(socketId).emit('sync_code', { code,language });
    });

    socket.on('disconnecting',() => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.to(roomId).emit('disconnected', {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    })
})