import uploadOnCloudinary from "../utils/cloudinary.js";
import Shop from "../models/shop.model.js"

export const createAndEditShop = async (req, res) => {
    try {
        const { name, city, state, address } = req.body
        let image;
        if (req.file) {
            image = await uploadOnCloudinary(req.file.path)
        }
        let shop = Shop.findOne({ owner: req.userId })
        if (!shop) {
            shop = await Shop.create({
                name, city, state, address, image, owner: req.userId
            })
        } else {
            shop = await Shop.findByIdAndUpdate(shop._id, {
                name, city, state, address, image, owner: req.userId
            }, { new: true })
        }

        await shop.populate("owner")
        return res.status(201).json(shop)

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `create Shop error ${error}` })
    }
}

export const getMyShop = async (req, res) => {
    try {
        let shop = Shop.findOne({ owner: req.userId }).populate("owner items")
        if (!shop) {
            return null
        } 
        return res.status(201).json(shop)

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `get My Shop error ${error}` })
    }
}