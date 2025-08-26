const express = require("express");
const router = express.Router();

//listar alunos
router.get("/", async (req, res) => {
    res.render("base", {
        title: "Listar Alunos",
        view: "Alunos/show",
    })
})

//form edit categoria
router.get("/edit", async (req, res) => {
    res.render("base", {
        title: "Editar Alunos",
        view: "Alunos/edit",
    })
})

//form add categoria
router.get("/add", async (req, res) => {
    res.render("base", {
        title: "Add Alunos",
        view: "Alunos/add",
    })
})

module.exports = router;