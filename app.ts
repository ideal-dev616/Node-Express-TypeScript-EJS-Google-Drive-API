import { GoogleDriveService } from './src/gdrive-api';
const express = require('express');
const app = express();

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

app.listen(9000, () => console.info("Server is running..."));