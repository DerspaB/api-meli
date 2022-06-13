const { Router } = require("express");
const { getItems } = require("../controllers/items/items");

const router = Router();

router.get("/", getItems);

module.exports = router;
