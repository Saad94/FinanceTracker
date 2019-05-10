import * as path from 'path';
import dataRoutes from './routes/DataRoutes';

require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

const imgDir = (path.join(__dirname, '../../../public/img'));
app.use('/img', express.static(imgDir));
app.use('/api', dataRoutes);

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
