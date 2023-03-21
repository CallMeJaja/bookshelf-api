const {
  tambahBuku,
  tampilkanBuku,
  tampilkanBukuId,
  ubahBukuId,
  hapusBuku,
} = require("./handler");

const routes = [
  {
    method: "POST",
    path: "/books",
    handler: tambahBuku,
  },
  {
    method: "GET",
    path: "/books",
    handler: tampilkanBuku,
  },
  {
    method: "GET",
    path: "/books/{id}",
    handler: tampilkanBukuId,
  },
  {
    method: "PUT",
    path: "/books/{id}",
    handler: ubahBukuId,
  },
  {
    method: "DELETE",
    path: "/books/{id}",
    handler: hapusBuku,
  },
];

module.exports = routes;
