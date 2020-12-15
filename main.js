// load libraries
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { Timestamp, MongoClient} = require('mongodb')
const multer = require('multer')
const fs = require('fs')
const aws = require('aws-sdk')
const { S3 } = require('aws-sdk')
const { resolve } = require('path')

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

const ENDPOINT = new aws.Endpoint(`fra1.digitaloceanspaces.com`)
const s3 = new S3({
    endpoint: ENDPOINT,
    accessKeyId: process.env.DIGITALOCEAN_ACCESS_KEY,
    secretAccessKey: process.env.DIGITALOCEAN_SECRET_ACCESS_KEY
})

// create an instance of express / multer
const app = express()
// const upload = multer()
const upload = multer({dest:`${__dirname}/uploads`})

// log request with morgan
app.use(morgan('combined'))

// use cors headers
app.use(cors())

// POST /temperature
app.post('/temperature', upload.single('image_file'), async (req, resp) => {
    // const data = JSON.parse(req.body.data)
    // const doc = mkTemperature(data)
    // console.info(doc)
    try {
        console.info(req.body)
        const KEY = req.file.filename + '_' + req.file.originalname;
        const imageBuffer = await myReadFile(req.body.data.file.path)
        // const results = await uploadToS3(KEY, imageBuffer, req)
        console.info(results)
        console.info(req.file.filename)
        // TODO insert doc into mongo
        
        // mongo.db(MONGO_DB).collection(MONGO_COLLECTION).insertOne(doc)
        resp.status(200)
        resp.type('application/json')
        resp.send({key:KEY})
    } catch (e) {
        console.info("Error posting temperature: ", e)
    }
})

// method
const myReadFile = (file) => new Promise((resolve, reject) => {
    fs.readFile(file, (err, buffer) => {
        if (err == null) {
            resolve(buffer)
        } else {
            reject("<At myReadfile Function> ", err)
        }
    })
}) 

const uploadToS3 = (KEY, buffer, req) => new Promise((resolve, reject) => {
    const params = {
        Bucket: 'yeebinrong',
        Key: KEY,
        Body: buffer,
        ACL: 'public-read',
        ContentType: req.file.mimetype,
        ContentLength: req.file.size,
        Metadata: {
            originalName: req.file.originalname,
            createdTime: '' + (new Date()).getTime(),
        }
    }
    s3.putObject(params, (err, result) => {
        fs.unlink(req.file.path, () => {
            if (err == null) {
                resolve(result)
            } else {
                reject("<At uploadToS3 Function> ", err)
            }
        })
    })
})

const startMongo = () => {
    try {
        return mongo.connect()
        .then (() => {
            return Promise.resolve()
        })
    } catch (e) {
        return Promise.reject("<At Mongo> ", e)
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


