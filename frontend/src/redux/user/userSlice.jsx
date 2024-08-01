import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        tokenexpiration: '',
        idnumber: '',
        phone: '',
        email: '',
        username: '',
        doctor: false,
        admin: false,
    },
    reducers: {
        login: (state, action) => {
            console.log('from userslice', action.payload)
            const {
                idnumber,
                phone,
                email,
                username,
                doctor,
                admin,
                tokenexpiration,
            } = action.payload
            state.idnumber = idnumber
            state.phone = phone
            state.email = email
            state.username = username
            state.doctor = doctor
            state.admin = admin
            state.tokenexpiration = tokenexpiration
        },
        logout: state => {
            state.idnumber = ''
            state.phone = ''
            state.email = ''
            state.username = ''
            state.doctor = false
            state.admin = false
            state.tokenexpiration = ''
        },
    },
})

export const { login, logout } = userSlice.actions
export default userSlice.reducer
