const Product = require("../models/productSchema");
const mongoose = require("mongoose");
const xss = require("xss");
const validator = require("validator");
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const createProductAdmin = async (req, res, next) => {
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
      // relatedProducts,
    } = req.body;

    //const { images } = req.files;
    const images = req.files;

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
    
    //existing Product id
    const existingproductID = req.body.productID;
    if (existingproductID && !mongoose.Types.ObjectId.isValid(existingproductID)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Product ID!" });}
    //existing product title
        const existingProduct = await Product.findOne({ title: sanitizedTitle });
        if (existingProduct) {
          return res
            .status(400)
            .json({ success: false, message: "Product with this title already exists!" });
        }
    //existing product code
    const existingProductCode = await Product.findOne({ productCode: sanitizedProductCode });
    if (existingProductCode) {
      return res
        .status(400)
        .json({ success: false, message: "Product with this code already exists!" });
    }

    //upload images to cloudinary
    const imageUrls = [];
    // Normalize to always handle as array
    const imageArray = Array.isArray(images) ? images : [images];

    for (const image of imageArray) {
      const result = await cloudinary.uploader.upload(image.path, {
        folder: "products",
      });
    
      imageUrls.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    
      fs.unlinkSync(image.path); // Clean up local file
    }
    
    if (!imageUrls || imageUrls.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Image upload failed!" });
    }
    // if (req.body.relatedProducts) {
    //   try {
    //     // Parse stringified JSON (if sent as a string)
    //     const parsedRelated = typeof req.body.relatedProducts === 'string' 
    //       ? JSON.parse(req.body.relatedProducts) 
    //       : req.body.relatedProducts;
    
    //     // Convert to schema format: [{ productID: ObjectId }]
    //     sanitizedRelatedProducts = parsedRelated.map(id => ({
    //       productID: new mongoose.Types.ObjectId(id) // Convert string to ObjectId
    //     }));
    //   } catch (err) {
    //     return res.status(400).json({
    //       success: false,
    //       message: "Invalid relatedProducts format. Expected array of product IDs."
    //     });
    //   }
    // }
    //validate Category
    const validCategories = [
      'tshirts', 'shirts', 'jeans', 'jackets', 'hoodies', 'dresses', 'skirts', 'shorts', 'pants', 'ethnic', 'formal', 'casual', 'activewear'
    ];
    if (!validCategories.includes(sanitizedCategory)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category!" });
    }
    //validate Sizes
    const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    if (sanitizedSizes.length > 0) {
      for (const size of sanitizedSizes) {
        if (!validSizes.includes(size)) {
          return res
            .status(400)
            .json({ success: false, message: `Invalid size: ${size}` });
        }
      }
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Sizes are required!" });
    }
    //validate Fabric Type
    // const validFabricTypes = [
    //   "Cotton",
    //   "Polyester",
    //   "Wool",
    //   "Silk",
    //   "Linen",
    //   "Denim",
    //   "Rayon",
    //   "Spandex",
    // ];
    // if (!validFabricTypes.includes(sanitizedFabricType)) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Invalid fabric type!" });
    // }
    //validate Fit Type
    const validFitTypes = ["Slim Fit", "Regular Fit", "Loose Fit", "Oversized"];
    if (!validFitTypes.includes(sanitizedFitType)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid fit type!" });
    }
    //validate Pattern
    const validPatterns = [
      "Solid",
      "Striped",
      "Checked",
      "Floral",
      "Printed",
      "Graphic",
      "Abstract",
    ];
    if (!validPatterns.includes(sanitizedPattern)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid pattern!" });
    }
    //validate Sleeve Type
    const validSleeveTypes = [
      "Full Sleeve",
      "Half Sleeve",
      "Sleeveless",
      "Cap Sleeve",
      "Three-Quarter Sleeve",
    ];  
    if (
      sanitizedSleeveType &&
      !validSleeveTypes.includes(sanitizedSleeveType)
    ) {
      return res  
        .status(400)
        .json({ success: false, message: "Invalid sleeve type!" });
    }
    //validate Collar Type
    const validCollarTypes = [
      "Round Neck",
      "V Neck",
      "Polo",
      "Turtleneck",
      "Collared",
      "Mandarin Collar",
    ];
    if (
      sanitizedCollarType &&
      !validCollarTypes.includes(sanitizedCollarType)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid collar type!" });
    } 
    //validate gender
    const validateGender=['Men', 'Women', 'Unisex', 'Kids']
    if(!validateGender.includes(sanitizedGender)) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'Invalid gender!',
        });
      }

      //validate positive stock
      if (sanitizedTotalPrice < 0 || sanitizedSellingPrice < 0   || sanitizedCostPrice < 0) {
        return res.status(400).json({
          success: false,
          message: 'Total price, selling price, labor, packaging, country tax, and cost price must be positive numbers!',
        });
      }
      // if (relatedProducts && !Array.isArray(relatedProducts)) {
      //   return res.status(400).json({ 
      //     success: false, 
      //     message: 'Related products should be an array of product codes!' 
      //   });
      // }
      
      // // With this more robust version:
      // let sanitizedRelatedProducts = [];
      // if (relatedProducts) {
      //   try {
      //     // Handle both stringified array and direct array input
      //     sanitizedRelatedProducts = typeof relatedProducts === 'string' 
      //       ? JSON.parse(relatedProducts) 
      //       : relatedProducts;
          
      //     // Ensure it's an array
      //     if (!Array.isArray(sanitizedRelatedProducts)) {
      //       throw new Error('Not an array');
      //     }
      //   } catch (err) {
      //     return res.status(400).json({
      //       success: false,
      //       message: "Related products must be an array of product codes (e.g., [\"CODE1\", \"CODE2\"])"
      //     });
      //   }
      // }
    
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
      // relatedProducts: sanitizedRelatedProducts,
    });

    // Save the product to the database
    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully!",
      product: savedProduct.toJSON(),
    });
  } catch (err) {
    console.error("Error creating product:", err); // Log full error with stack
  
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message).join(", ");
      return res.status(400).json({
        success: false,
        message: `Validation error: ${messages}`,
      });
    }
  
    // Return full error during development (optional: restrict in production)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,  // "fs is not defined", etc.
      stack: err.stack     // Shows where the error occurred
    });
  }
  
};

