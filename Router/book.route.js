router.get('/:id', getBookAllBooks);
router.get('/:id', getBookById);
router.post('/', addBook);
router.put('/:id', updateBook);
router.post('/:id/borrow', borrowBook);
router.post('/:id/return', returnBook);
router.delete('/:id', deleteBook);
