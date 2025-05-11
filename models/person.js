/** modulo mongo */
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDb')
  })
  .catch(error => {
    console.log('Error connecting to MongoDb', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // campo requerido
    minLength: 5,
  },
  number: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d+$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number! Must be in the format XX-XXXX... or XXX-XXXX...`
    }
  }
})
/** Transformar la data que quiero que sea devuelta en json */
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString() // es clave esta conversion para el futuro!
    delete returnedObject._id // no quiero el id
    delete returnedObject.__v // no quiero el cambo __v
  }
})

module.exports = mongoose.model('Person', personSchema)

