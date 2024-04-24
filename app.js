import express from 'express'
import bodyParser from 'body-parser'
import { Book } from './model/book.js';
import { User } from './model/user.js';
import {body,validationResult} from 'express-validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser';


export const app=express();

//Middle ware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});


// User Registration

app.post('/register',async(req,res)=>{
    try {
        const {username,password}=req.body;
        const user=await User.findOne({username});
        if(user){
            return res.status(400).json({message:' This user already exists'});

        }
        // Hash Password
        const hashedPassword=await bcrypt.hash(password,10);

        // Create new User
        const newUser= new User({username, password:hashedPassword});
        await newUser.save();

        res.status(201).json({message:'User registered successfully'});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
});


// User Login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.cookie('token', token, { httpOnly: true });
        res.json({ message:'Login Successfull', token });
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err.message);
    }
});
// Logout route
app.post('/logout', (req, res) => {
    try {
        // Clear the token 
        res.clearCookie('token'); // Clear token cookie
        
        res.json({ message: 'Logout successful' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized, Please Login to access this content' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};






// Create a new book
app.post('/addBook', [
    body('title').notEmpty(),
    body('author').notEmpty(),
    body('publicationYear').isInt()
], verifyToken,async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    

    try {
        const { title, author, publicationYear } = req.body;
        const book = new Book({ title, author, publicationYear });
        await book.save();
        res.status(201).json(book);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Get all books
app.get('/getAllBooks', verifyToken,async (req, res) => {
    try {
        const books = await Book.find();
        if (books.length===0) {
            return res.json({ message: 'No Books Found, please add books to see.' });
        }
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Book by ID
app.get('/book/:id',verifyToken, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(book);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Update a book by ID
app.put('/updateBook/:id', [
    body('title').notEmpty(),
    body('author').notEmpty(),
    body('publicationYear').isInt()
], verifyToken,async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, author, publicationYear } = req.body;
        const book = await Book.findByIdAndUpdate(req.params.id, { title, author, publicationYear }, { new: true });
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(book);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a book by ID
app.delete('/deleteBook/:id', verifyToken,async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json({ message: 'Book deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete all Books
app.delete('/deleteAllBooks', verifyToken,async (req, res) => {
    try {
        await Book.deleteMany({});
        
        res.json({ message: 'All Books deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Filter Books by author or publication year

app.get('/filter',verifyToken, (req, res) => {
    const { author, publicationYear } = req.query;
    let filter = {};

//If one filter parameter is provided
     if (!author && !publicationYear) {
        return res.status(400).json({ error: 'At least one filter parameter (author or publicationYear) is required' });
    }

    if (author) {
        filter.author = author;
    }

    if (publicationYear) {
        filter.publicationYear = publicationYear;
    }

    Book.find(filter)
        .then(books => res.json(books))
        .catch(err => res.status(500).json({ error: err.message }));
});