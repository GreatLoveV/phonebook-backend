const express = require('express');

const app = express();

app.use(express.json());

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


app.get('/', (request, response) => {
    response.send(`
        <h1>Welcome to your phonebook</h1>
        <p1>/api/notes on the same port to see all your contacts</p1>s
        `);
});

app.get('/api/persons', (request, response)=>{
    response.json(persons);
});

app.get('/api/info', (request, response)=>{
    const timeStamp = new Date;
    response.send(`
        <p>phonebook has info for ${persons.length}</p>
        <p>${timeStamp.toString()}</>
        `)


    response.send();
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

const PORT = 3001;
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
});
