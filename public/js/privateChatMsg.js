let token = localStorage.getItem('token');
let groupId = localStorage.getItem('groupId');
let userId=localStorage.getItem('userId');
let lastMsgId=0;
let socket=io();


window.addEventListener('DOMContentLoaded', async () => {
    try {
        authenticateLogin()
        document.getElementById('box').style.display ='none'
        document.getElementById('chatTextArea').style.display ='none'
        document.getElementById('send').style.display ='none'
        document.getElementById('fileInput').style.display='none'

        //const headingResp = await axios.get(`/private-chat/heading-data/${userId}`, { headers: { "Authorization": token } });
        const UserHeadingResp = await axios.get(`/private-chat/heading-data/${userId}`, { headers: { "Authorization": token } });
        const Name = UserHeadingResp.data.userName.name
        document.getElementById('Chatheading').innerHTML = `Hi ${Name}, Welcome to the Private Chat Room`;
        
        const listOfUsers = await axios.get(`/private-chat/friends-list`, { headers: { "Authorization": token } });
        //console.log(listOfUsers)
        listOfUsers.data.forEach(element=>{
            //console.log(element.id.numberValue.toString()===userId.numberValue.toString();
           //console.log(userId.toString()===element.id.toString())
           if (userId.toString()===element.id.toString()){
            return
           }
            showUsersOnScreen(element);
        })
        socket.emit('join-room', userId);
    }
    catch(err){
        console.log(err)
        //alert(err.response.data.message);

    }})



    function showUsersOnScreen(data){
        
        let parentUsersList = document.getElementById('Users-list-id');
        //let childUsersList = `<li id=${data.id}>${data.name}</li>`

        let childUsersList = `<li id=${data.id} class="mt-3 fw-bold" >${data.name}<button onclick=getAllChat('${data.id}') class="btn btn-outline-primary ms-2">Chat </button></li>`
        
        if (childUsersList){
            parentUsersList.innerHTML+=childUsersList;
        }
    }

    async function getAllChat(id){
        try{
            document.getElementById('box').style.display ='block'
            document.getElementById('chatTextArea').style.display ='block'
            document.getElementById('send').style.display ='block'
            document.getElementById('fileInput').style.display='block'
            
            localStorage.setItem('receiverId',id);
            let receiverId = id;
            let senderId = userId;
            console.log(receiverId,senderId)
            const allChatMsgs = await axios.get(`/private-chat/allMsgs/${receiverId}/${senderId}`, { headers: { "Authorization": token } });
            
            var latestMessages = allChatMsgs.data.latestMessages;
            latestMessages.reverse()

            document.querySelector('#box').innerHTML = ""
            
            latestMessages.forEach((elem)=>{
                displayAllChatMsgs(elem);
            });
        }
        catch(err){
            console.log(err)
        }
        
        
    }

    document.getElementById('send').onclick = async function (e) {
        e.preventDefault();
        let fileInput = document.getElementById('fileInput')
        let fileInputValue = document.getElementById("fileInput").value;
        let receiverId = localStorage.getItem('receiverId');
        let message= document.getElementById('chatTextArea').value;
        let senderId = userId;
        //console.log(token)
        
        if (!(fileInputValue) &&!(message)){
            document.getElementById('chatTextArea').value="";
            return
        }else if ((!fileInputValue)&&(message.trim()===""))
        {   document.getElementById('chatTextArea').value="";
            return
        }
        //console.log(receiverId)
        try {
            let formData = new FormData();
            formData.append('message', message);
            formData.append('file', fileInput.files[0]);
            formData.append('senderId', senderId);
            formData.append('receiverId', receiverId);

            //change back to the original state
            document.getElementById('chatTextArea').value="";
            document.getElementById('fileInput').value="";
            
            const postMsgResp = await axios.post(`/private-chat/message`, formData, { 
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    "Authorization": token 
                } });
            
            
            
            //console.log(receiverId,senderId,"check")
            socket.emit('send-private-message',receiverId,senderId);

        //     //socket function:==>
            


           

        }
        catch (err) {
             console.log(err,'999')
            //alert(err.response.data.message);
        }

    }

    socket.on('receive-private-message', async(receiverId,senderId)=>{
        // console.log('received from back end:-->',data==groupId);
        try{
            //message will be send to the specific gr only:
            //console.log(receiverId,senderId,"check 2")
            //const newPrivateMessages= await axios.get(`private-chat/new-messages/?groupId=${groupId}&lastMsgId=${lastMsgId}`);
            const newPrivateMessages= await axios.get(`/private-chat/new-messages/${receiverId}/${senderId}`, { headers: { "Authorization": token } })
            // console.log("newmessages---->",newMessages.data);
            //console.log(newPrivateMessages.data.lastMessage.message,"newPrivateMessages")
            //const newMessage=newPrivateMessages.data.lastMessage; //updating last message Id
            const lastMessage = newPrivateMessages.data.lastMessage;
            // console.log('lastmsgId',lastMsgId);
            if (lastMessage){
                displayAllChatMsgs(lastMessage);
            }
            
            
                
        
            
        }
        catch(err){
            console.log(err)
            alert('something went wrong!!!')
        }
    
    })

    function displayAllChatMsgs(data) {
        //console.log(data.senderId, data.receiverId, data.senderName, data.receiverName, data.message, "111111");
    
        const senderId = data.senderId;
        const senderName = data.senderName;
        const receiverId = data.receiverId;
        const receiverName = data.receiverName;
        const message = data.message;
        const multimedia = data.multimedia;
    
        let parentNode = document.querySelector('#box');
    
        if (senderId == userId) {
            // Message container
            if (message) {
                const messageContainer = document.createElement('div');
                messageContainer.classList.add('right', 'message');
                messageContainer.id = senderId;
    
                const messageText = document.createElement('span');
                messageText.classList.add('fw-bold', 'fst-italic');
                messageText.textContent = `${senderName}: ${message}`;
                messageContainer.appendChild(messageText);
    
                // Append the message container to the chat container
                parentNode.appendChild(messageContainer);
            }
    
            // Multimedia container
            if (multimedia) {
                const multimediaContainer = document.createElement('div');
                multimediaContainer.classList.add('right', 'multimedia');
                multimediaContainer.id = senderId;
    
                const multimediaElement = document.createElement('img');
                multimediaElement.src = multimedia;
                multimediaElement.alt = 'Multimedia';
                multimediaElement.style.width = '400px'//'100px'; // Adjust the width as needed
                multimediaElement.style.height = '400px'//'auto'; //
                multimediaElement.style.border = '6px solid #800080'
                multimediaContainer.appendChild(multimediaElement);
    
                // Append the multimedia container to the chat container
                parentNode.appendChild(multimediaContainer);
            }
        } else {
            // Message container
            if (message) {
                const messageContainer = document.createElement('div');
                messageContainer.classList.add('left', 'message');
                messageContainer.id = senderId;
    
                const messageText = document.createElement('span');
                messageText.classList.add('fw-bold', 'fst-italic');
                messageText.textContent = `${senderName}: ${message}`;
                messageContainer.appendChild(messageText);
    
                // Append the message container to the chat container
                parentNode.appendChild(messageContainer);
            }
    
            // Multimedia container
            if (multimedia) {
                const multimediaContainer = document.createElement('div');
                multimediaContainer.classList.add('left', 'multimedia');
                multimediaContainer.id = senderId;
    
                const multimediaElement = document.createElement('img');
                multimediaElement.src = multimedia;
                multimediaElement.alt = 'Multimedia';
                multimediaElement.style.width = '400px'; // Adjust the width as needed
                multimediaElement.style.height = '400px'; //
                multimediaElement.style.border = '6px solid #800080'
                multimediaContainer.appendChild(multimediaElement);
    
                // Append the multimedia container to the chat container
                parentNode.appendChild(multimediaContainer);
            }
        }
    }
    
    
    

    function Logout(){
        alert('You are logged out');
        window.location.href = '/logout'
      }


      function authenticateLogin(){
        token = localStorage.getItem('token')
        //----decode to check if premium
        function parseJwt (token) {
                var base64Url = token.split('.')[1];
                var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
    
                return JSON.parse(jsonPayload);
            }
            decoded = parseJwt (token)
            if (decoded.isloggedin===false){
            alert('You are logged out');
                window.location.assign("login");
                }
    
    }
    
      
    
    