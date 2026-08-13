const express = require("express");

const protect = require("../middleware/authMiddleware");
const { getProtectedData } = require("../controllers/testController");

const router = express.Router();

router.get("/protected", protect, getProtectedData);

module.exports = router;