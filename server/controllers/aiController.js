const { explainCode, debugCode, reviewCode } = require("../services/aiService");
const Analysis = require("../models/Analysis");

const explainCodeController = async (req, res) => {
  try {
    const { language, code } = req.body;

    if (!language || !code) {
      return res.status(400).json({
        success: false,
        message: "Language and code are required",
      });
    }

    const explanation = await explainCode(language, code);

    await Analysis.create({
      userId: req.user,
      type: "explain",
      language,
      code,
      result: explanation,
    });

    res.status(200).json({
      success: true,
      explanation,
    });
  } catch (error) {
    console.error("AI Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate AI response",
    });
  }
};

const debugCodeController = async (req, res) => {
  try {
    const { language, code } = req.body;

    if (!language || !code) {
      return res.status(400).json({
        success: false,
        message: "Language and code are required",
      });
    }

    const result = await debugCode(language, code);

    await Analysis.create({
      userId: req.user,
      type: "debug",
      language,
      code,
      result,
    });

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("AI Debug Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to debug code",
    });
  }
};

const reviewCodeController = async (req, res) => {
  try {
    const { language, code } = req.body;

    if (!language || !code) {
      return res.status(400).json({
        success: false,
        message: "Language and code are required",
      });
    }

    const result = await reviewCode(language, code);

    await Analysis.create({
      userId: req.user,
      type: "review",
      language,
      code,
      result,
    });

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("AI Review Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to review code",
    });
  }
};

const getHistoryController = async (req, res) => {
    try {
        const history = await Analysis.find({
            userId: req.user
        }).sort({
            createdAt: -1
        });

        res.status(200).json({
            success: true,
            history
        });

    } catch (error) {
        console.error("History Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch analysis history"
        });
    }
};

module.exports = {
    explainCodeController,
    debugCodeController,
    reviewCodeController,
    getHistoryController
};
