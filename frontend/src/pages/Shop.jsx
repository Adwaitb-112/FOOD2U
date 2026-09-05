import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { serverUrl } from '../App'
import { useNavigate, useParams } from 'react-router-dom'
import { GiShop } from "react-icons/gi";
import { HiLocationMarker } from "react-icons/hi";
import { LuUtensils } from "react-icons/lu";
import FoodCard from '../components/FoodCard';
import { MdArrowBackIos } from 'react-icons/md'

function Shop() {

    const { shopId } = useParams()
    const [item, setItem] = useState([])
    const [shop, setshop] = useState([])
    const navigate = useNavigate()

    const getItemByShop = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/item/get-by-shop/${shopId}`, { withCredentials: true })
            setshop(result.data.shop)
            setItem(result.data.items)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getItemByShop()
    }, [shopId])

    return (
        <div className='min-h-screen bg-gray-50'>
            <div className='absolute top-4 left-4 z-20  cursor-pointer' onClick={() => navigate("/")}>
                <MdArrowBackIos size={35} className='text-[#ff4d2d]' />
            </div>
            {shop && <div className='relative w-full h-64 md:h-80 lg:h-96'>
                <img src={shop.image} alt="" className='w-full h-full object-cover' />
                <div className='absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 flex flex-col justify-center items-center text-center px-4'>
                    <GiShop className='text-white text-4xl mb-3 drop-shadow-lg' />
                    <h1 className='text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg'>{shop.name}</h1>
                    <div className='flex items-center gap-[10px]'>
                        <HiLocationMarker size={22} color='red' />
                        <p className='text-lg font-medium text-gray-200 mt-[10px] '>{shop.address}</p>
                    </div>
                </div>
            </div>}
            <div className='max-w-7xl mx-auto px-6 py-10'>
                <h2 className='flex items-center justify-center gap-3 text-3xl font-bold mb-10 text-gray-800'><LuUtensils color='red' /> Our Menu</h2>

                {item.length > 0 ? (
                    <div className='flex flex-wrap justify-center gap-8'>
                        {item.map((item, index) => (
                            <FoodCard data={item} key={index} />
                        ))}
                    </div>
                ) : <p className='text-center text-gray-500 text-lg'>No Items Available</p>}
            </div>
        </div>
    )
}

export default Shop