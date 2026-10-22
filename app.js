import express from 'express';
import userRouter from './routes/user.route.js';
import bookRouter from './routes/book.route.js';

const app = express();
const port = 5000;

app.use(express.json());

app.use('/users', userRouter);
app.use('/books', bookRouter);

app.listen(port, () => {
  console.log(`app listening on http://localhost:${port}`);
});

