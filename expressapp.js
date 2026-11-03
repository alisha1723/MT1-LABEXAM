import express from "express";

const app = express();

app.use(express.json());


let books = [
    {
        id: 1,
        title: "The Alchemist",
        author: "Paulo Coelho",
        price: 350,
        category: "Fiction"
    },
    {
        id: 2,
        title: "Wings of Fire",
        author: "A.P.J. Abdul Kalam",
        price: 250,
        category: "Biography"
    },
    {
        id: 3,
        title: "Clean Code",
        author: "Robert C. Martin",
        price: 550,
        category: "Programming"
    }
];


app.get("/books", (req, res) => {
    res.status(200).json(books);
});


app.get("/books/:id", (req, res) => {

    const id = Number(req.params.id);

    const book = books.find((b) => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.status(200).json(book);
});


app.post("/books", (req, res) => {

    const newBook = req.body;

    if (
        newBook.id === undefined ||
        !newBook.title ||
        !newBook.author ||
        newBook.price === undefined ||
        !newBook.category
    ) {
        return res.status(400).json({
            message: "Please provide id, title, author, price and category"
        });
    }

    const alreadyExists = books.find(
        (b) => b.id === Number(newBook.id)
    );

    if (alreadyExists) {
        return res.status(400).json({
            message: "Book ID already exists"
        });
    }

    books.push(newBook);

    res.status(201).json({
        message: "Book added successfully",
        book: newBook
    });
});


app.put("/books/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = books.findIndex((b) => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    books[index] = {
        ...books[index],
        ...req.body,
        id: id
    };

    res.status(200).json({
        message: "Book updated successfully",
        book: books[index]
    });
});


app.delete("/books/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = books.findIndex((b) => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const deletedBook = books[index];

    books.splice(index, 1);

    res.status(200).json({
        message: "Book deleted successfully",
        book: deletedBook
    });
});


app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});


app.use((err, req, res, next) => {
    res.status(400).json({
        message: "Invalid JSON data"
    });
});


app.listen(4000, () => {
    console.log("Express Server running at http://localhost:4000");
});