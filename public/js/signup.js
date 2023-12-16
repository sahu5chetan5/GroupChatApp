
      async function postDetails(event){
        event.preventDefault();
        try{
          const userDetails={
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            password: document.getElementById('password').value
          }
          const postResponse=await axios.post('/post-user-details',userDetails);
          // console.log("postres-->",postResponse.status)
          if(postResponse.status===201){
            alert(`${postResponse.data.message}`);
            window.location.href='/login';
          
          }
        
          
        }
        catch(err){
          console.log("err-->",err);
          document.getElementById('errormsg').innerHTML+=`<h5 class="text-center bg-danger mt-3">${err.response.data.message}</h5>`
          setTimeout(()=>{
           
            document.getElementById('errormsg').innerHTML="";
          },3000)


          

        }


      }

