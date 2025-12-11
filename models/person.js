const mongoose = require('mongoose');

const url = process.env.MONGODB_URI

mongoose.connect(url, {family: 4});

const personSchema = mongoose.Schema({
    name:{
        type:String,
        minlength: 3,
        required: true
    },
    number:{
        type:String,
        required:true,
        validate:{
            validator: function(v){
                if (v<8) return false;
                return /^[0-9]{2,3}-[0-9]+$/.test(v)
            },
            message: props => `${props.value} is not a valid phone number!`
        }
        
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

