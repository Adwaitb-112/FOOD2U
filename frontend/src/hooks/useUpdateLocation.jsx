import React from 'react'
import { useEffect } from 'react'
import axios from "axios"
import { useSelector } from 'react-redux'
import { serverUrl } from '../App.jsx'

function useUpdateLocation() {

    const { userData } = useSelector(state => state.user)

    useEffect(() => {
        const updateLocation = async (lat, lon) => {
            const result = await axios.post(`${serverUrl}/api/user/update-location`, { lat, lon }, { withCredentials: true })
        }
        navigator.geolocation.watchPosition((position) => {
            updateLocation(position.coords.latitude, position.coords.longitude)
        })
    }, [userData])
}

export default useUpdateLocation
