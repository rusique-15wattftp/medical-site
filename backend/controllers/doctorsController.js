const { getDatabase, client } = require('../helpers/connectDB')
const createHash = require('../helpers/createHash')
const returnStatus = require('../helpers/returnStatus')
const createImage = require('../helpers/createImage')

const doctorsController = {
    registerDoctor: async (req, res, next) => {
        try {
            const db = await getDatabase()

            const admin = await db.collection('admin').findOne({
                email: req.decodedtoken.email,
            })

            console.log(req.decodedtoken.email)

            if (!admin) {
                returnStatus(res, 401, true, 'Unauthorized request')
                return next(new Error())
            }

            const emailExistsForAdmin = await db
                .collection('admin')
                .findOne({
                    email: req.body.email,
                })

            if (emailExistsForAdmin) {
                returnStatus(
                    res,
                    400,
                    true,
                    "You can't register a doctor using this email"
                )
                return next(new Error())
            }

            const patient = await db.collection('patients').findOne({
                $or: [
                    { email: req.body.email },
                    { idnumber: req.body.idnumber },
                ],
            })
            if (patient) {
                returnStatus(
                    res,
                    400,
                    true,
                    "You can't use this idnumber or email for registering a doctor"
                )
                return next(new Error())
            }

            console.log(admin)
            if (admin) {
                const doctors_collection = db.collection('doctors')
                const doctor = await doctors_collection.findOne({
                    $or: [
                        { email: req.body.email },
                        { idnumber: req.body.idnumber },
                    ],
                })
                if (doctor) {
                    returnStatus(
                        res,
                        400,
                        true,
                        'Doctor already registered'
                    )
                    return next(new Error())
                } else {
                    const hash = await createHash(req.body.password)

                    if (createImage(req)) {
                        console.log('image created')
                    } else {
                        returnStatus(
                            res,
                            400,
                            true,
                            'Error uploading file'
                        )
                        return next(new Error())
                    }

                    const result = await doctors_collection.insertOne(
                        {
                            idnumber: req.body.idnumber,
                            phone: req.body.phone,
                            email: req.body.email,
                            username: req.body.username,
                            password: hash,
                        }
                    )

                    console.log('doctor registered')
                    return returnStatus(
                        res,
                        201,
                        false,
                        'Doctor Registered'
                    )
                }
            }
        } catch (error) {
            console.log(error)
            returnStatus(res, 500, true, 'Internal server error')
            return next(new Error())
        } finally {
            if (client) {
                await client.close()
            }
        }
    },
    searchDoctor: async (req, res) => {
        try {
            const db = await getDatabase()

            const doctor = await db
                .collection('doctors')
                .findOne(
                    { idnumber: req.query.idnumber },
                    { projection: { _id: 0, password: 0 } }
                )

            if (doctor) {
                const doctorJson = JSON.stringify(doctor)
                return returnStatus(res, 200, false, 'Doctor found', {
                    doctor: doctorJson,
                })
            } else {
                return returnStatus(
                    res,
                    404,
                    true,
                    'Doctor not found'
                )
            }
        } catch (error) {
            console.error(error)
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
    updateContact: async (req, res) => {
        try {
            const { phone, email, idnumber } = req.body

            const db = await getDatabase()
            const admin = await db.collection('admin').findOne({
                email: req.decodedtoken.email,
            })

            if (admin) {
                const doctorExists = await db
                    .collection('doctors')
                    .findOne({
                        $or: [
                            { email: req.body.email },
                            { phone: req.body.phone },
                        ],
                    })

                const patientExists = await db
                    .collection('patients')
                    .findOne({
                        $or: [
                            { email: req.body.email },
                            { phone: req.body.phone },
                        ],
                    })

                if (doctorExists || patientExists) {
                    return returnStatus(
                        res,
                        404,
                        true,
                        "This email or phone can't be used"
                    )
                }

                const doctor = await db
                    .collection('doctors')
                    .findOneAndUpdate(
                        { idnumber: idnumber },
                        {
                            $set: {
                                phone: phone,
                                email: email,
                            },
                        },
                        {
                            returnDocument: 'after',
                            projection: { _id: 0, password: 0 },
                        }
                    )

                if (!doctor) {
                    return returnStatus(
                        res,
                        404,
                        true,
                        'Doctor was not found'
                    )
                }

                const doctorJson = JSON.stringify(doctor)
                console.log(doctor)

                return returnStatus(
                    res,
                    201,
                    false,
                    'Doctor updated',
                    {
                        doctor: doctorJson,
                    }
                )
            }
            return returnStatus(res, 401, true, 'Unauthorized')
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

module.exports = doctorsController
