const { getDatabase, client } = require('../helpers/connectDB')
const returnStatus = require('../helpers/returnStatus')

const patientsController = {
    registerPatient: async (req, res, next) => {
        try {
            const db = await getDatabase()

            const doctorid = await db.collection('doctors').findOne({
                $or: [
                    { email: req.body.email },
                    { idnumber: req.body.idnumber },
                ],
            })

            if (doctorid) {
                return returnStatus(
                    res,
                    400,
                    true,
                    "You can't register a patient using this id number or email"
                )
            }

            const doctor = await db.collection('doctors').findOne({
                email: req.decodedtoken.email,
            })

            const admin = await db.collection('admin').findOne({
                email: req.decodedtoken.email,
            })

            const emailExistsForAdmin = await db
                .collection('admin')
                .findOne({
                    email: req.body.email,
                })

            if (emailExistsForAdmin) {
                return returnStatus(
                    res,
                    400,
                    true,
                    "You can't register a patient using this email"
                )
            }

            const medicalrecord = doctor
                ? [
                      {
                          date: new Date().toLocaleDateString(
                              'en-GB'
                          ),
                          record: req.body.medicalrecord,
                      },
                  ]
                : []

            if (doctor || admin) {
                const patients_collection = db.collection('patients')
                const patient = await patients_collection.findOne({
                    $or: [
                        { email: req.body.email },
                        { idnumber: req.body.idnumber },
                    ],
                })

                if (patient) {
                    return returnStatus(
                        res,
                        400,
                        true,
                        'Patient already exists'
                    )
                }

                const result = await patients_collection.insertOne({
                    idnumber: req.body.idnumber,
                    username: req.body.username,
                    email: req.body.email,
                    address: req.body.address,
                    phone: req.body.phone,
                    medicalrecord: medicalrecord,
                })

                return returnStatus(res, 200, false, 'Patient added')
            }

            return returnStatus(
                res,
                401,
                true,
                "You aren't allowed to register a patient"
            )
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

    searchPatient: async (req, res) => {
        try {
            const db = await getDatabase()

            const patient = await db
                .collection('patients')
                .findOne(
                    { idnumber: req.query.idnumber },
                    { projection: { _id: 0, password: 0 } }
                )

            if (patient) {
                const patientJson = JSON.stringify(patient)
                return returnStatus(
                    res,
                    200,
                    false,
                    'Patient found',
                    {
                        patient: patientJson,
                    }
                )
            } else {
                return returnStatus(
                    res,
                    404,
                    true,
                    'Patient not found'
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
    addNewMedicalRecord: async (req, res) => {
        try {
            const db = await getDatabase()

            const doctor = await db.collection('doctors').findOne({
                email: req.decodedtoken.email,
            })

            if (doctor) {
                const patient = await db
                    .collection('patients')
                    .findOneAndUpdate(
                        { idnumber: req.body.idnumber },
                        {
                            $push: {
                                medicalrecord: {
                                    date: new Date().toLocaleDateString(
                                        'en-GB'
                                    ),
                                    record: req.body.medicalrecord,
                                },
                            },
                        },
                        {
                            returnDocument: 'after',
                            projection: { _id: 0, password: 0 },
                        }
                    )

                if (!patient) {
                    return returnStatus(
                        res,
                        404,
                        true,
                        'Patient was not found'
                    )
                }

                const patientJson = JSON.stringify(patient)
                console.log(patient)

                return returnStatus(
                    res,
                    201,
                    false,
                    'New Record for patient added',
                    {
                        patient: patientJson,
                    }
                )
            }
            return returnStatus(
                res,
                404,
                true,
                'Doctor was not found'
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
    updateContact: async (req, res) => {
        try {
            const { phone, email, idnumber } = req.body

            const db = await getDatabase()
            const admin = await db.collection('admin').findOne({
                email: req.decodedtoken.email,
            })

            if (admin) {
                const adminEmailExists = await db
                    .collection('admin')
                    .findOne({
                        email: email,
                    })

                const doctorEmailExists = await db
                    .collection('doctors')
                    .findOne({
                        email: email,
                    })

                if (adminEmailExists || doctorEmailExists) {
                    return returnStatus(
                        res,
                        404,
                        true,
                        "You can't use this email"
                    )
                }

                const patient = await db
                    .collection('patients')
                    .findOneAndUpdate(
                        { idnumber: req.body.idnumber },
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

                if (!patient) {
                    return returnStatus(
                        res,
                        404,
                        true,
                        'Patient was not found'
                    )
                }

                const patientJson = JSON.stringify(patient)
                console.log(patient)

                return returnStatus(
                    res,
                    201,
                    false,
                    'patient updated',
                    {
                        patient: patientJson,
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

module.exports = patientsController
