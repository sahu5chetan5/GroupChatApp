
const path=require('path');
exports.get404Page=(req,res,next)=>{
    res.status(404).sendFile(path.join(__dirname,'..','views','error.html'))
}