import express from 'express';
import {
  getBookAllBooks,
  getBookById,
  addBook,
  updateBook,
  borrowBook,
  returnBook,
  deleteBook
} from '../controllers/book.controller.js';
   const router = express.Router();
router.get('/', getBookAllBooks);
router.get('/:id', getBookById);
router.post('/', addBook);
router.put('/:id', updateBook);
router.post('/:id/borrow', borrowBook);
router.post('/:id/return', returnBook);
router.delete('/:id', deleteBook);

  export default router;