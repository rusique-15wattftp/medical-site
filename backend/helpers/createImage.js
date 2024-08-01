const fs = require('fs')
const path = require('path')

function createImage(req) {
    const uploadDir = path.join(__dirname, '..', 'uploads')

    const newPath = path.join(
        uploadDir,
        `${req.body.idnumber}.${path
            .extname(req.uploadedImageName)
            .slice(1)}`
    )
    try {
        fs.renameSync(req.uploadedImageFilePath, newPath)

        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = createImage
