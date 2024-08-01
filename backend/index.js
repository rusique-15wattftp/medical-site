require('dotenv').config()
const express = require('express')
const cors = require('cors')

const patientsRouter = require('./routes/patients')
const doctorsRouter = require('./routes/doctors')
const usersRouter = require('./routes/users')

const returnStatus = require('./helpers/returnStatus')

const app = express()

app.use(express.json())

app.use(cors())

app.use('/patients', patientsRouter)
app.use('/doctors', doctorsRouter)
app.use('/users', usersRouter)

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.use((req, res, next) => {
    return returnStatus(res, 404, true, 'Not found')
})

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
