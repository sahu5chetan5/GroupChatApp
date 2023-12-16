const path=require('path');
const Group=require('../models/group');
const User_Group=require('../models/usergroup');
const User=require('../models/user');

const {Op} = require('sequelize');


function invalidInput(input) {
    if (input === undefined || input.length === 0) {
         return true;
    }
    else {
         return false;
    }
}
exports.joinedNewmember=async(req,res,next)=>{
    try{

        const {groupId,userId}=req.query;

        const newUser=await User.findByPk(userId);
        res.status(200).json(newUser);
    }
    catch(err){
        console.log(err);
    }

}

exports.getGroupPage=(req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','views','group.html'));
}
exports.getuserName=(req,res,next)=>{
    res.status(200).json({username:req.user.name})
}


exports.createNewGroup= async (req,res,next)=>{
    try{
        const {newGroup}=req.body;
        if(invalidInput(newGroup)){
            return res.status(400).json({ message: 'input can not be empty or undefined' });

        }
    
        const userNewGroup= await req.user.createGroup({nameOfGroup:newGroup},{through: {isAdmin : true}});
        // console.log("===>",userNewGroup);
    
        return res.status(201).json({ nameOfGroup: userNewGroup.nameOfGroup ,id:userNewGroup.id,userId:req.user.id});
    }
    catch(err){
        return res.status(500).json({success : false, message: 'Something went wrong !'});
    }


};

exports.userAllGroups=async (req,res,next)=>{
try{

    const arrayOfGroups = await req.user.getGroups({
        attributes : ["id" , "nameOfGroup"]
    });
    res.status(200).json(arrayOfGroups);
}
catch(err){
    res.status(500).json({message:'Something Went Wrong !'});


}

};

//not admin
exports.getOtherMembers=async(req,res,next)=>{
    try{
        const {groupId}=req.params;
       
        //where members are not admin:
        const membersOfCurrGroup=await User_Group.findAll({where:{groupId:groupId,isAdmin:false}});
        // console.log("group members with same groupId",membersOfCurrGroup);
        const userIdsArr=[];
        membersOfCurrGroup.forEach((elem)=>{
            userIdsArr.push(elem.userId);
        });
        // res.status(200).json(membersOfCurrGroup);

        const memberDetails=await User.findAll({
            where:{
                id:userIdsArr
            },
            attributes:['id','name']
        });
        res.status(200).json(memberDetails);
        // console.log('useridar-->',userIdsArr)


    }
    catch(err){
        // console.log("err-->",err)
        res.status(500).json({message:'Something Went Wrong !'});
    }


};


exports.getAdmins=async (req,res,next)=>{
    try{
        const {Id}=req.params;//requesing with group id from front-end
        // console.log("id--",Id);
        const admin=await  User_Group.findAll({where:{groupId:Id,isAdmin:true}});
        const admiIdArr=[];
        admin.forEach((elem)=>{
            admiIdArr.push(elem.userId);
        });

        const adminDetails=await User.findAll({
            where:{
                id:admiIdArr
            },
            attributes:['id','name']
        });
        res.status(200).json(adminDetails);


    }
    catch(err){
        // console.log("err==>>",err);
        res.status(500).json({message:'Something Went Wrong !'});
    }


}

//user is not part of :
exports.otherGroups=async(req,res,next)=>{
    try{

        const userGroup=await req.user.getGroups();
        let groupIds=[];//storing group ids(user is part of)
        userGroup.forEach(element => {
            groupIds.push(element.id)
            
        });    
        const otherGroups=await Group.findAll({
            where:{
                id:{
                    [Op.notIn]:groupIds
                }
            }
    
    
        });
        res.status(200).json(otherGroups);
    }
    catch(err){
        // console.log("err--->",err)
    res.status(500).json({message:'Something Went Wrong !'});

    }


};

//when user join a new group:
exports.joinGroup=async(req,res,next)=>{
    try{

        const groupid=req.params.Id;
    
        const userGroupUpdate=await User_Group.create({
            userId:req.user.id,
            groupId:groupid,
            isAdmin:false
        });
        const group=await Group.findByPk(groupid);
        res.status(200).json({message:'joined Successful',group:group});
    }
    catch(err){
    res.status(500).json({message:'Something Went Wrong !'});

    }
};

exports.makeUserAdmin=async(req,res,next)=>{
    try{
        const {userId,groupId}=req.body;

        // console.log("***",userId,groupId);
       
        //user who will be admin:
        const updateAsGroupAdmin=await User_Group.findOne({where:{
            userId:userId,
            groupId:groupId

        }

        });
          //checking requested user admin or not:
        const isAdmincurrentUser=await User_Group.findOne({where : {groupId: groupId, userId : req.user.id , isAdmin: true}});
        if(!isAdmincurrentUser){
            res.status(404).json({message:'Only admin has this functionality'});
        }
        else if(isAdmincurrentUser){

            const updation=await updateAsGroupAdmin.update({
                isAdmin:true
            });
            const adminUser=await User.findOne({where:{id:userId}});
            res.status(201).json(adminUser);
        }


    }
    catch(err){
        res.status(500).json({message:'Something Went wrong!'});

    }
}
exports.removeUser=async (req,res,next)=>{
    try{
        const {userId,groupId}=req.body;

        //who is reqesting:
        const isAdmincurrentUser=await User_Group.findOne({where : {groupId: groupId, userId : req.user.id , isAdmin: true}});
   
       if(isAdmincurrentUser || (userId==req.user.id)){

            const removeUser=await User_Group.destroy({where:{
                userId:userId,
                groupId:groupId
            }});
    
            res.status(200).json({message:'User has been removed from this group successfully!! '})
        }
        else{
            res.status(404).json({message:'Only admins and this user has this functionality'});
        }


    }
    catch(err){
        res.status(500).json({message:'Something Went wrong!'});

    }
}

exports.deleteGroupByAdmin=async(req,res,next)=>{
    try{
        const {groupId}=req.params;
        const isAdminMember = await User_Group.findOne({where : {groupId: groupId, userId : req.user.id , isAdmin: true}});

        if(!isAdminMember){
            return res.status(400).json({success : false ,message : `Only Admin can delete group !`});
        }
       else if(isAdminMember){
            const group = await Group.destroy({where : { id : groupId}});
            return res.status(200).json({success : true ,message : `Group has deleted sucessfully`});
        }
    }
    catch(err){
      
        return res.status(500).json({success: false, message : `Something went wrong !`});
    }
};


