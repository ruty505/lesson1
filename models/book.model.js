const mongoose = require('mongoose');

// הגדרת הסכימה עבור ספר
const bookSchema = new mongoose.Schema({
    name: { type: String },              
    price: { type: Number },             
    categories: [{ type: String }],      
    author_details: {                    
        name: { type: String },
        phone: { type: String },
        email: { type: String }
    }
});

// יצירת המודל מתוך הסכימה (השם 'Book' ייצור אוטומטית אוסף בשם 'books' במסד הנתונים)
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;