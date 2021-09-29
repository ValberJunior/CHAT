
// const room = window.location.pathname.replace(/\//g,''); //Substituir as / por vazio;
// console.log(room);
const socket = io(`http://localhost:3000`);  // Conectar na sala

let user = null;

//Recebendo a mensagem do Backend
socket.on('update_messages', (messages)=>{
   
updateMessagesOnScreen(messages);

})

//Recebendo o usuário do Backend
socket.on('update_users', (users)=>{
   
    updateUsersOnScreen(users);
    
    })

function updateMessagesOnScreen(messages){
    const div_messages = document.querySelector('#messages');

    let list_messages = '<ul>'; // Abrir minha lista não ordenada;

    //Para cada mensagem que eu tiver, irei adicionar a minha lista.

    messages.forEach(message=>
        {
            list_messages += `<li>${message.user} - ${message.msg}</li>`
        })
        list_messages += '</ul>';

        //colocar minhas mensagens na div

        div_messages.innerHTML = list_messages;
}

function updateUsersOnScreen(users){
    const userBar = document.querySelector('#usersOn');

    let list_users = '<ul>'; // Abrir minha lista não ordenada;

    //Para cada mensagem que eu tiver, irei adicionar a minha lista.

    users.forEach(user=>
        {
            list_users += `<li>${user.status}</li>`;   
            return list_users;
        })
        list_users += '</ul>';


        //colocar minhas mensagens na div

        userBar.innerHTML = list_users;
}

document.addEventListener('DOMContentLoaded',()=>{

        const chooseUser = document.querySelector('#myModal');

        chooseUser.style.display = 'flex';
        //Form Definir o usuário
        const userForm = document.querySelector('#user_form');
        userForm.addEventListener('submit',(e)=>{
            
            e.preventDefault();

            let color = document.querySelector('#color').value;     //Choose Color
            let status = document.querySelector('#status').value;    //Choose status
            let chat_room = document.querySelector('#chat_room').value;    //Choose Room
            let roomName = document.querySelector('#roomName');

            roomName.innerText = chat_room;   // Room Name 

                
            let text = document.forms['user_form_name']['user'].value;
    

            user =`<strong style="color:${color}">${status} ${text}</strong>`;      
            
              
            let userSts = user;
                
          
            document.forms['message_form_name']['msg'].value = '';

            //Enviar o usuário logado para o backend:
            
            socket.emit('new_user_status',{status: userSts});
        
          

            userForm.parentNode.removeChild(userForm);
            chooseUser.parentNode.removeChild(chooseUser);
           

        })



        const form = document.querySelector('#message_form');
        form.addEventListener('submit',(e)=>{
            
            e.preventDefault();

        //Condicional para checar se há um usuário:

        if (!user){
            alert("Defina um usuário");
            return; // Return para não continuar o código
        }
       
            
        
        // Para enviar mensagens 
        
        const message = document.forms['message_form_name']['msg'].value;
        
        document.forms['message_form_name']['msg'].value = '';
        
        //enviar a mensagem para o backend
        socket.emit('new_message',{user:user , msg: message});
    
    })

})


//sound new message
const audio = document.querySelector('#audio');

socket.on('hello',(data)=>{
    console.log(data.msg)
})