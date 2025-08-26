const express = require("express");
const router = express.Router();

//Pagina inicial
router.get("/", async (req, res) => {
    res.render("base", {
        title: "Pagina inicial",
        view: "Index",
    })
})

module.exports = router;