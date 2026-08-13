const getHealth = (req, res) => {
    res.json({
        success: true,
        message: "DevPilot API is running"
    });
};

module.exports = {
    getHealth
};