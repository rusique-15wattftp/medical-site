import { useEffect } from 'react'
import { makeGETrequest } from '../../utils/api'
import { useNavigate } from 'react-router-dom'
import './AdminPanel.css'

const AdminPanel = () => {
    const navigate = useNavigate()

    useEffect(() => {
        async function checkIfAdmin() {
            const res = await makeGETrequest(
                'http://localhost:5000/users/checkifloggedin',

                localStorage.getItem('token')
            )
            console.log(res)
            if (!res.admin) {
                navigate('/')
            }
        }

        checkIfAdmin()
    }, [navigate])

    return (
        <div className='adminpanel-container'>
            <div className='features'>
                <div className='feature'>
                    <h3>Register Doctor</h3>
                    <p>Register new doctors into the system.</p>
                    <a href='/registerdoctor'>Register Doctor</a>
                </div>
                <div className='feature'>
                    <h3>Search Doctor</h3>
                    <p>View and manage doctors.</p>
                    <a href='/searchdoctor'>View Doctors</a>
                </div>
            </div>
        </div>
    )
}

export default AdminPanel
