import mongoose from 'mongoose'

const connection = mongoose.connect('mongodb://localhost:27017/email_sender').then(()=>{
    console.log('connected to db!');
    
}).catch((e)=>{
    console.log(e);
    
})

export default connection