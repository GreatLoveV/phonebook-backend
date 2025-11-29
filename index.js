const express = require('express');
const morgan = require('morgan')

const app = express();

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
    { 
        "id": "1",
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": "2",
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": "3",
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": "4",
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
];


app.get('/', (req, res) => {
    res.send(`
        <h1>Welcome to your phonebook</h1>
        <p1>/api/notes on the same port to see all your contacts</p1>s
        `);
});

app.get('/api/persons', (req, res)=>{
    res.json(persons);
});

app.get('/api/info', (req, res)=>{
    const timeStamp = new Date;
    res.send(`
        <p>phonebook has info for ${persons.length}</p>
        <p>${timeStamp.toString()}</>
        `)


    res.send();
});

app.get('/api/persons/:id', (req, res)=>{
    const id = req.params.id
    const person = persons.find(p => p.id === id)

    if (person){
        res.json(person)
    }else{
        res.status(404).end('not found')
    }

})

app.delete('/api/persons/:id', (req, res)=>{
    const id = req.params.id ;
    persons = persons.filter(p => p.id !== id )
    res.status(204).end()
})
const generateId = ()=>{
    const newId = Math.floor(Math.random()* 10000)
    return newId
}
app.post('/api/persons/', (req,res)=>{
    const body = req.body;
    const existingContact = persons.find(p => p.name === body.name);
    if(!body.name || !body.number){
        return res.status(400).json({
            error: 'both name or number is missing'
        })
    }
    if(existingContact){
        return res.status(400).json({
            error: 'name must be unique'
        })
    }
    const person =  {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons.concat(person)
    res.json(person)
})

const PORT = 3001;
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
});
