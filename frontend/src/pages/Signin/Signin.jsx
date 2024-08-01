import { useState } from 'react'
import CustomForm from '../../components/CustomForm/CustomForm'
import Button from '../../components/Button/Button'
import './Signin.css'
import { makePOSTrequest } from '../../utils/api'
import { useDispatch } from 'react-redux'
import { login } from '../../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'

const Signin = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const submitData = async e => {
        e.preventDefault()
        const res = await makePOSTrequest(
            'http://localhost:5000/users/signin',
            {
                email,
                password,
            }
        )

        if (res.status === 200) {
            localStorage.setItem('token', res.token)

            dispatch(
                login({
                    username: res.username,
                })
            )

            setTimeout(() => {
                navigate('/')
            }, 1500)
        }
        setMessage(res.message)
    }

    return (
        <div className='signin-container'>
            <h2>Sign In</h2>

            <CustomForm>
                <CustomForm.Email
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />

                <CustomForm.Password
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                <Button
                    onClick={submitData}
                    value='Sign In'
                />
            </CustomForm>
            {message}
        </div>
    )
}

export default Signin
