const { nanoid } = require("nanoid");
const books = require("./books");

// Fungsi Tambah Buku
const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (newBook.name === undefined) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  } else if (newBook.readPage > newBook.pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });

    response.code(400);
    return response;
  } else if (
    !(newBook === undefined && newBook.readPage >= newBook.pageCount)
  ) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    books.push(newBook);

    response.code(201);
    return response;
  } else {
    const response = h.response({
      status: "fail",
      message: "Buku gagal ditambahkan",
    });

    response.code(500);
    return response;
  }
};

const getAllBookHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  if (books.length > 0) {
    let booksWithFilter = books;

    if (name) {
      booksWithFilter = booksWithFilter.filter((book) =>
        book.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    if (reading) {
      booksWithFilter = booksWithFilter.filter(
        (book) => book.reading == Number(reading)
      );
    }

    if (finished) {
      booksWithFilter = booksWithFilter.filter(
        (book) => book.finished == Number(finished)
      );
    }

    const response = h.response({
      status: "success",
      data: {
        books: booksWithFilter.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  } else {
    const response = h.response({
      status: "success",
      data: {
        books: [],
      },
    });
    response.code(200);
    return response;
  }
};

const getBookByIdHandler = () => {};

module.exports = { addBookHandler, getAllBookHandler };
