import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';


const port = 3333;
const app = express();


app.use(cors(), bodyParser.urlencoded({ extended: true }), bodyParser.json());
app.use(express.static('/public'));
app.listen(port);

app.get('/', (req, res) => {
  res.send('Static will be here');
});
