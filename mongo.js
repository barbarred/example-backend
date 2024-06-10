const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://useradmin:${password}@part3dbclass.qqbslfl.mongodb.net/testNoteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  _id: String,
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note(
  {
    _id: '1',
    content: 'HTML is easy',
    important: true,
  },
  {
    _id: '2',
    content: 'Browser can execute only JavaScript',
    important: true,    
  }
)

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})