let token = localStorage.getItem('token');
let groupId = localStorage.getItem('groupId');
let userId=localStorage.getItem('userId');
let lastMsgId=0;
let socket=io();


window.addEventListener('DOMContentLoaded', async () => {
    try {
        authenticateLogin()

         //heading data:user name,group name:
         const headingResp = await axios.get(`/group/heading-data/${groupId}`, { headers: { "Authorization": token } });
        //  console.log('heading resp==>', headingResp.data);
         document.getElementById('Groupchatheading').innerHTML = `Hi ${headingResp.data.userName}, Welcome to Group Chat Room`;
         document.getElementById('chatbox').innerHTML=`Group: ${headingResp.data.groupName}`
         localStorage.setItem('userId',headingResp.data.userId);
        userId=headingResp.data.userId;
        
        
        //display function:****
       const allMsgResp=await axios.get(`/all-messages/?groupId=${groupId}&lastMessageId=${lastMsgId}`);
    //    console.log("allmsg-->",allMsgResp.data);
      lastMsgId=allMsgResp.data[allMsgResp.data.length-1].id;
        
      allMsgResp.data.forEach((elem)=>{
        display(elem);
    });

        const allGroupMemberRes = await axios.get(`/userGroup/members/${groupId}`, { headers: { "Authorization": token } });
        // console.log('members=>', allGroupMemberRes.data);
        allGroupMemberRes.data.forEach(element => {
            showgroupMembersOnScreen(element);

        });
        const adminsResp = await axios.get(`/group-admins/${groupId}`, { headers: { "Authorization": token } });
        // console.log("admins arr-->", adminsResp.data)
        adminsResp.data.forEach(element => {
            showgroupAdminsOnScreen(element);

        });
       

 
    //    console.log("lastMsgId==",lastMsgId)
        


    }
    catch (err) {
        // console.log('err-->', err)
        alert(err.response.data.message);
    }
});
// console.log("lastMsgId==",lastMsgId)




//other than admins:
async function showgroupMembersOnScreen(data) {
    let parent1 = document.getElementById('members');
    let child1 = `<li  id=${data.id} class="mt-1"><span class="fw-bold fst-italic">${data.name} </span><button class="btn btn-outline-primary btn-sm" onclick=makeAdmin('${data.id}') >Make Admin</button><button class=" btn btn-outline-danger btn-sm" onclick=removeUser('${data.id}')>Remove</button></li>`
    if (child1) {
        parent1.innerHTML += child1;
    }
        

};


async function showgroupAdminsOnScreen(data) {
    let parent2 = document.getElementById('admins');
    let child2 = `<li id=${data.id}>${data.name}</li>`
    if (child2) {

        parent2.innerHTML += child2;
    }

}
async function makeAdmin(userId) {
    try {
        const details = {
            userId: userId,
            groupId: groupId
        }
        
        const makeAdminResp = await axios.post('/make-admin', details, { headers: { "Authorization": token } });

        socket.emit('newAdmin',makeAdminResp.data);
        

    }
    catch (err) {
        alert(err.response.data.message);

    }

}
socket.on('newAmin-success',data=>{
    let parent5 = document.getElementById('members');
    let child5 = document.getElementById(data.id);
    parent5.removeChild(child5);
    
    showgroupAdminsOnScreen(data);

 });


async function removeUser(userId) {
    try {
        const details = {
            userId: userId,
            groupId: groupId
        }

        const removeRes = await axios.post('/remove-user', details, { headers: { "Authorization": token } });

       
        // socket.emit('remove-user',userId);
        
        //trial
        // alert(removeRes.date.message)
       
        socket.emit('remove-user',details);
        // alert(removeRes.date.message)


    }
    catch (err) {
        alert(err.response.data.message)

    }
}
//remove screen 
socket.on('remove-success',data=>{
    if(data.groupId==groupId){

        let parent3 = document.getElementById('members');
        let child3 = document.getElementById(data.userId);
        
        parent3.removeChild(child3);
        
    }
})


