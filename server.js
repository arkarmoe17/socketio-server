const app = require('express')();

const Socket = require('socket.io');

const server = require('http').createServer(app);

let PORT = 5000;

const io = Socket(server,{
    cors: {
        origin: "*"
      }
})

let users = []

io.on("connection",(socket)=>{
    console.log("connect to : ",socket.id);
    console.log("Socket is active to be connected.");

    //chat
    // socket.on("chat", (payload) => {
    //     console.log("payload :",payload);
    //     io.emit("chat",payload)
    // });

    // io.sockets.emit("message",{
    //     message: "I love you."
    // })

    const room = 'MYROOM'

    socket.on("message", (message) => {
        io.sockets.emit("message_client", {
            user: socket.user,
            message
        })
    })

    socket.on("adduser", (username) => {
        socket.user = username;
        users.push(username)
        console.log("latest users", users)
        io.sockets.emit("users", users)
    })

    socket.on("disconnect", () => {
        console.log("disconnecting... ", socket.user)

        if (socket.user) {
            users.splice(users.indexOf(socket.user), 1);
        }
        io.sockets.emit("users", users)
        console.log('remaining users: ', users)
    })
});


// app.listen(5000, () => console.log("server is active..."));

server.listen(PORT, ()=>{
    console.log("server is listening at port 5000.");
})