//edit product
const editProductAdmin = async (req, res,next) => {
    try {
      const productID = req.params.id;
      //const { id } = req.params; // Use req.params.id to get the product ID from the URL


        if(!productID) {
            return res.status(400).json({ success: false, message: "Product ID is required!" });
        }
        if (!mongoose.Types.ObjectId.isValid(productID)) {
            return res.status(400).json({ success: false, message: "Invalid Product ID!" });
        }
        const existingProduct=await Product.findById(productID)
        if(!existingProduct) {
            return res.status(404).json({ success: false, message: "Product not found!" });
        }
        const {
            title, description, totalPrice, sellingPrice, costPrice, category, sizes, fabricType, fitType, pattern, sleeveType, collarType, gender, color, stock, availableState, madeToOrder, popular, country, active, productCode,  deleteImages
          } = req.body;
      
          if (title !== undefined && !title) return res.status(400).json({ success: false, message: 'Title is required!' });
          if (description !== undefined && !description) return res.status(400).json({ success: false, message: 'Description is required!' });
          if (Object.prototype.hasOwnProperty.call(req.body, 'totalPrice') && totalPrice < 0) return res.status(400).json({ success: false, message: 'Total price must be a positive number!' });
          // if (relatedProducts && !Array.isArray(relatedProducts)) {
          //   return res.status(400).json({ success: false, message: 'Related products should be an array of product codes!' });
          // }
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
            //...(relatedProducts && { relatedProducts }),
          };
          // 1. Handle image deletion
        if (deleteImages && deleteImages.length > 0) {
          // Delete from Cloudinary
          await Promise.all(
              deleteImages.map(public_id => cloudinary.uploader.destroy(public_id))
          );
          
          // Update images array
          sanitizedData.images = existingProduct.images.filter(
              image => !deleteImages.includes(image.public_id)
          );
      }

      // 2. Handle new image uploads
      if (req.files && req.files.length > 0) {
          const uploadedImages = await Promise.all(
              req.files.map(async (image) => {
                  const result = await cloudinary.uploader.upload(image.path, {
                      folder: 'products'
                  });
                  // Clean up temp file
                  fs.unlinkSync(image.path);
                  return {
                      public_id: result.public_id,
                      url: result.secure_url
                  };
              })
          );

          // Merge existing (non-deleted) images with new ones
          sanitizedData.images = [
              ...(sanitizedData.images || existingProduct.images || []),
              ...uploadedImages
          ];
      }
            // Validate the updated data
            if (Object.keys(sanitizedData).length === 0) {
                return res.status(400).json({ success: false, message: "No valid fields to update!" });
            }
            // Update the product
            const updatedProduct = await Product.findByIdAndUpdate(
                productID,
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

//delete product
const deleteProductAdmin = async (req, res) => {
    try {
        const productID = req.params.productID;
    
        if (!productID) {
        return res.status(400).json({ success: false, message: "Product ID is required!" });
        }
    
        if (!mongoose.Types.ObjectId.isValid(productID)) {
        return res.status(400).json({ success: false, message: "Invalid Product ID!" });
        }
    
        const product = await Product.findById(productID);
    
        if (!product) {
        return res.status(404).json({ success: false, message: "Product not found!" });
        }
    
        // Delete images from Cloudinary
        for (const image of product.images) {
        await cloudinary.uploader.destroy(image.public_id);
        }
    
        // Delete the product from the database
        await Product.findByIdAndDelete(productID);
    
        res.status(200).json({ success: true, message: "Product deleted successfully!" });
    } catch (err) {
        console.error("Error deleting product:", err);
        return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
    }
    
}
//get all products
const getProductsAdmin = async (req, res) => {
    try {
        const products = await Product.find();
        if (!products || products.length === 0) {
            return res.status(404).json({ success: false, message: "No products found!" });
        }
        //sort products by createdAt in descending order
        const sortproducts=products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
       
        /* //apply pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalProducts = products.length;
        const totalPages = Math.ceil(totalProducts / limit);
        const paginatedProducts = products.slice(skip, skip + limit);
        if (page > totalPages) {
            return res.status(404).json({ success: false, message: "No more products available!" });
        }
        */


       /* // Apply currency conversion if needed
        const convertedProducts = sortproducts.map((product) => {
            const convertedPrice = product.sellingPrice * req.query.conversionRate; // Assuming conversionRate is passed in the query
            return {
                ...product.toObject(),
                totalPrice:(product.totalPrice * req.query.conversionRate).toFixed(2),
                sellingPrice: convertedPrice.toFixed(2),
                costPrice:(product.costPrice * req.query.conversionRate).toFixed(2),
              

            };})
             */ 

            res.status(200).json({
                success: true,
                message: "Products retrieved successfully!",
                products: sortproducts,
            });
        
    } catch (err) {
        console.error("Error fetching products:", err);
        return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
    }
}
//get Product
const getProductAdmin = async (req, res) => {
    try {
        const { productID } = req.params;

        if (!productID) {
            return res.status(400).json({ success: false, message: "Product ID is required!" });
        }

        if (!mongoose.Types.ObjectId.isValid(productID)) {
            return res.status(400).json({ success: false, message: "Invalid Product ID!" });
        }

        const product = await Product.findById(productID);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found!" });
        }

        /*// Convert price to the desired currency if needed
        const convertedProduct = {
            ...product.toObject(),
            totalPrice: (product.totalPrice * req.query.conversionRate).toFixed(2),
            sellingPrice: (product.sellingPrice * req.query.conversionRate).toFixed(2),
            costPrice: (product.costPrice * req.query.conversionRate).toFixed(2),
        };
        */
        res.status(200).json({
            success: true,
            message: "Product retrieved successfully!",
            product: product,
        });
    } catch (err) {
        console.error("Error fetching product:", err);
        return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
    }
}
//get all products
const getAllProducts = async (req, res, next) => {
    try {
      const {
        page = 1, limit = 10, search = '', category, gender, price, sort = 'newest', productCode,
      } = req.query;
  
      const offset = (page - 1) * limit;
  
      // Filters
      const filters = {};
      const regexOptions = 'i'; // Case-insensitive regex search for text fields
  
      if (search) {
        filters.$or = [
          { title: new RegExp(search, regexOptions) },
          { category: new RegExp(search, regexOptions) },
        ];
      }
      if (productCode) {
        filters.productCode = productCode;
      }
      if (price) {
        const priceRanges = price.split(',');  // Split the multiple price ranges
        const priceFilters = priceRanges.map(range => {
          const [minPrice, maxPrice] = range.split('-').map(Number);
          if (isNaN(minPrice) || (maxPrice && isNaN(maxPrice))) {
            return null;  // If invalid range, return null
          }
          return maxPrice
            ? { totalPrice: { $gte: minPrice, $lte: maxPrice } }
            : { totalPrice: { $lte: minPrice } };
        }).filter(Boolean); // Remove any invalid ranges
      
        // Combine the multiple price filters with OR logic
        if (priceFilters.length > 0) {
          filters.$or = priceFilters;
        }
      }
      if (category) {
        filters.category = { $in: category.split(',') };
      }
      if (gender) {
        filters.gender = { $in: gender.split(',') };
      }
  
      // Sorting
      let sortOptions = { createdAt: -1 }; // Default sort by newest
      if (sort === 'name') sortOptions = { title: 1 }; // Sort by name A-Z
      else if (sort === 'price') sortOptions = { sellingPrice: 1 }; // Sort by price from low to high
      else if (sort === 'oldest') sortOptions = { createdAt: 1 }; // Sort by oldest first
  
      // Query products and count total
      const productsQuery = Product.find(filters)
        .skip(offset)
        .limit(parseInt(limit, 10))
        .sort(sortOptions)
        .lean();
  
      const countQuery = Product.countDocuments(filters);
  
      const [products, count] = await Promise.all([productsQuery, countQuery]);
  
      // Format Products
      const formattedProducts = await Promise.all(products.map(async (product) => {
        // const relatedProducts = await Product.find({
        //   _id: { $in: product.relatedProducts || [] },
        // }).lean();
  
        const createdDate = new Date(product.createdAt);
        const formattedDate = createdDate.toISOString().split('T')[0].replace(/-/g, '');
        const uniqueId = `${product.title}${formattedDate}`;
  
        // Overwrite sellingPrice with the converted price
        //const convertedSellingPrice = (product.sellingPrice * req.conversionRate).toFixed(2);
        
        return {
          ...product,
          uniqueId,
          // relatedProducts: relatedProducts.map(rp => ({
          //   _id: rp._id,
          //   title: rp.title,
          //   images: rp.images,
          //   totalPrice: rp.sellingPrice,
          // })),
        };
      }));
  
      // Response
      res.status(200).json({
        success: true,
        message: 'Products fetched successfully!',
        products: formattedProducts,
        pagination: {
          total: count,
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          totalPages: Math.ceil(count / limit),
        },
      });
    } catch (err) {
      next(err);
    }
  };

  //get product 
  const getProduct = async (req, res, next) => {
    try {
      const { productID } = req.params;
  
      if (!productID) {
        return res.status(404).json({
          success: false,
          message: 'Invalid Product ID!',
        });
      }
  
      // Fetch the main product by ID
      const product = await Product.findById(productID);
  
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found!',
        });
      }
  
      // Fetch related products
      // const relatedProducts = await Product.find({
      //   _id: { $in: product.relatedProducts || [] },
      // });
  
      //const convertedSellingPrice = (product.sellingPrice * req.conversionRate).toFixed(2);
  
      res.status(200).json({
        success: true,
        message: 'Product fetched successfully!',
        product: {
          ...product.toObject(),
          //totalPrice: product.sellingPrice, // use sellingPrice directly as totalPrice
          // relatedProducts: relatedProducts.map(rp => ({
          //   _id: rp._id,
          //   title: rp.title,
          //   images: rp.images,
          //   sellingPrice: rp.sellingPrice,
          //   totalPrice: rp.sellingPrice, // consistent naming
          //   productCode: rp.productCode,
          // })),
        },
      });
    } catch (err) {
      return next(err);
    }
  };
