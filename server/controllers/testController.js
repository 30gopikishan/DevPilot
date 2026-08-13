const getProtectedData = (req, res) => {
    res.json({
        success: true,
        message: "You accessed a protected route",
        userId: req.user
    });
};

module.exports = {
    getProtectedData
};