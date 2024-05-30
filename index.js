require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/note.js')

/*
let notes = [
  {
    id: 1,
    content: "HTML is easy very very easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  },
  {
    id: 4,
    content: "Another note more",
    important: true
  }
]*/

app.use(express.json())
app.use(cors())

const generateId = () => {
  const maxId = notes.length > 0
  ? Math.max(...notes.map(n => n.id))
  : 0

return maxId + 1
}

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:', request.path)
  console.log('Body:', request.body)
  console.log('-----------')
  next()
}
app.use(requestLogger)

app.use(express.static('dist'))

app.get('/', (request, response) => {
  response.send('<h2>Hola po rorri</h2>')
})

app.get('/api/notes', (request,response)=>{
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request,response)=>{
  Note.findById(request.params.id)
  .then(note => {
    if(note){
      response.json(note)
    }else{
      response.status(404).send('id not valid')
    }
  })
  .catch(error => {
    console.log(error)
    response.status(500).send({error: 'malformated id'})
  })
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(202).end()

})

app.post('/api/notes', (request, response)=>{
  const body = request.body
  if(body.content === undefined ){
    return response.status(400).json({
      error: 'content missing'
    })
  }
  const note = new Note({
    content: body.content,
    important: body.important || false,
  })
 
  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

const unknowendpoint = (request, response) => {
  response.status(404).send({
    error: 'unknow endpoint'
  })
}
app.use(unknowendpoint)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
