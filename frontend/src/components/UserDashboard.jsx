import React, { useEffect, useRef, useState } from 'react'
import Nav from './Nav'
import { categories } from '../category'
import CategoryCard from './CategoryCard'
import { FaRegHandPointRight } from "react-icons/fa";
import { FaRegHandPointLeft } from "react-icons/fa";
import { useSelector } from 'react-redux';
import FoodCard from './FoodCard';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {

  const catScrollRef = useRef()
  const shopScrollRef = useRef()
  const [showLeftCatButton, setShowLeftCatButton] = useState(false)
  const [showRightCatButton, setShowRightCatButton] = useState(true)
  const [showLeftShopButton, setShowLeftShopButton] = useState(false)
  const [showRightShopButton, setShowRightShopButton] = useState(true)
  const { currentCity, shopsInMyCity, itemsInMyCity, searchItems } = useSelector(state => state.user)
  const [updatedItemsList, setUpdatedItemsList] = useState(itemsInMyCity)
  const navigate = useNavigate()

  const updateButton = (ref, setLeftButton, setRightButton) => {
    const element = ref.current
    if (element) {
      setLeftButton(element.scrollLeft > 0)
      setRightButton(element.scrollLeft + element.clientWidth < element.scrollWidth || element.clientWidth < element.scrollLeft)
    }
  }

  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction == "left" ? -200 : 200,
        behavior: "smooth"
      })
    }
  }
  const handleFilterCategory = (category) => {
    if (category == "All") {
      setUpdatedItemsList(itemsInMyCity)
    }
    else {
      const filteredItems = itemsInMyCity.filter(i => i.category === category)
      setUpdatedItemsList(filteredItems)
    }
  }

  useEffect(() => {
    if (catScrollRef.current) {
      catScrollRef.current.addEventListener('scroll', () => {
        updateButton(catScrollRef, setShowLeftCatButton, setShowRightCatButton)
      })
      shopScrollRef.current.addEventListener('scroll', () => {
        updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton)
      })
    }
  }, [])

  useEffect(() => {
    setUpdatedItemsList(itemsInMyCity)
  }, [itemsInMyCity])


  return (
    <div className='w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto'>
      <Nav />

      {searchItems && searchItems.length > 0 && (
        <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-5 bg-white shadow-md rounded-2xl mt-4'>
          <h1 className='text-gray-900 text-2xl sm:text-3xl font-semibold border-b border-gray-200 pb-2'>
            Search Results
          </h1>
          <div className='w-full h-auto flex flex-wrap gap-6 justify-center'>
            {searchItems.map((item) => (
              <FoodCard data={item} key={item._id} />
            ))}
          </div>
        </div>
      )}

      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className='text-gray-800 text-2xl sm:text-3xl'>Inspiration for your first order</h1>
        <div className='w-full relative'>
          {showLeftCatButton && <button className='absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10' onClick={() => scrollHandler(catScrollRef, "left")}>
            <FaRegHandPointLeft />
          </button>}
          <div className='w-full flex overflow-x-auto gap-4 pb-2' ref={catScrollRef}>
            {categories.map((cate, index) => (
              <CategoryCard name={cate.category} image={cate.image} key={index} onClick={() => handleFilterCategory(cate.category)} />
            ))}
          </div>
          {showRightCatButton && <button className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10' onClick={() => scrollHandler(catScrollRef, "right")}>
            <FaRegHandPointRight />
          </button>}
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className='text-gray-800 text-2xl sm:text-3xl'>Best Shop in {currentCity}</h1>
        <div className='w-full relative'>
          {showLeftShopButton && <button className='absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10' onClick={() => scrollHandler(shopScrollRef, "left")}>
            <FaRegHandPointLeft />
          </button>}
          <div className='w-full flex overflow-x-auto gap-4 pb-2' ref={shopScrollRef}>
            {shopsInMyCity?.map((shop, index) => (
              <CategoryCard name={shop.name} image={shop.image} key={index} onClick={() => navigate(`/shop/${shop._id}`)} />
            ))}
          </div>
          {showRightShopButton && <button className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10' onClick={() => scrollHandler(shopScrollRef, "right")}>
            <FaRegHandPointRight />
          </button>}
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className='text-gray-800 text-2xl sm:text-3xl'>Suggested Food Items</h1>
        <div className='w-full h-auto flex flex-wrap gap-[20px] justify-center'>
          {updatedItemsList?.map((item, index) => (
            <FoodCard key={index} data={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
