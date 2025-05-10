require('dotenv').config(); // Para usar .env
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

const Person = require('./models/person.js')

app.use(express.json()); // para recibir las solicitudes del body 
app.use(cors()); // Evitar errores de cors entre el frontend y back
app.use(express.static('dist')) // servir archivos estaticos
morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

/** Middleware para saber informacion de la peticion que viene */
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
// uso del middleware
app.use(requestLogger);

app.get('/api/persons', (request, response) => {
    // mongo db
    Person.find({}).then(persons => {
        response.json(persons);
    });
});

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id;
    
    Person.findById(id).then(person => {
        if(person) {
            response.json(person)
        } else {
            response.status(404).end(); // Retorno un not found
        }
    })
    // Middleware de manejo de errores, porque le paso un argumento al next
    .catch(error => next(error))
});

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id;
    Person.findByIdAndDelete(id).then(result => {
       response.status(204).end()
    })
    .catch(error => next(error))
});

app.post('/api/persons', (request, response,next) => {
    const body = request.body; // aca llegaria la persona 

    if (!body.name) {
        return response.status(400).json({ error: 'Name missing' })
    }
    if (!body.number) {
        return response.status(400).json({ error: 'Number missing' })
    }
    const person = new Person({ // usamos el schema
        name: body.name,
        number: body.number
    });
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error)); //Que lo capture el middleware

});

app.put('/api/persons/:id',(request,response,next) => {
    const { name,number } = request.body; // llega la persona

    Person.findByIdAndUpdate(
        request.params.id,
        { name, number },
        { new: true, runValidators:true, context: 'query' }) // el new true da el documento modificado, validators para que sea validado
    .then(updatedPerson => {
        response.json( updatedPerson )
    })
    .catch(error => next(error))
})

// app.get('/info', (request, response) => {
//     const personsLenght = persons.length;
//     const now = new Date();
//     response.send(
//         `
//         <h4>Phonebook has info for ${personsLenght} people</h4>
//         <p>${now.toString()}</p>
//         `
//     )
// });

/** Responder para rutas que no existen */
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

/** Aca llega el next(error) */
const errorHandler = (error, request, response, next) => {
    // captura el error
    console.error(error.message)
  
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
      } else if (error.name === 'ValidationError') {
        /** Errores de validacion de tipos */
        return response.status(400).json({ error: error.message })
      }
  
    next(error)
  }
  
  // este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!
  app.use(errorHandler)


const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`SERVER RUNNING IN ${PORT}`)
})