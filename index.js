const express = require('express');
const app = express();
const PORT = 3000;
const socketIo = require('socket.io');
const path = require('path');


//Salas  
app.get('/', (req, res)=>{

    try {
    res.redirect('localhost:3000/room1');
    }
    catch(error){
    res.send(error.message);
    }

})                   
app.use('/room1', express.static(path.join(__dirname, 'public')));
app.use('/room2', express.static(path.join(__dirname, 'public')));

// app.get('/room1', (req,res)=>{

//     try {
//         res.redirect('localhost:3000/room1');
//         }
//         catch(error){
//         res.send(error.message);
//         }

// });

// app.get('/room2', (req,res)=>{

//     try {
//         res.redirect('localhost:3000/room2');
//         }
//         catch(error){
//         res.send(error.message);
//         }

// })

const server = app.listen(PORT,()=>{
    console.log(`Server Running on Port ${PORT}`)
})


//array de Mensagem
const messages = {room1:[], room2:[]};

//array de users
const users = {room1:[], room2:[]};

//sound
let sound= null;

const io = socketIo(server);

const room1 = io.of('/room1').on('connection', (socket)=>{

    console.log("New connection");
    //Enviar somente para novas conexões, as mensagens já geradas:
    socket.emit('update_messages', messages.room1);
    socket.broadcast.emit('hello',{msg: 'Um novo usuário entrou na Sala'})
    
    
        
    //Quando tiver uma nova mensagem, ela será adicionada a um array e será mostrada para todos
    
    //A mensagem será recebida do front-end aqui:
    socket.on('new_message', (data)=>{
        messages.room1.push(data);
        //Mandar a mensagem para todo mundo, inclusive para quem enviou
        room1.emit('update_messages', messages.room1);
        sound = true;
        socket.broadcast.emit('sound',sound)
    
    });

    //Quando um usuário entra, ele vai para a lista de usuários
    socket.on('new_user_status',(data)=>{
        users.room1.push(data);
        room1.emit('update_users', users.room1)});
 
    
      //Quando um usuário sai
         socket.on('user_logOff',(data)=>{
         const index = users.room1.indexOf(data);
         users.room1.splice(index,1)
         room1.emit('update_users', users.room1);
     })



})




const room2 = io.of('/room2').on('connection', (socket)=>{

    console.log("New connection");
    //Enviar somente para novas conexões, as mensagens já geradas:
    socket.emit('update_messages', messages.room2);
    socket.broadcast.emit('hello',{msg: 'Um novo usuário entrou na Sala'})
    
    
        
    //Quando tiver uma nova mensagem, ela será adicionada a um array e será mostrada para todos
    
    //A mensagem será recebida do front-end aqui:
    socket.on('new_message', (data)=>{
        messages.room2.push(data);
        //Mandar a mensagem para todo mundo, inclusive para quem enviou
        room2.emit('update_messages', messages.room2);
        sound = true;
        socket.broadcast.emit('sound',sound)
    
    });


});
