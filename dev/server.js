const express = require('express');
const session = require('express-session');
const renderVM = require('./vm');
const path = require('path');
const fs = require('fs')
const request = require('request-promise')

const app = express();

// Register an express middleware. Learn more: http://expressjs.com/en/guide/using-middleware.html.
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }),
);

// Define a route to render our initial HTML.
app.get('/', (req, res) => {
  if (!req.session.visitCount) {
    req.session.visitCount = 0;
  }

  req.session.visitCount++;

  const html = renderVM({
    visitCount: req.session.visitCount,
  });

  res.send(html);
});

app.get('/worker.js', async (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../src/worker.js'))
})

app.get('/RendererModel.js', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../assets/RendererModel.js'))
})

app.get('/app.css', (req, res) => {
  res.contentType('bla');
  res.sendFile(__dirname + '/../assets/app.css')
})

app.get('/siteStructure', (req, res) => {
  const body = fs.readFileSync(__dirname + '/../assets/siteStructure.json')
  res.send(JSON.parse(body))
})

app.get('/wixCode', (req, res) => {
  const body = fs.readFileSync(__dirname + '/../assets/wixCode.js')
  res.send(body)
})

// Launch the server
app.listen(process.env.PORT, () => {
  console.info(`Fake server is running on port ${process.env.PORT}`);
});
