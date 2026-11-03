import http from "http";
import fs from "fs";

let books = [
    { id: 1, title: "The Alchemist", author: "Paulo Coelho", price: 350 },
    { id: 2, title: "Wings of Fire", author: "A.P.J. Abdul Kalam", price: 250 },
    { id: 3, title: "The Hobbit", author: "J.R.R. Tolkien", price: 400 }
];

const server = http.createServer((req, res) => {

    const url = req.url;
    const method = req.method;

    
    if (url === "/" && method === "GET") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("<h1>Welcome to Library Book Management</h1>");
    }

    
    else if (url === "/books" && method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(books));
    }

    
    else if (url === "/add-book" && method === "POST") {

        let body = "";

        req.on("data", (chunk) => {
            body = body + chunk;
        });

        req.on("end", () => {
            try {
                const newBook = JSON.parse(body);

                if (
                    newBook.id === undefined ||
                    !newBook.title ||
                    !newBook.author ||
                    newBook.price === undefined
                ) {
                    res.writeHead(400, {
                        "Content-Type": "application/json"
                    });
                    res.end(JSON.stringify({
                        message: "Please provide id, title, author and price"
                    }));
                    return;
                }

                books.push(newBook);

                res.writeHead(201, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Book added successfully",
                    book: newBook
                }));

            } catch (error) {
                res.writeHead(400, {
                    "Content-Type": "application/json"
                });
                res.end(JSON.stringify({
                    message: "Invalid JSON data"
                }));
            }
        });
    }

    
    else if (url === "/about" && method === "GET") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("<h1>About</h1><p>This is a Library Book Management Application.</p>");
    }

    
    else if (url === "/home" && method === "GET") {

        fs.readFile("./public/index.html", "utf8", (error, data) => {

            if (error) {
                res.writeHead(500, {
                    "Content-Type": "text/plain"
                });
                res.end("Unable to read the HTML file");
            }

            else {
                res.writeHead(200, {
                    "Content-Type": "text/html"
                });
                res.end(data);
            }
        });
    }

    
    else {
        res.writeHead(404, {
            "Content-Type": "text/plain"
        });
        res.end("404 - Page Not Found");
    }

});

server.listen(3000, () => {
    console.log("HTTP Server running at http://localhost:3000");
});