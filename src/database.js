const mongoose     = require('mongoose');

//connect to mongoDB
const conecta = async() => {
    try 
    {
        const con = await mongoose.connect("mongodb://localhost/notes"); //connect to mongodb
        console.log("db is connected");
    } 
    catch (error) 
    {
        console.log(error);
    }
}

module.exports = conecta;