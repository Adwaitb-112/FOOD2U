import React, { useEffect, useState } from 'react'
import Nav from './Nav'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
import DeliveryBoyTracking from './DeliveryBoyTracking'
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom'

function DeliveryBoy() {

  const { userData, socket } = useSelector(state => state.user)
  const [availableAssignments, setAvailableAssignments] = useState(null)
  const [currentOrder, setCurrentOrder] = useState()
  const [showOtpBox, setShowOtpBox] = useState(false)
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null)
  const [otp, setOtp] = useState("")
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [otpSubmit, setOtpSubmit] = useState("")

  const getAssignment = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-assignment`, { withCredentials: true })
      setAvailableAssignments(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  const acceptOrder = async (assignmentId) => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/accept-order/${assignmentId}`, { withCredentials: true })
      await getCurrentOrder()
    } catch (error) {
      console.log(error)
    }
  }

  const sendOtp = async () => {
    setShowOtpBox(true)
    try {
      const result = await axios.post(`${serverUrl}/api/order/send-delivery-otp`, {
        orderId: currentOrder._id,
        shopOrderId: currentOrder.shopOrder._id
      }, { withCredentials: true })
      setShowOtpBox(true)
    } catch (error) {
      console.log(error)
    }
  }

  const verifyOtp = async () => {
    try {
      const result = await axios.post(`${serverUrl}/api/order/verify-delivery-otp`, {
        orderId: currentOrder._id,
        shopOrderId: currentOrder.shopOrder._id,
        otp
      }, { withCredentials: true })
      console.log(result)
      setOtpSubmit(result.data)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    setLoading(true)
    try {
      if (otpSubmit) {
        setLoading(false)
        navigate('/')
      }
    } catch (error) {
      console.log(error.message)
      setLoading(false)
    }
  }

  const getCurrentOrder = async (assignmentId) => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-current-order/`, { withCredentials: true })
      setCurrentOrder(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAssignment()
    getCurrentOrder()
  }, [userData])

  useEffect(() => {
    socket?.on('newAssignment', (data) => {
      if (data.sentTo == userData._id) {
        setAvailableAssignments(prev => [...prev, data])
      }
    })
    return () => {
      socket?.off('newAssignment')
    }
  }, [socket])

  useEffect(() => {
    if (!socket || userData.role !== "deliveryBoy") return
    let watchId
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition((position) => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        setDeliveryBoyLocation({ lat: latitude, lon: longitude })
        socket.emit('updateLocation', {
          latitude,
          longitude,
          userId: userData._id
        })
      }),
        (error) => {
          console.log(error)
        },
      {
        enableHighAccuracy: true
      }
    }
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [socket, userData])

  return (
    <div className='w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto'>
      <Nav />
      <div className='w-full max-w-[800px] flex flex-col gap-5 items-center'>
        <div className='bg-white rounded-2xl shadow-md p-5 flex justify-center flex-col gap-2 items-center w-[90%] border text-center border-orange-100'>
          <h1 className='text-xl font-bold text-[#ff4d2d]'>Welcome, {userData.fullName}</h1>
          <p className='text-[#ff4d2d] '><span className='font-semibold'>Latitude:</span> {deliveryBoyLocation?.lat}, <span className='font-semibold'>Longitude:</span> {deliveryBoyLocation?.lon}</p>
        </div>

        {!currentOrder &&
          <div className='bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100'>
            <h1 className='text-lg font-bold mb-4 flex items-center gap-2'>Available Orders</h1>
            <div className='space-y-4'>
              {availableAssignments?.length > 0 ? (
                availableAssignments.map((a, index) => (
                  <div key={index} className='border rounded-lg p-4 flex justify-between items-center'>
                    <div>
                      <p className='text-sm font-semibold'>{a?.shopName}</p>
                      <p className='text-sm text-gray-500'><span className='font-semibold'>Delivery Address:</span> {a?.deliveryAddress.text}</p>
                      <p className='text-xs text-gray-400'>{a.items.length} items | {a.subtotal}</p>
                    </div>
                    <button className="bg-[#ff4d2d] text-white px-5 sm:px-6 py-2 rounded-full font-medium shadow-md hover:bg-orange-600 transition-colors duration-200 cursor-pointer" onClick={() => acceptOrder(a.assignmentId)}>
                      Accept
                    </button>
                  </div>
                ))
              ) : (
                <p className='text-gray-400 text-sm'>No Available Orders</p>
              )}
            </div>
          </div>
        }
        {currentOrder && <div className='bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100'>
          <h2 className='text-lg font-bold mb-3'>📦 Current Order</h2>
          <div className='border rounded-lg p-4 mb-3'>
            <p className='font-semibold text-sm'>{currentOrder?.shopOrder.shop.name}</p>
            <p className='text-sm text-gray-500'>{currentOrder.deliveryAddress.text}</p>
            <p className='text-xs text-gray-400'>{currentOrder.shopOrder.shopOrderItems.length} items | {currentOrder.shopOrder.subtotal}</p>
          </div>
          <DeliveryBoyTracking data={{
            deliveryBoyLocation: deliveryBoyLocation || {
              lat: userData.location.coordinates[1],
              lon: userData.location.coordinates[0],
            },
            customerLocation: {
              lat: currentOrder.deliveryAddress.latitude,
              lon: currentOrder.deliveryAddress.longitude,
            }
          }} />
          {!showOtpBox ? <button className='mt-4 w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-green-600 active:scale-95 transition-all duration-200' onClick={sendOtp}>
            Mark As Delivered
          </button> : <div className='mt-4 p-4 border rounded-xl bg-gray-50'>
            <p className='text-sm font-semibold mb-2'>Enter Otp send to <span className='text-orange-500'>{currentOrder.user.fullName}</span></p>
            <form className='space-y-5' onSubmit={handleSubmit}>
              <input type="text" placeholder='Enter OTP' className='w-full border px-3 py-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400' onChange={(e) => setOtp(e.target.value)} value={otp} />
              <button className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all" onClick={verifyOtp} disabled={loading}>
                {loading ? <ClipLoader color='white' size={20} /> : "Submit OTP"}</button>
            </form>
          </div>}
        </div>}
      </div>
    </div>
  )
}

export default DeliveryBoy