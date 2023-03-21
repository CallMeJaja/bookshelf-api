const { nanoid } = require("nanoid");
const books = require("./books");

// Menambahkan Buku Baru
const tambahBuku = (request, h) => {
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

  const bukuBaru = {
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

  //  Client tidak melampirkan properti namepada request body
  if (bukuBaru.name === undefined) {
    const response = h
      .response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      })
      .code(400);
    return response;
  }
  //   Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount
  else if (bukuBaru.readPage > bukuBaru.pageCount) {
    const response = h
      .response({
        status: "fail",
        message:
          "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
    return response;
  }
  //   Jika Semua Kriteria di Penuhi
  else if (
    !(bukuBaru === undefined && bukuBaru.readPage >= bukuBaru.pageCount)
  ) {
    books.push(bukuBaru);
    const response = h
      .response({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: {
          bookId: id,
        },
      })
      .code(201);
    return response;
  }
  // Jika Kriteria tidak terpenuhi
  const response = h
    .response({
      status: "fail",
      message: "Buku gagal ditambahkan",
    })
    .code(500);
  return response;
};

// Menampilkan Seluruh Buku
const tampilkanBuku = (request, h) => {
  const { name, reading, finished } = request.query;

  if (books.length > 0) {
    let bookFilter = books;

    if (name) {
      bookFilter = bookFilter.filter((buku) =>
        buku.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    if (reading) {
      bookFilter = bookFilter.filter((buku) => buku.reading == Number(reading));
    }
    if (finished) {
      bookFilter = bookFilter.filter(
        (buku) => buku.finished == Number(finished)
      );
    }

    const response = h
      .response({
        status: "success",
        data: {
          books: bookFilter.map((buku) => ({
            id: buku.id,
            name: buku.name,
            publisher: buku.publisher,
          })),
        },
      })
      .code(200);
    return response;
  } else {
    const response = h
      .response({
        status: "success",
        data: {
          books: [],
        },
      })
      .code(200);
    return response;
  }
};

// Menampilkan Buku By ID
const tampilkanBukuId = (request, h) => {
  const { id } = request.params;
  const book = books.filter((bId) => bId.id === id)[0];

  if (book !== undefined) {
    return {
      status: "success",
      data: {
        book,
      },
    };
  }
  const response = h
    .response({
      status: "fail",
      message: "Buku tidak ditemukan",
    })
    .code(404);
  return response;
};

// Mengubah Data Buku By ID
const ubahBukuId = (request, h) => {
  const { id } = request.params;
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

  const index = books.findIndex((bId) => bId.id === id);
  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;

  if (index !== -1) {
    // Client tidak melampirkan properti name pada request body
    if (!name) {
      const response = h
        .response({
          status: "fail",
          message: "Gagal memperbarui buku. Mohon isi nama buku",
        })
        .code(400);
      return response;
    }

    // Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount
    if (readPage > pageCount) {
      const response = h
        .response({
          status: "fail",
          message:
            "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
        })
        .code(400);
      return response;
    }
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };

    // Sukses memperbarui data buku
    const response = h
      .response({
        status: "success",
        message: "Buku berhasil diperbarui",
      })
      .code(200);
    return response;
  }
  // Gagal memperbarui data buku
  const response = h
    .response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    })
    .code(404);
  return response;
};

// FUNGSI HAPUS BUKU
const hapusBuku = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((bId) => bId.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h
      .response({
        status: "success",
        message: "Buku berhasil dihapus",
      })
      .code(200);
    return response;
  }
  const response = h
    .response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    })
    .code(404);
  return response;
};

module.exports = {
  tambahBuku,
  tampilkanBuku,
  tampilkanBukuId,
  ubahBukuId,
  hapusBuku,
};
