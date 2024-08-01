import { useEffect } from 'react'
import { makeGETrequest } from '../../utils/api'
import { login, logout } from '../../redux/user/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { isTokenExpired } from '../../utils/isTokenExpired'
import { jwtDecode } from 'jwt-decode'
import './Header.css'

import { Link } from 'react-router-dom'

const Header = () => {
    const dispatch = useDispatch()
    const userSelector = useSelector(state => state.user)

    useEffect(() => {
        if (localStorage.getItem('token')) {
            console.log(333)
            const checkIfLoggedIn = async () => {
                const res = await makeGETrequest(
                    'http://localhost:5000/users/checkifloggedin',
                    localStorage.getItem('token')
                )
                console.log(res)

                if (res.status === 200 && res.admin === true) {
                    dispatch(
                        login({
                            username: 'admin',
                            admin: res.admin,
                            tokenexpiration: jwtDecode(
                                localStorage.getItem('token')
                            ).exp,
                        })
                    )
                }

                if (res.status === 200 && res.doctor === true) {
                    dispatch(
                        login({
                            idnumber: res.idnumber,
                            phone: res.phone,
                            email: res.email,
                            username: res.username,
                            doctor: res.doctor,
                            tokenexpiration: jwtDecode(
                                localStorage.getItem('token')
                            ).exp,
                        })
                    )

                    const dataUrl = `data:image/jpeg;base64,${res.image}`
                    localStorage.setItem('image', dataUrl)
                }
            }

            checkIfLoggedIn()
        }
    }, [dispatch, userSelector.username])

    function removeLocalStorageAndRedux() {
        localStorage.clear()
        dispatch(logout())
    }

    function checkIfTokenExpired() {
        if (isTokenExpired(localStorage.getItem('token'))) {
            removeLocalStorageAndRedux()
        }
    }

    return (
        <header className='header'>
            <nav className='navbar'>
                <img
                    src='/logo.svg'
                    className='App-logo'
                    alt='logo'
                />
                <ul className='nav-menu'>
                    <li className='nav-item'>
                        <Link
                            to='/'
                            onClick={checkIfTokenExpired}>
                            Home
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link
                            to='/about'
                            onClick={checkIfTokenExpired}>
                            About
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link
                            to='/searchpatient'
                            onClick={checkIfTokenExpired}>
                            Search
                        </Link>
                    </li>

                    {userSelector.username && (
                        <li className='nav-item'>
                            <Link
                                to='/profile'
                                onClick={checkIfTokenExpired}>
                                Profile
                            </Link>
                        </li>
                    )}

                    {userSelector.username ? (
                        <li className='nav-item'>
                            <Link
                                to='/'
                                onClick={removeLocalStorageAndRedux}>
                                SignOut
                            </Link>
                        </li>
                    ) : (
                        <li className='nav-item'>
                            <Link to='/signin'>Signin</Link>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    )
}

export default Header
