const token = localStorage.getItem("token")
    console.log("we are in logout")
    console.log(token)
    axios.get("/logout",{headers: {"Authorization": token}})
            .then((response) => {
                
                localStorage.setItem('token',response.data.token)
                window.location.assign("/login");
            })
            .catch((err)=>{
                console.log(err)
            })


    