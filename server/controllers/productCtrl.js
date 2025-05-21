const Product = require("../models/productSchema");
const mongoose = require("mongoose");
const xss = require("xss");
const validator = require("validator");

const createProduct = async (req, res, next) => {
  try {
    const {
      title,
      description,
      totalPrice,
      sellingPrice,
      costPrice,
      category,
      sizes,
      fabricType,
      fitType,
      pattern,
      sleeveType,
      collarType,
      gender,
      color,
      stock,
      availableState,
      madeToOrder,
      popular,
      country,
      active,
      productCode,
      relatedProducts,
    } = req.body;

    const { images } = req.files;

    // Check for required fields
    if (!title)
      return res
        .status(400)
        .json({ success: false, message: "Title is required!" });
    if (!description)
      return res
        .status(400)
        .json({ success: false, message: "Description is required!" });
    if (!images || images.length === 0)
      return res
        .status(400)
        .json({ success: false, message: "At least one image is required!" });
    if (totalPrice === undefined)
      return res
        .status(400)
        .json({ success: false, message: "Total price is required!" });
    if (sellingPrice === undefined)
      return res
        .status(400)
        .json({ success: false, message: "Selling price is required!" });
    if (costPrice === undefined)
      return res
        .status(400)
        .json({ success: false, message: "Cost price is required!" });
    if (!category)
      return res
        .status(400)
        .json({ success: false, message: "Category is required!" });
    if (!fabricType)
      return res
        .status(400)
        .json({ success: false, message: "Fabric type is required!" });
    if (!fitType)
      return res
        .status(400)
        .json({ success: false, message: "Fit type is required!" });
    if (!pattern)
      return res
        .status(400)
        .json({ success: false, message: "Pattern is required!" });
    if (!gender)
      return res
        .status(400)
        .json({ success: false, message: "Gender is required!" });
    if (!color)
      return res
        .status(400)
        .json({ success: false, message: "Color is required!" });
    if (stock === undefined)
      return res
        .status(400)
        .json({ success: false, message: "Stock is required!" });
    if (!country)
      return res
        .status(400)
        .json({ success: false, message: "Country is required!" });
    if (!productCode)
      return res
        .status(400)
        .json({ success: false, message: "Product code is required!" });

    // Sanitize and escape inputs
    const sanitizedTitle = xss(validator.trim(validator.escape(title)));
    const sanitizedDescription = xss(
      validator.trim(validator.escape(description))
    );
    const sanitizedTotalPrice = validator.toFloat(totalPrice.toString());
    const sanitizedSellingPrice = validator.toFloat(sellingPrice.toString());
    const sanitizedCostPrice = validator.toFloat(costPrice.toString());
    const sanitizedCategory = xss(validator.trim(validator.escape(category)));
    const sanitizedSizes = sizes
      ? Array.isArray(sizes)
        ? sizes
        : JSON.parse(sizes)
      : [];
    const sanitizedFabricType = xss(
      validator.trim(validator.escape(fabricType))
    );
    const sanitizedFitType = xss(validator.trim(validator.escape(fitType)));
    const sanitizedPattern = xss(validator.trim(validator.escape(pattern)));
    const sanitizedSleeveType = sleeveType
      ? xss(validator.trim(validator.escape(sleeveType)))
      : null;
    const sanitizedCollarType = collarType
      ? xss(validator.trim(validator.escape(collarType)))
      : null;
    const sanitizedGender = xss(validator.trim(validator.escape(gender)));
    const sanitizedColor = xss(validator.trim(validator.escape(color)));
    const sanitizedStock = validator.toInt(stock.toString());
    const sanitizedAvailableState =
      availableState !== undefined
        ? validator.toBoolean(availableState.toString())
        : true;
    const sanitizedMadeToOrder =
      madeToOrder !== undefined
        ? validator.toBoolean(madeToOrder.toString())
        : false;
    const sanitizedPopular =
      popular !== undefined ? validator.toBoolean(popular.toString()) : false;
    const sanitizedCountry = xss(validator.trim(validator.escape(country)));
    const sanitizedActive = active
      ? xss(validator.trim(validator.escape(active)))
      : "active";
    const sanitizedProductCode = xss(
      validator.trim(validator.escape(productCode))
    );

    //upload images to cloudinary
    const imageUrls = [];
    // Normalize to always handle as array
    const imageArray = Array.isArray(images) ? images : [images];

    for (const image of imageArray) {
      const result = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: "products",
      });

      imageUrls.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    if (!imageUrls || imageUrls.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Image upload failed!" });
    }
    //create product
    const product = new Product({
      title: sanitizedTitle,
      description: sanitizedDescription,
      images: imageUrls,
      totalPrice: sanitizedTotalPrice,
      sellingPrice: sanitizedSellingPrice,
      costPrice: sanitizedCostPrice,
      category: sanitizedCategory,
      sizes: sanitizedSizes,
      fabricType: sanitizedFabricType,
      fitType: sanitizedFitType,
      pattern: sanitizedPattern,
      sleeveType: sanitizedSleeveType,
      collarType: sanitizedCollarType,
      gender: sanitizedGender,
      color: sanitizedColor,
      stock: sanitizedStock,
      availableState: sanitizedAvailableState,
      madeToOrder: sanitizedMadeToOrder,
      popular: sanitizedPopular,
      country: sanitizedCountry,
      active: sanitizedActive,
      productCode: sanitizedProductCode,
      relatedProducts: relatedProducts || [],
    });

    // Save the product to the database
    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully!",
      product: savedProduct.toJSON(),
    });
  } catch (err) {
    console.error("Error creating product:", err);
  
    if (err.name === "ValidationError") {
      // Provide detailed validation error messages
      const messages = Object.values(err.errors).map((e) => e.message).join(", ");
      return res.status(400).json({
        success: false,
        message: `Validation error: ${messages}`,
      });
    }
  
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

//edit product
const editProduct = async (req, res,next) => {
    try {
        const {productId} = req.params

        if(!productId) {
            return res.status(400).json({ success: false, message: "Product ID is required!" });
        }
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: "Invalid Product ID!" });
        }
        const existingProduct=await Product.findById(productId)
        if(!existingProduct) {
            return res.status(404).json({ success: false, message: "Product not found!" });
        }
        const {
            title, description, totalPrice, sellingPrice, costPrice, category, sizes, fabricType, fitType, pattern, sleeveType, collarType, gender, color, stock, availableState, madeToOrder, popular, country, active, productCode, relatedProducts, deleteImages
          } = req.body;
      
          if (title !== undefined && !title) return res.status(400).json({ success: false, message: 'Title is required!' });
          if (description !== undefined && !description) return res.status(400).json({ success: false, message: 'Description is required!' });
          if (Object.prototype.hasOwnProperty.call(req.body, 'totalPrice') && totalPrice < 0) return res.status(400).json({ success: false, message: 'Total price must be a positive number!' });
      
          const sanitizedData = {
            ...(title !== undefined && { title: xss(validator.trim(validator.escape(title))) }),
            ...(description !== undefined && { description: xss(validator.trim(validator.escape(description))) }),
            ...(Object.prototype.hasOwnProperty.call(req.body, 'totalPrice') && { totalPrice: validator.toFloat(totalPrice.toString()) }),
            ...(sellingPrice !== undefined && { sellingPrice: validator.toFloat(sellingPrice.toString()) }),
            ...(costPrice !== undefined && { costPrice: validator.toFloat(costPrice.toString()) }),
            ...(category && { category: xss(validator.trim(validator.escape(category))) }),
            ...(sizes && { sizes: Array.isArray(sizes) ? sizes : JSON.parse(sizes) }),
            ...(fabricType && { fabricType: xss(validator.trim(validator.escape(fabricType))) }),
            ...(fitType && { fitType: xss(validator.trim(validator.escape(fitType))) }),
            ...(pattern && { pattern: xss(validator.trim(validator.escape(pattern))) }),
            ...(sleeveType && { sleeveType: xss(validator.trim(validator.escape(sleeveType))) }),
            ...(collarType && { collarType: xss(validator.trim(validator.escape(collarType))) }),
            ...(gender && { gender: xss(validator.trim(validator.escape(gender))) }),
            ...(color && { color: xss(validator.trim(validator.escape(color))) }),
            ...(stock !== undefined && { stock: validator.toInt(stock.toString()) }),
            ...(availableState !== undefined && { availableState: validator.toBoolean(availableState.toString()) }),
            ...(madeToOrder !== undefined && { madeToOrder: validator.toBoolean(madeToOrder.toString()) }),
            ...(popular !== undefined && { popular: validator.toBoolean(popular.toString()) }),
            ...(country && { country: xss(validator.trim(validator.escape(country))) }),
            ...(active && { active: xss(validator.trim(validator.escape(active))) }),
            ...(productCode && { productCode: xss(validator.trim(validator.escape(productCode))) }),
            ...(relatedProducts && { relatedProducts }),
          };
          // 1. Handle image deletion
        if (deleteImages && deleteImages.length > 0) {
            for (const public_id of deleteImages) {
            await cloudinary.uploader.destroy(public_id);
            }
        
            sanitizedData.images = existingProduct.images.filter(
            (image) => !deleteImages.includes(image.public_id)
            );
        }
        
        // 2. Handle image upload
            if (req.files && req.files.images) {
            const imageUrls = [];
            const imageArray = Array.isArray(req.files.images)
            ? req.files.images
            : [req.files.images];
        
            for (const image of imageArray) {
            const result = await cloudinary.uploader.upload(image.tempFilePath, {
                folder: 'products',
            });
            imageUrls.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
            }
        
            sanitizedData.images = [
            ...(sanitizedData.images || []),
            ...imageUrls,
            ];
        }         
            // Validate the updated data
            if (Object.keys(sanitizedData).length === 0) {
                return res.status(400).json({ success: false, message: "No valid fields to update!" });
            }
            // Update the product
            const updatedProduct = await Product.findByIdAndUpdate(
                productId,
                { $set: sanitizedData },
                { new: true, runValidators: true }
            );
            if (!updatedProduct) {
                return res.status(404).json({ success: false, message: "Product not found!" });
            }
            res.status(200).json({ success: true, message: "Product updated successfully!", product: updatedProduct });
        

    } catch (err) {
        if (err.name === 'ValidationError') {
          return res.status(400).json({ success: false, message: Object.values(err.errors).map(e => e.message).join(', ') });
        }
        return next(err);
        
    }
}

