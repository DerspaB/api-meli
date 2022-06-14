const { Router } = require("express");
const { getItems, getItemDescription } = require("../controllers/items/items");

const router = Router();

router.get("/", getItems);
router.get("/:id", getItemDescription);

module.exports = router;
