import CustomForm from '../../components/CustomForm/CustomForm'
import { useState } from 'react'
import Button from '../../components/Button/Button'
import { makePOSTrequestForMultipleFormData } from '../../utils/api'
import './RegisterDoctor.css'

function RegisterDoctor() {
    const [image, setImage] = useState(null)
    const [idnumber, setIDNumber] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    const submitDoctor = async e => {
        e.preventDefault()

        if (!image) {
            setMessage('No image selected')
            return
        }

        const formData = new FormData()

        formData.append('file', image)

        formData.append(
            'data',
            JSON.stringify({
                idnumber,
                phone,
                email,
                username,
                password,
            })
        )

        console.log(formData)

        const res = await makePOSTrequestForMultipleFormData(
            'http://localhost:5000/doctors/registerdoctor',
            formData,
            localStorage.getItem('token')
        )

        setMessage(res.message)
    }

    return (
        <div className='registerdoctor-container'>
            <CustomForm>
                <span>Doctor Image:</span>
                <br />
                <CustomForm.Image
                    onChange={e => setImage(e.target.files[0])}
                />
                <br />
                <br />
                <CustomForm.IDNumber
                    value={idnumber}
                    onChange={e => setIDNumber(e.target.value)}
                />
                <CustomForm.Phone
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                />
                <CustomForm.Email
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <CustomForm.UserName
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <CustomForm.Password
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <Button
                    value='Register Doctor'
                    onClick={submitDoctor}
                />
            </CustomForm>
            {message}
        </div>
    )
}

export default RegisterDoctor
