import React from 'react'
import { FaMobileButton } from 'react-icons/fa6'
import { serverUrl } from '../App'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { updateOrdersStatus } from '../redux/userSlice'
import { useState } from 'react'

function OwnerOrderCard({ data }) {

    const dispatch = useDispatch()
    const [availableBoys, setAvailableBoys] = useState([])

    const handleUpdateStatus = async (orderId, shopId, status) => {
        try {
            const result = await axios.post(`${serverUrl}/api/order/update-status/${orderId}/${shopId}`, { status }, { withCredentials: true })
            dispatch(updateOrdersStatus({ orderId, shopId, status }))
            setAvailableBoys(result.data.availableBoys)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='bg-white rounded-lg shadow p-4 space-y-4'>
            <div>
                <h2 className='text-lg font-semibold text-gray-800'>{data.user.fullName}</h2>
                <p className='text-sm text-gray-500'>{data.user.email}</p>
                <p className='flex items-center gap-2 text-sm text-gray-600 mt-1'><FaMobileButton /><span>{data.user.mobile}</span></p>
                {data.paymentMethod == "online" ? <p className='gap-2 text-sm text-gray-600'>Payment: {data.payment ? "Done" : "Not Done"}</p> : <p className='gap-2 text-sm text-gray-600'>Payment Method: {data.paymentMethod}</p>}
            </div>
            <div className='flex items-start flex-col gap-2 text-gray-600 text-sm'>
                <p>{data?.deliveryAddress?.text}</p>
                <p className='text-xs text-gray-500'>Lat: {data?.deliveryAddress.latitude} , Lon: {data?.deliveryAddress.longitude}</p>
            </div>
            <div className='flex space-x-4 overflow-x-auto pb-2'>
                {data.shopOrders.shopOrderItems.map((item, index) => (
                    <div key={index} className='flex-shrink-0 w-40 border rounded-lg p-2 bg-white'>
                        <img src={item.item.image} alt="" className='w-full h-24 object-cover rounded' />
                        <p className='text-sm font-semibold mt-1'>{item.name}</p>
                        <p className='text-xs text-gray-500'>Qty: {item.quantity} x ₹{item.price}</p>
                    </div>
                ))}
            </div>
            <div className='flex justify-between items-center mt-auto pt-3 border-t border-gray-100'>
                <span className='text-sm'>Status: <span className='font-semibold capitalize text-[#ff4d2d]'>{data.shopOrders.status}</span></span>
                <select className='rounded-md border px-3 py-1 text-sm focus:outline-none focus:ring-2 text-[#ff4d2d] border-[#ff4d2d]' onChange={(e) => handleUpdateStatus(data._id, data.shopOrders.shop._id, e.target.value)}>
                    <option value="">Change</option>
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="out for delivery">Out for Delivery</option>
                </select>
            </div>

            {data.shopOrders.status == "out for delivery" &&
                <div className="mt-3 p-2 border rounded-lg text-sm bg-orange-50">
                    {data.shopOrders.assignedDeliveryBoy ? <p>Assigned Delivery Boy</p> : <p>Availabe Delivery Boys</p>}
                    {availableBoys.length > 0 ? (
                        availableBoys.map((b, index) => (
                            <div className=' text-gray-700'>{b.fullName} - {b.mobile}</div>
                        ))
                    ) : data.shopOrders.assignedDeliveryBoy ? <div>{data.shopOrders.assignedDeliveryBoy.fullName} - {data.shopOrders.assignedDeliveryBoy.mobile}</div> : <div>Waiting for availabe delivery Boys</div>}
                </div>}

            <div className='text-right font-bold text-gray-800 text-sm'>
                Total: ₹{data.shopOrders.subtotal}
            </div>
        </div>
    )
}

export default OwnerOrderCard
