const express = require("express");

express()

    .get("/test", (req, res) => {
        res.status(200).json({status: 200, message: "success"})
    })

    .listen(8000, () => {
        console.log("Server listening on port 8000")
    });