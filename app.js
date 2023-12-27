const path=require('path');
const express=require('express');
const cors=require('cors');
const bodyParser=require('body-parser');
const sequelize=require('./util/database');

//models:
const User=require('./models/user');
const Message=require('./models/chatbox');
const Group=require('./models/group');
const User_Group=require('./models/usergroup');
const privateMessage = require('./models/privateChatbox');

//routes:
const userRoute=require('./routes/user');
const chatRoute=require('./routes/chatbox');
const groupRoute=require('./routes/group');
const privateChatRoute = require('./routes/privateChat')
//controller:
const errorController=require('./controllers/error')



const app=express();
const server=require('http').createServer(app);
const io=require('socket.io')(server);

io.on('connection',socket=>{
    socket.on('join-room', userId => {
        socket.join(userId);
    });
    socket.on('send-private-message', async (receiverId, senderId) => {
        try {
            
            // Process and save the message if needed
            
            // Emit the message to the receiver's room
            io.to(receiverId).emit('receive-private-message', receiverId, senderId);
            
            // Emit the message to the sender's room
            io.to(senderId).emit('receive-private-message', receiverId, senderId);
        } catch (err) {
            console.error(err);
        }
    });


    // socket.on('send-private-message',(receiverId,senderId)=>{
    //     // console.log("socket::",data);
    //     io.emit('receive-private-message',receiverId,senderId);
    // })

    socket.on('send-message',(data)=>{
        // console.log("socket::",data);
        io.emit('receive',data);
    })

    socket.on('remove-user',data=>{

        io.emit('remove-success',data);
    });

    socket.on('join-user',data=>{
        io.emit('join-success',data)

    })

    socket.on('showNewGroup',data=>{
        io.emit('display-success',data)

    });
    socket.on('newAdmin',data=>{
        io.emit('newAmin-success',data);
    });

    socket.on('delete-group',data=>{
        io.emit('delete-success',data)
    });
});

app.use(bodyParser.json({extended:false}));
app.use(express.static(path.join(__dirname,'public')));
app.use(cors());

//main middlewares:
app.use(userRoute);
app.use(groupRoute);
app.use(chatRoute);
app.use(privateChatRoute);
app.use(errorController.get404Page);

// table joins for private Chat:
User.hasMany(privateMessage, { foreignKey: 'senderId', as: 'Sender' });
privateMessage.belongsTo(User, { foreignKey: 'senderId', as: 'Sender' });

User.hasMany(privateMessage, { foreignKey: 'receiverId', as: 'Receiver' });
privateMessage.belongsTo(User, { foreignKey: 'receiverId', as: 'Receiver' });


// table joins for group Chat:
User.hasMany(Message);
Message.belongsTo(User);


User.belongsToMany(Group,{through:User_Group});
Group.belongsToMany(User,{through:User_Group});


Group.hasMany(Message);
Message.belongsTo(Group);




// sequelize
//     // .sync({force:true})
//     .sync()  
//     .then(() => {
//         app.listen(8000);
//     })
//     .catch(err=>{
//         console.log(err)
//     })



sequelize.sync()
server.listen(8000)



