import React from 'react'
import { useEffect } from 'react'
import axios from "axios"
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { setCity } from '../redux/userSlice.js';

function useGetCity() {
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)
    const apiKey = import.meta.env.VITE_GEOAPIKEY

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            console.log(position)
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude
            const res = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`)
            // console.log(res.data.results[0].district)
            dispatch(setCity(res?.data?.results[0].district))
        })
    }, [])
}

export default useGetCity
