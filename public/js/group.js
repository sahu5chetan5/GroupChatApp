let socket=io();





async function createGroup(event) {
    event.preventDefault();
    try {
        
        const token = localStorage.getItem('token');

        const newGroup = {
            newGroup: document.getElementById('group').value
        }

        let resp1 = await axios.post('/add-newGroup', newGroup, { headers: { "Authorization": token } });

        // console.log("newgrp==",resp1)
        document.getElementById('group').value = "";

        socket.emit('showNewGroup',resp1.data);
      
    }
    catch (err) {
        document.getElementById('errDel').innerHTML = `<h5 class="text-center bg-danger">${err.response.data.message}<h5/>`
        setTimeout(() => {

            document.getElementById('errDel').innerHTML = ""
        }, 2000);

    }


};

//new group display realtime:
socket.on('display-success',data=>{
    console.log('group data==>',data)
    if(data.userId==localStorage.getItem('userId')){
         showGroupsOnscreen(data);

    }
    else{
        showOtherGroupsOnscreen(data);

    }
})


function showGroupsOnscreen(data) {
    let parent_node = document.getElementById('all-groups');
    let childNode = `<li id=${data.id} class="mt-3 fw-bold" >${data.nameOfGroup}<button onclick=deleteGroup('${data.id}')  class=" btn btn-outline-danger ms-4 ">Delete</button><button onclick=openGroup('${data.id}') class="btn btn-outline-primary ms-2">Enter </button></li>`
    
    parent_node.innerHTML += childNode;
};
function showOtherGroupsOnscreen(data) {
    let parent2_node = document.getElementById('other-groups');
    let child2Node = `<li id=${data.id} class="mb-3 bg-light ">${data.nameOfGroup}<button onclick=joinGroup('${data.id}')  class="btn btn-outline-success ms-4">Join</button></li>`

    parent2_node.innerHTML += child2Node;

};

window.addEventListener('DOMContentLoaded', async () => {
    try{
        authenticateLogin()
        
        const token = localStorage.getItem('token');
        const userName = await axios.get('/user-name', { headers: { "Authorization": token } });
        document.getElementById('heading').innerHTML = `Hi , ${userName.data.username} Well Come to Group Chat Application🙂 `;
        const usergroupArr = await axios.get('/user-groups', { headers: { "Authorization": token } });
        
        let userGroupArr = usergroupArr.data;
        userGroupArr.forEach(element => {
            showGroupsOnscreen(element);
        
        });
        let otherGroups = await axios.get('/other-groups', { headers: { "Authorization": token } });
        otherGroups.data.forEach((elem) => {
            showOtherGroupsOnscreen(elem);
        })

        
        // private chat
        //const  listOfUserNames = await axios.get('/list-of-users', { headers: { "Authorization": token } });
        // document.getElementById("privateChatBtn").onclick = function (e) {
        //     e.preventDefault();
        //     window.location.href = "/privateChatMsg.html";
        // };

    }
    catch(err){
        document.getElementById('errDel').innerHTML = `<h5 class="text-center bg-danger">${err.response.data.message}<h5/>`
        setTimeout(() => {

            document.getElementById('errDel').innerHTML = ""
        }, 2000);

    }

    


});
//private chat
document.getElementById("privateChatBtn").onclick = async function (e) {
    e.preventDefault();
    
    window.location.assign("/private-chat-page");
    
}

async function joinGroup(groupId) {

    const token = localStorage.getItem('token');

    try{
        const joinResp = await axios.get(`/join-group/${groupId}`, { headers: { "Authorization": token } });
        if (joinResp.status === 200) {
            let parent3 = document.getElementById('other-groups');
            let child3 = document.getElementById(groupId);
            if (child3) {
                parent3.removeChild(child3);
            }
            showGroupsOnscreen(joinResp.data.group);
            alert(joinResp.data.message);
            let userGroupData={userId:localStorage.getItem('userId'),groupId:groupId};
            
            socket.emit('join-user',userGroupData);
    
            
        }
    }
    catch(err){
        document.getElementById('errDel').innerHTML = `<h5 class="text-center bg-danger">${err.response.data.message}<h5/>`
        setTimeout(() => {

            document.getElementById('errDel').innerHTML = ""
        }, 2000);

    }

};

async function deleteGroup(groupId) {
    const token = localStorage.getItem('token');
    try {
        const groupDeletedResp = await axios.delete(`/delete-group/${groupId}`, { headers: { "Authorization": token } });
        if (groupDeletedResp.status === 200) {
            
            socket.emit('delete-group',groupId);

            alert(groupDeletedResp.data.message)
        }
        else {
            console.log('something went wrong!')
        }

    }
    catch (err) {
        // console.log(err)
        // document.getElementById('errDel').innerHTML = `<h5 class="text-center bg-danger">${err.response.data.message}<h5/>`
        // setTimeout(() => {

        //     document.getElementById('errDel').innerHTML = ""
        // }, 2000);
        alert(err.response.data.message)

    }
};
socket.on('delete-success',data=>{
  
    const c = document.getElementById(data);
    console.log('///',data)
    c.remove();
});




//open groupWindow:-->
async function openGroup(grId){
    localStorage.setItem('groupId',grId);
    console.log("save to local storage!");
    
    window.location.href=`/group-messages`
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
        console.log(decoded,'decoded frontend')
        if (decoded.isloggedin===false){
        alert('You are logged out');
            window.location.assign("/login");
            }

}

  

