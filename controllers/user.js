const index = (req, res) => {
    return res.status(200).json({
        message: "you requested to user handle"
    })
}

module.exports = {
    index
}
