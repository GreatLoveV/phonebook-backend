const mongoose = require('mongoose');

const url = process.env.MONGODB_URI

mongoose.connect(url, {family: 4});

const personSchema = mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    number:{
        type:String,
        required:true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) =>{
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema);

