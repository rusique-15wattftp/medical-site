import axios from 'axios'

export const makeGETrequest = async (url, token = '') => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching data:', error)
        return error
    }
}

export const makePOSTrequest = async (url, data, token = '') => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        const responseData = await response.json()
        console.log(responseData)
        return responseData
    } catch (error) {
        console.error('Error posting data:', error)
        return error
    }
}

export const makePOSTrequestForMultipleFormData = async (
    url,
    formData,
    token = ''
) => {
    try {
        // formData.forEach((value, key) => {
        //   console.log(key, value);
        // });
        // axios returns a data object on the response and we extract it using destructuring syntax below and data gives us data coming from backend
        const { data } = await axios.post(url, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        })

        console.log(data)
        return data
    } catch (error) {
        console.error('Error posting data:', error)
        return error.response.data
    }
}
