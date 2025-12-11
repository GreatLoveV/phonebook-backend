require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const Person = require('./models/person');

const app = express();
app.use(express.static('dist'));
app.use(express.json());

morgan.token('body', (req)=>{
    if (req.method ===  'POST'){
        return JSON.stringify(req.body)
    }
    return ''
})

app.use(morgan((tokens, req, res)=>{
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res),'ms',
        tokens.body(req,res)
    ].join(' ')
}));

let persons = [
    // { 
    //     "id": "1",
    //     "name": "Arto Hellas", 
    //     "number": "040-123456"
    // },
    // { 
    //     "id": "2",
    //     "name": "Ada Lovelace", 
    //     "number": "39-44-5323523"
    // },
    // { 
    //     "id": "3",
    //     "name": "Dan Abramov", 
    //     "number": "12-43-234345"
    // },
    // { 
    //     "id": "4",
    //     "name": "Mary Poppendieck", 
    //     "number": "39-23-6423122"
    // }
];


app.get('/', (req, res) => {
    res.send(`
        <h1>Welcome to your phonebook</h1>
        <p1>/api/notes on the same port to see all your contacts</p1>
        `);
});

app.get('/api/persons', (req, res)=>{
    Person.find({}).then(persons =>{
        res.json(persons)
    })
});

app.get('/api/info', (req, res)=>{
    const timeStamp = new Date;
    Person.find({}).then(people=>{
        const peopleLength = people.length
        res.send(`
        <p>phonebook has info for ${peopleLength}</p>
        <p>${timeStamp.toString()}</p>
        `)
    }).catch(error => {
        res.status(500).send({error: 'Error fetching data'})
    })

});

app.get('/api/persons/:id', (req, res, next)=>{
    Person.findById(req.params.id).then(person=>{
        res.json(person)
    })
        .catch(error => next(error))
    
})

app.delete('/api/persons/:id', (req, res, next)=>{
    Person.findByIdAndDelete(req.params.id)
        .then(result => res.json(result))
        .catch(error => next(error))
})

// const generateId = ()=>{
//     const newId = Math.floor(Math.random()* 10000)
//     return newId
// }

app.put('/api/persons/:id' , (req, res, next) =>{
    const {name, number} = req.body

    Person.findById(req.params.id)
        .then(person => {
            if (!person){
                return res.status(404).end()
            }
            
            person.name = name
            person.number = number

            return person.save().then(updatedPerson=>{
                res.json(updatedPerson)
            })
        })
        .catch(error => next(error))
})


app.post('/api/persons/', (req,res,next)=>{
    const body = req.body;

    const person = new Person({
        name: body.name,
        number:body.number
    })

    person.save().then(savedPerson=>{
        res.json(savedPerson)
    })
        .catch(error => next(error))
})

const unknownEndpoint = (req, res) =>{
    res.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)


const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError'){
        return res.status(400).send({error: "malformatted id"})    
    } 
    
    if (error.name === 'ValidationError'){
        const firstError = Object.values(error.errors)[0].message;
        return res.status(400).json({error: firstError})
    }

    return next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT;
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
});
