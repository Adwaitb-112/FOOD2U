import React from 'react'
import { useEffect } from 'react'
import axios from "axios"
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { setCurrentAddress, setCurrentCity, setCurrentState } from '../redux/userSlice.js';
import { setAddress, setLocation } from '../redux/mapSlice.js'

function useGetCity() {
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)
    const apiKey = import.meta.env.VITE_GEOAPIKEY

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude
            dispatch(setLocation({ lat: latitude, lon: longitude }))
            const res = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`)
            // console.log(res.data.results[0].district)
            dispatch(setCurrentCity(res?.data?.results[0].city || res?.data?.results[0].district))
            dispatch(setCurrentState(res?.data?.results[0].state))
            dispatch(setCurrentAddress(res?.data?.results[0].address_line2 || res?.data?.results[0].address_line1))
            dispatch(setAddress(res?.data?.results[0].address_line2))
            // console.log(res?.data?.results[0])
        })
    }, [userData])
}

export default useGetCity
