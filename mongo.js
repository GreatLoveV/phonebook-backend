const mongoose = require('mongoose')

if (process.argv.length <3){
  console.log('no password given')
  process.exit()
}
const name = process.argv[3]
const number = process.argv[4]
const password = encodeURIComponent(process.argv[2])

const url = `mongodb+srv://sleuthInk531090:${password}@cluster0.ysghu4p.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.connect(url, { family: 4 })

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
})

const Person = mongoose.model('Person', personSchema)


const person = new Person({
  name: name,
  number: number,
  date: new Date()
})
if (person.name && person.number){
  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}else{
  Person
    .find({})
    .then(persons => {
      console.log('phonebook')
      persons.forEach(person => {
        console.log(person.name, person.number)
      }
      )
      mongoose.connection.close()
    })
}
