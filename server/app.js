import express from 'express';
import userRouter from './Router/user.route.js';
import bookRouter from './Router/book.route.js';
import cors from 'cors';
import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';


const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use((req, res, next) => {
req.currentDate = new Date();
next();
});
app.use((req, res, next) => {
  if(req.method==='GET') {
    console.log(req.currentDate);}
next();
});
app.use('/users', userRouter);
app.use('/books', bookRouter);
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`app listening on http://localhost:${port}`);
});


