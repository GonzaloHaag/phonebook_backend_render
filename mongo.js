/** ARCHIVO DE PRUEBA */
// const mongoose = require('mongoose');

// if (process.argv.length < 3) {
//     // si no viene la contraseña
//     console.log('give password as argument')
//     process.exit(1)
// }

// const password = process.argv[2]; // viene por terminal cuando corro node mongo.js yourPassword
// const url = `mongodb+srv://fullstack:${password}@cursomongodb.qbsz8.mongodb.net/personsApp?retryWrites=true&w=majority&appName=CursoMongoDB`;

// mongoose.set('strictQuery', false)
// mongoose.connect(url)

// const personSchema = new mongoose.Schema({
//     name: String,
//     number: String,
// })

// const Person = mongoose.model('Person', personSchema);

// if (process.argv.length === 3) {
// Significa que solo vino la contraseña al correr el programa
//     Person.find({}).then((result) => {
//         result.forEach(person => {
//             console.log(person.name + ' ' + person.number)
//         });

//         mongoose.connection.close()
//     });
// } else {
//     const namePerson = process.argv[3];
//     const numberPerson = process.argv[4];
//     const person = new Person({
//         name: namePerson,
//         number: numberPerson
//     });
//     person.save().then(result => {
//         console.log(`Added ${result.name} number ${result.number} to phonebook`)
//         mongoose.connection.close()
//     });

// }



