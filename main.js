// load libraries
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { Timestamp, MongoClient} = require('mongodb')
const multer = require('multer')

// declare global variables
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000
const MONGO_URL = 'mongodb://localhost:27017'
const MONGO_USER = process.env.MONGO_USER
const MONGO_PASS = process.env.MONGO_PASS
const MONGO_DB = 'temperature'
const MONGO_COLLECTION = 'data'

const mkTemperature = (params) => {
    return {
        ts: Timestamp.fromNumber((new Date()).getTime()),
        user: params.userName,
        q1: params.q1,
        q2: params.q2, 
        temperature: params.temperature
    }
}

// declare mongo
const mongo = new MongoClient(MONGO_URL,
    {
        useNewUrlParser: true, useUnifiedTopology: true
    }
)

// create an instance of express / multer
const app = express()
const upload = multer()

// log request with morgan
app.use(morgan('combined'))

// use cors headers
app.use(cors())

// POST /temperature
app.post('/temperature', upload.none(), (req, resp) => {
    const data = JSON.parse(req.body.data)
    const doc = mkTemperature(data)
    console.info(doc)
    // TODO insert doc into mongo
    
    mongo.db(MONGO_DB).collection(MONGO_COLLECTION).insertOne(doc)
    resp.status(200)
    resp.type('application/json')
    resp.send({})
})

const startMongo = () => {
    try {
        return mongo.connect()
        .then (() => {
            return Promise.resolve()
        })
    } catch (e) {
        return Promise.reject(e)
    }
}

Promise.all([startMongo()])
.then (() => {
    app.listen(PORT, () => {
        console.info(`Application is listening PORT ${PORT} at ${new Date()}`)
    })
}).catch (e => {
    console.info("Error starting server: ",  e)
})


