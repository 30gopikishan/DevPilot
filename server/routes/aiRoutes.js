const express = require("express");

const protect = require("../middleware/authMiddleware");
const {
    explainCodeController,
    debugCodeController,
    reviewCodeController,
    getHistoryController
} = require("../controllers/aiController");

const router = express.Router();

router.post(
    "/explain",
    protect,
    explainCodeController
);

router.post(
    "/debug",
    protect,
    debugCodeController
);

router.post(
    "/review",
    protect,
    reviewCodeController
);

router.get(
    "/history",
    protect,
    getHistoryController
);

module.exports = router;