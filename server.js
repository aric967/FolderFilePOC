const express = require('express')
const companion = require('./node_modules/@uppy/companion');
const bodyParser = require('body-parser')
const session = require('express-session')
const path = require('path');

const app = express()
app.use(express.static('dist'));
app.use(bodyParser.json())
app.use(session({
  secret: 'some-secret',
  resave: true,
  saveUninitialized: true
}))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Authorization, Origin, Content-Type, Accept'
  )
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  next()
})

// Routes
app.get('/', (req, res) => {
  /* res.setHeader('Content-Type', 'text/plain')
  res.send('Welcome to Companion') */
  console.log(path.resolve(__dirname, './dist/index.html'));
  res.sendFile(path.resolve(__dirname, './dist/index.html'));
})

// initialize uppy
const uppyOptions = {
  providerOptions: {
    google: {
      key: '981023211668-39afjftden4grotulm205emc3ttv0aat.apps.googleusercontent.com',
      secret: 'nsslOVltSlI0FvTvkdH8UiG6'
    },
    dropbox: {
      key: 'g64muqlxftj40ja',
      secret: 'td9i548c4uhr41n'
    }
    // you can also add options for dropbox here
  },
  server: {
    host: 'localhost:8080',
    protocol: 'http'
  },
  filePath: './output',
  secret: 'some-secret',
  debug: true
}

app.use(companion.app(uppyOptions))

// handle 404
app.use((req, res, next) => {
  return res.status(404).json({ message: 'Not Found' })
})

// handle server errors
app.use((err, req, res, next) => {
  console.error('\x1b[31m', err.stack, '\x1b[0m')
  res.status(err.status || 500).json({ message: err.message, error: err })
})

companion.socket(app.listen(8080), uppyOptions)

console.log('Welcome to Companion!')
console.log(`Listening on http://0.0.0.0:${8080}`)
