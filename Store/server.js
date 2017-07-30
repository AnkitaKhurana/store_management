const express = require('express');

const app = express();
app.use('/api', require('./routes/api'));
app.get('/', (req, res) => {
    res.send('Hello World')
});

app.listen(2345, function () {
    console.log("Server started on http://localhost:2345");
});