//get all products by category 
const getProductsByCategory = async (req, res, next) => {
    try {
      const { category } = req.params;
  
      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Category is required!',
        });
      }
  
      // Fetch products by category
      const products = await Product.find({ category });
  
      if (!products || products.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No products found in this category!',
        });
      }
  
      // Format Products
      const formattedProducts = await Promise.all(products.map(async (product) => {
        // const relatedProducts = await Product.find({
        //   _id: { $in: product.relatedProducts || [] },
        // }).lean();
  
        const createdDate = new Date(product.createdAt);
        const formattedDate = createdDate.toISOString().split('T')[0].replace(/-/g, '');
        const uniqueId = `${product.title}${formattedDate}`;
  
        // Overwrite sellingPrice with the converted price
        //const convertedSellingPrice = (product.sellingPrice * req.conversionRate).toFixed(2);
        
        return {
          ...product,
          uniqueId,
          //totalPrice: convertedSellingPrice,
          //currency: req.currency,
          // relatedProducts: relatedProducts.map(rp => ({
          //   _id: rp._id,
          //   title: rp.title,
          //   images: rp.images,
          //   totalPrice: (rp.sellingPrice * req.conversionRate).toFixed(2),
          //   currency: req.currency,
          // })),
        };
      }));
  
      // Response
      res.status(200).json({
        success: true,
        message: 'Products fetched successfully!',
        products: formattedProducts,
      });
    } catch (err) {
      return next(err);
    }
  };  

  module.exports = {
    createProductAdmin,
    editProductAdmin,
    deleteProductAdmin,
    getProductsAdmin,
    getProductAdmin,
    getAllProducts,
    getProduct,
    getProductsByCategory
  };