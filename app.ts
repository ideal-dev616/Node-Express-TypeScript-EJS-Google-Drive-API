import { GoogleDriveService } from './src/gdrive-api';
const express = require('express');
const app = express();

// var sass = require('node-sass-middleware');

// app.use(
//     sass({
//         src: __dirname + '/scss', //where the sass files are 
//         dest: __dirname + '/public', //where css should go
//         debug: true // obvious
//     })
// );

app.set('view engine','ejs');

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.get('/api/getfiles', async (req, res, next) => {
    const files = await new GoogleDriveService().searchFolder();
    res.json(files);
})

app.use('/static', express.static('static'));
app.use('/scss', express.static('scss'));

app.listen(3001, () => console.info("Server is hosting *.3001"));