const bcrypt = require('bcrypt')
const { getDatabase, client } = require('../helpers/connectDB')
const signToken = require('../helpers/signToken')
const returnStatus = require('../helpers/returnStatus')
const fs = require('fs')
const path = require('path')

const usersController = {
    signIn: async (req, res) => {
        try {
            const db = await getDatabase()
            var user = null

            const admin = await db.collection('admin').findOne({
                email: req.body.email,
            })

            const doctor = await db.collection('doctors').findOne({
                email: req.body.email,
            })

            if (!admin && !doctor) {
                return returnStatus(res, 404, true, 'Not found')
            }

            if (admin) {
                user = admin
            }

            if (doctor) {
                user = doctor
            }

            bcrypt.compare(
                req.body.password,
                user.password,
                (err, result) => {
                    if (err || !result) {
                        return returnStatus(
                            res,
                            401,
                            true,
                            'Invalid email or password'
                        )
                    }

                    const newjwt = signToken({
                        email: user.email,
                    })

                    return returnStatus(
                        res,
                        200,
                        false,
                        `Welcome ${user.username}`,
                        {
                            token: newjwt,
                            username: user.username,
                        }
                    )
                }
            )
        } catch (error) {
            console.log(error)
            return returnStatus(
                res,
                500,
                true,
                'Internal server error'
            )
        } finally {
            if (client) {
                await client.close()
            }
        }
    },

    checkifLoggedIn: async (req, res) => {
        try {
            const db = await getDatabase()

            const admin = await db.collection('admin').findOne({
                email: req.decodedtoken.email,
            })

            if (admin) {
                return returnStatus(res, 200, false, 'ok', {
                    admin: true,
                })
            }

            const doctor = await db.collection('doctors').findOne({
                email: req.decodedtoken.email,
            })

            if (doctor) {
                const uploadsDir = path.join(__dirname, '/../uploads')
                var image = null

                const files = await fs.promises.readdir(uploadsDir)

                const imageFile = files.find(file =>
                    file.startsWith(doctor.idnumber)
                )

                var base64Image = ''

                if (imageFile) {
                    const imagePath = path.join(uploadsDir, imageFile)
                    image = fs.readFileSync(imagePath)

                    base64Image =
                        Buffer.from(image).toString('base64')
                }

                return returnStatus(res, 200, false, 'Ok', {
                    image: base64Image,
                    doctor: true,
                    idnumber: doctor.idnumber,
                    phone: doctor.phone,
                    email: doctor.email,
                    username: doctor.username,
                })
            } else {
                return returnStatus(res, 401, true, 'Unauthorized')
            }
        } catch (error) {
            console.log(error)
            return returnStatus(
                res,
                500,
                true,
                'Internal server error'
            )
        } finally {
            if (client) {
                await client.close()
            }
        }
    },
}

module.exports = usersController
