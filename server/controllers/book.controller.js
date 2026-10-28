import { books } from '../db.js';
import { users } from '../users.js';

//קבלת כל הספרים
export const getBookAllBooks = (req, res) => {
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
};

//קבלת ספר לפי קוד
export const getBookById = (req, res, next) => {
  const id = +req.params.id;
  const book = books.find(b => b.id === id);
  if (!book) {
    const error = new Error('Book not found');
    error.status = 404;
    return next(error);   
}
res.status(200).json(book);
};

//הוספת ספר
export const addBook = (req, res) => {
    const newBook = req.body;
    const newId = books.length > 0 ? books[books.length - 1].id + 1 : 101;
    const book={id:newId, name:newBook.name,category:newBook.category, price:newBook.price, isBorrowed:false,borrowings: []}
    books.push(book)

    res.status(201).json(book)
};

//עדכון ספר
export const updateBook = (req, res, next) => {
  const id = +req.params.id;
  const book = books.find(b => b.id === id);

if(!book)
{
  const error = new Error('Book not found');
  error.status = 404;
  return next(error);
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
}; 

// ביצוע השאלה
export const borrowBook = (req, res, next) => {
  const id = +req.params.id;
  const customerId = req.body.customerId;
  const user = users.find(u => u.id === customerId);
  const book = books.find(b => b.id === id);

  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    return next(error);
  }
  if (!book) {
    const error = new Error('Book not found');
    error.status = 404;
    return next(error);
  }
  if (book.isBorrowed) {
    const error = new Error('Book is already borrowed');
    error.status = 400;
    return next(error);
  }

  book.isBorrowed = true;
  book.borrowings.push({
    borrowDate: new Date().toISOString().split('T')[0],
    customerId: customerId
  });
  user.Books.push(id);

  res.status(200).json(book);
};
 
// החזרת ספר
export const returnBook = (req, res, next) => {
  const id = +req.params.id;
  const customerId = req.body.customerId;
  const book = books.find(b => b.id === id);
  const user = users.find(u => u.id === customerId);

  if (!book) {
    const error = new Error('Book not found');
    error.status = 404;
    return next(error);
  }
  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    return next(error);
  }
  if (!user.Books.includes(id)) {
    const error = new Error('This user did not borrow this book');
    error.status = 400;
    return next(error);
  }
  if (!book.isBorrowed) {
    const error = new Error('Book is not currently borrowed');
    error.status = 400;
    return next(error);
  }

  book.isBorrowed = false;
  user.Books = user.Books.filter(b => b !== id);

  res.status(200).json(book);
};

//מחיקת ספר
export const deleteBook = (req, res, next) => {
  const id = +req.params.id;
  const bookIndex = books.findIndex(b => b.id === id);

  if (bookIndex === -1) {
    const error = new Error('Book not found');
    error.status = 404;
    return next(error);
  }
  // הסרת הספר מהמערך
  const deletedBook = books.splice(bookIndex, 1)[0];

  res.status(200).json({ message: 'Book deleted successfully', book: deletedBook });
};
