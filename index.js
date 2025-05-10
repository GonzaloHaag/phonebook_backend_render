const express = require('express');
const app = express();

const morgan = require('morgan');
const cors = require('cors')

app.use(express.json()); // para recibir las solicitudes del body 
app.use(cors()); // Evitar errores de cors entre el frontend y back
app.use(express.static('dist')) // servir archivos estaticos
morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

/** Middleware para saber que peticion viene */
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
// uso del middleware
app.use(requestLogger)
let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
];

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);

    const person = persons.find((p) => p.id === id);

    if (!person) {
        return response.status(400).json({ error: 'Person not found' })
    }

    response.json(person)
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const deletedPerson = persons.find((p) => p.id === id); // primero la encuentro
    if (!deletedPerson) {
        return response.status(404).json({ error: 'Person not found' });
    }

    persons = persons.filter((p) => p.id !== id);
    response.status(200).json(deletedPerson); // devuelvo la persona eliminada
});

app.post('/api/persons', (request, response) => {
    const body = request.body; // aca llegaria la persona 

    if (!body.name) {
        return response.status(400).json({ error: 'Name missing' })
    }
    if (!body.number) {
        return response.status(400).json({ error: 'Number missing' })
    }
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }
    const personFind = persons.find((p) => p.name === person.name);
    if (personFind) {
        return response.status(400).json({ error: 'name must be unique' })
    }
    persons.push(person);

    response.json(person); // persona creada
})

app.get('/info', (request, response) => {
    const personsLenght = persons.length;
    const now = new Date();
    response.send(
        `
        <h4>Phonebook has info for ${personsLenght} people</h4>
        <p>${now.toString()}</p>
        `
    )
});

/** Responder para rutas que no existen */
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`SERVER RUNNING IN ${PORT}`)
})