// database connection
const mongoose=require("mongoose");
const connect= mongoose.connect("mongodb://localhost:27017/admin");

//checking if db connected or not
connect.then(()=>{
    console.log("db connection successfull");
})
.catch(()=>{
    console.log("error in connecting");
});

// create a schema
const LoginSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

//Collection part
const collection= new mongoose.model("users",LoginSchema);

//exporting the model
module.exports=collection;
