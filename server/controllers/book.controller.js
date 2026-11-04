import Book from '../models/book.js';
import User from '../models/user.js';

//קבלת כל הספרים
export const getBookAllBooks = async (req, res, next) => {
    try {
        //מגדיר ערכי ברירת מחדל למקרה שלא יהיה פרמטרים
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 5;
        //למקרה שיש פרמטרים נחלצם
        const name = req.query.name;
        const category = req.query.category;
        
        let query = {};
        
        //חיפוש לפי שם ספר או קטגוריה
        if (name) {
            query.name = name;
        }
        if (category) {
            query.category = category;
        }
        
        const startIndex = (page - 1) * limit;
        
        //חיתוך
        const paginatedBooks = await Book.find(query).skip(startIndex).limit(limit);
        res.status(200).json(paginatedBooks);
    } catch (error) {
        next(error);
    }
};

//קבלת ספר לפי קוד
export const getBookById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const book = await Book.findById(id);
        if (!book) {
            const error = new Error('Book not found');
            error.status = 404;
            return next(error);
        }
        res.status(200).json(book);
    } catch (error) {
        next(error);
    }
};

//הוספת ספר
export const addBook = async (req, res, next) => {
    try {
        const newBook = new Book({
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            isBorrowed: false,
            borrowings: []
        });
        
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        next(error);
    }
};

//עדכון ספר
export const updateBook = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updateData = {};
        
        if (req.body.name !== undefined) updateData.name = req.body.name;
        if (req.body.category !== undefined) updateData.category = req.body.category;
        if (req.body.price !== undefined) updateData.price = req.body.price;

        const book = await Book.findByIdAndUpdate(id, updateData, { new: true });

        if (!book) {
            const error = new Error('Book not found');
            error.status = 404;
            return next(error);
        }

        res.status(200).json(book);
    } catch (error) {
        next(error);
    }
};

// ביצוע השאלה
export const borrowBook = async (req, res, next) => {
    try {
        const id = req.params.id;
        const customerId = req.body.customerId;
        
        const user = await User.findById(customerId);
        const book = await Book.findById(id);

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
        await book.save();
        
        user.Books.push(id);
        await user.save();

        res.status(200).json(book);
    } catch (error) {
        next(error);
    }
};
 
// החזרת ספר
export const returnBook = async (req, res, next) => {
    try {
        const id = req.params.id;
        const customerId = req.body.customerId;
        
        const book = await Book.findById(id);
        const user = await User.findById(customerId);

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
        await book.save();
        
        user.Books = user.Books.filter(b => b.toString() !== id);
        await user.save();

        res.status(200).json(book);
    } catch (error) {
        next(error);
    }
};

//מחיקת ספר
export const deleteBook = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deletedBook = await Book.findByIdAndDelete(id);

        if (!deletedBook) {
            const error = new Error('Book not found');
            error.status = 404;
            return next(error);
        }

        res.status(200).json({ message: 'Book deleted successfully', book: deletedBook });
    } catch (error) {
        next(error);
    }
};