//post message:
document.getElementById('send').onclick = async function (e) {
    e.preventDefault();
    message= document.getElementById('textArea').value
    let fileInput = document.getElementById('fileInput')
    let fileInputValue = document.getElementById("fileInput").value;
    userId= Number(userId),
    groupId= Number(groupId) 

    if (!(fileInputValue) &&!(message)){
        document.getElementById('textArea').value="";
        return
    }else if ((!fileInputValue)&&(message.trim()===""))
    {   document.getElementById('textArea').value="";
        return
    }

    try {
        let formData = new FormData()
        formData.append('message', message);
        formData.append('file', fileInput.files[0]);
        formData.append('userId', userId);
        formData.append('groupId', groupId);
        
        document.getElementById('textArea').value="";
        document.getElementById('fileInput').value="";
        
        //console.log('message', message,'file', fileInput.files[0],'userId', userId,'groupId', groupId)
        const postResp = await axios.post('/user/message', formData, { 
            headers: { 
                'Content-Type': 'multipart/form-data',
                "Authorization": token 
            } });
            

        //socket function:==>
        socket.emit('send-message',(groupId));


        // showOnScreen(postResp.data);

    }
    catch (err) {
         console.log(err)
        //alert(err.response.data.message);
    }

}

//for user message show realtime: only new messages:
socket.on('receive', async(data)=>{
    // console.log('received from back end:-->',data==groupId);
    try{
        //message will be send to the specific gr only:
        if(groupId===data){
            const newMessages= await axios.get(`/new-messages/?groupId=${groupId}&lastMsgId=${lastMsgId}`);
            // console.log("newmessages---->",newMessages.data);
            lastMsgId=newMessages.data[newMessages.data.length-1].id; //updating last message Id
            // console.log('lastmsgId',lastMsgId);
            newMessages.data.forEach((elem)=>{
                display(elem);
            });
            
    
        }
    }
    catch(err){
        alert('something went wrong!!!')
    }

})
//main:
// function display(data){
//     if(data.id!==0){
//         let parentNode=document.getElementById('usermsg');
//         let childNode=`<li id=${data.id}  class="mt-2 text-light  bg-secondary rounded rounded-3"><span class="fw-bold">${data.senderName}:</span> <span class="fst-italic">${data.message}</span></li>`;
//         parentNode.innerHTML+=childNode;

//     }
// }

// trial:
function display(data){
    if(data.id!==0){
        let parentNode=document.querySelector('#box');
        // let parentNode2=document.querySelector('.right');
        // console.log('--0000--->',data)
        let senderName=data.senderName
        let message = data.message
        let multimedia= data.multimedia
        if(data.userId==userId){
            //--commented--
            //let childNode2=`<div class="right message" id=${data.id}><span class="fw-bold">${data.senderName}:</span> <span class="fst-italic">${data.message}</span></div>`;
            //parentNode.innerHTML+=childNode2;
            //--till here--
            if (message) {
                const messageContainer = document.createElement('div');
                messageContainer.classList.add('right', 'message');
                messageContainer.id = userId;
    
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
                multimediaContainer.id = userId;
    
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
        }else{
            // Message container
            if (message) {
                const messageContainer = document.createElement('div');
                messageContainer.classList.add('left', 'message');
                messageContainer.id = userId;
    
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
                multimediaContainer.id = userId;
    
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
}


//when new user join it reflect on screen of others realtime:
socket.on('join-success',async data=>{
    console.log("join-->",data)
    const userId=Number(data.userId);
    const groupId=Number(data.groupId);
    try{
           if(groupId==localStorage.getItem('groupId')){
               const joinedMember=await axios.get(`/joined-new-member/?userId=${userId}&groupId=${groupId}`);
               console.log('n u details-->', joinedMember.data)
               let parentN = document.getElementById('members');
               let childN = `<li id=${joinedMember.data.id}>${joinedMember.data.name} <button class="btn btn-outline-primary btn-sm" onclick=makeAdmin('${joinedMember.data.id}') >Make Admin</button><button class="ms-1 btn btn-outline-danger btn-sm" onclick=removeUser('${joinedMember.data.id}')>Remove</button></li>`
               if (childN) {
                   parentN.innerHTML += childN;
               }
       
           }
        
       }
       catch(err){
        console.log(err);
       }
       

       
});


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

  

