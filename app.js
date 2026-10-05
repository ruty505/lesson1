import express from 'express';
import { books } from './db.js';

const app = express();
const port = 5000;
app.use(express.json());

app.all('/',(req,res)=>
{ res.status(200).send("עבר בהצלחה");
});

//קבלת כל הספרים
app.get('/books',(req,res)=>{
    //מגדיר ערכי ברירת מחדל למקרה שלא יהיה פרמטרים
    const page = +req.query.page || 1;
  const limit = +req.query.limit || 5;
  //למקרה שיש פרמטרים נחלצם
  const name = req.query.name;
  const category = req.query.category;
  let resultBooks = books;
  //חיפוש לפי שם ספר או קטגוריה
  if (name) {
    resultBooks = resultBooks.filter(b => b.name === name);
  }
  
  if (category) {
    resultBooks = resultBooks.filter(b => b.category === category);
  }
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;  
//חיתןך המערך
  const paginatedBooks = resultBooks.slice(startIndex, endIndex);
 res.status(200).json (paginatedBooks);
});

//קבלת ספר לפי קוד
app.get('/books/:id', (req,res)=>{
const id =+ req.params.id 
const book= books.find(b=>b.id===id)
if(!book)
{
    return res.status(404).json({error:"book not found"})
}
res.status(200).json(book);
});

//הוספת ספר
app.post('/books',(req,res)=>{
    const newBook = req.body;
    const newId = books.length > 0 ? books[books.length - 1].id + 1 : 101;
    const book={id:newId, name:newBook.name,category:newBook.category, price:newBook.price, isBorrowed:false,borrowings: []}
    books.push(book)

    res.status(201).json(book)
});

//עדכון ספר
app.put('/books/:id',(req,res)=>{
const id =+ req.params.id 
const book= books.find(b=>b.id===id)
if(!book)
{
    return res.status(404).json({error:"book not found"})
}

const name = req.body.name;
const category = req.body.category;
const price = req.body.price;
if (name !== undefined) 
    book.name = name;
if (category !== undefined)
     book.category = category;
if (price !== undefined) 
    book.price = price;

return res.status(200).json(book)
}); 

//ביצוע השאלה
app.post('/books/:id/borrow',(req,res)=>{
    const id = +req.params.id;
    const customerId = req.body.customerId;
const book = books.find(b => b.id === id);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
if (book.isBorrowed) {
    return res.status(400).json({ error: 'Book is already borrowed' });
  }
book.isBorrowed = true;
book.borrowings.push({
borrowDate: new Date().toISOString().split('T')[0], // תאריך נוכחי בפורמט YYYY-MM-DD
customerId: customerId
  });
    res.status(200).json(book )
});
 
//החזרת ספר
app.post('/books/:id/return', (req, res) => {
  const id = +req.params.id;
  const book = books.find(b => b.id === id);

  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  if (!book.isBorrowed) {
    return res.status(400).json({ error: 'Book is not currently borrowed' });
  }
  // עדכון הסטטוס לזמין
  book.isBorrowed = false;

  res.status(200).json(book);
});

//מחיקת ספר
app.delete('/books/:id', (req, res) => {
  const id = +req.params.id;
  const bookIndex = books.findIndex(b => b.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }
  // הסרת הספר מהמערך
  const deletedBook = books.splice(bookIndex, 1)[0];

  res.status(200).json({ message: 'Book deleted successfully', book: deletedBook });
});
app.listen(port,()=>{
    console.log(`app listenning on http://localhost:${port}`)
});