const express = require('express');
const app = express();
const PORT = 3000;
const socketIo = require('socket.io');
const path = require('path');

//Rota Estática 
app.use('/', express.static(path.join(__dirname, 'public')));

const server = app.listen(PORT,()=>{
    console.log(`Server Running on Port ${PORT}`)
})

//array de Mensagem
const messages = [];

//array de users
const users = [];

const io = socketIo(server);


io.on('connection',(socket)=>{

    console.log("New connection");
    //Enviar somente para novas conexões, as mensagens já geradas:
    socket.emit('update_messages', messages);
    socket.broadcast.emit('hello',{msg: 'Chegou um novo usuário'})
        
    //Quando tiver uma nova mensagem, ela será adicionada a um array e será mostrada para todos
    
    //A mensagem será recebida do front-end aqui:
    socket.on('new_message', (data)=>{
        messages.push(data);
        //Mandar a mensagem para todo mundo, inclusive para quem enviou
        io.emit('update_messages', messages);
    
    });

    //Quando um usuário entra, ele vai para a lista de usuários
    socket.on('new_user_status',(data)=>{
        users.push(data);
        io.emit('update_users', users)});
 

});


