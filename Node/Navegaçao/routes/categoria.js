const express = require("express");
const router = express.Router();

//listar categoria
router.get("/", async (req, res) => {
    res.render("base", {
        title: "Listar categorias",
        view: "categorias/show",
    })
})

//form edit categoria
router.get("/edit", async (req, res) => {
    res.render("base", {
        title: "Editar categorias",
        view: "categorias/edit",
    })
})

//form add categoria
router.get("/add", async (req, res) => {
    res.render("base", {
        title: "Add categorias",
        view: "categorias/add",
    })
})

module.exports = router;