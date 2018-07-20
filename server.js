const express = require('express');
const {createServer} = require('http');

const app = express();

const normalizePort = port => parseInt(port, 10);
const PORT = normalizePort(process.env.PORT || 5000);


app.use(express.static('public'));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});
















const server = createServer(app);

server.listen (PORT, err => {
  if(err) throw err;
  console.log('Server started!');
});
