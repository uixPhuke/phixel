const mongoose=require('mongoose')

const productSchema= new mongoose.Schema({
    productId:{
        type:String,
        default:() =>new mongoose.Types.ObjectId().toString(),
        ref:'Product',
        required:true,
        unique:true,
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000, // Limit to 2000 characters for performance
    },
    images: [{ type: String, required: true }], // Array of image URLs
    totalPrice: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0 },
    costPrice: { type: Number, required: true, min: 0 },
    category: {
        type: String,
        enum: ['tshirts', 'shirts', 'jeans', 'jackets', 'hoodies', 'dresses', 'skirts', 'shorts', 'pants', 'ethnic', 'formal', 'casual', 'activewear'],
        required: true,
        index: true,
    },
    sizes: {
        type: [String],
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        default: [],
    },
    fabricType: {
        type: String,
        required: true,
        index: true,
    },
    fitType: {
        type: String,
        enum: ['Slim Fit', 'Regular Fit', 'Loose Fit', 'Oversized'],
        required: true,
        index: true, 
    },
    pattern: {
        type: String,
        enum: ['Solid', 'Striped', 'Checked', 'Floral', 'Printed', 'Graphic', 'Abstract'],
        required: true,
    },
    sleeveType: {
        type: String,
        enum: ['Full Sleeve', 'Half Sleeve', 'Sleeveless', 'Cap Sleeve', 'Three-Quarter Sleeve'],
        required: false,
    },
    collarType: {
        type: String,
        enum: ['Round Neck', 'V Neck', 'Polo', 'Turtleneck', 'Collared', 'Mandarin Collar'],
        required: false,
    },
    gender: {
        type: String,
        enum: ['Men', 'Women', 'Unisex', 'Kids'],
        required: true,
        index: true,
    },
    color: {
        type: String,
        required: true,
        index: true,
    },
    stock: { type: Number, required: true },
    availableState: { type: Boolean, default: true, required: true },
    madeToOrder: { type: Boolean, default: false, required: true },
    popular: { type: Boolean, default: false, required: true },
    country: { type: String, required: true },
    active: {
        type: String,
        enum: ['freeze', 'active'],
        default: 'active',
        required: true,
    },
    productCode: {
        type: String,
        required: true,
        unique: true, // Ensure uniqueness
    },
    relatedProducts: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                default:[]
            },
        },
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

//indexing
// productSchema.index({ productId: 1, createdBy: 1 });
// productSchema.index({ productId: 1, updatedBy: 1 });
// productSchema.index({ createdAt: -1 });
// productSchema.index({ updatedAt: -1 });
// productSchema.index({ category: 1 });
// productSchema.index({ productCode: 1 });
// productSchema.index({ relatedProducts: 1 });
// productSchema.index({ availableState: 1 });
// productSchema.index({ active: 1 });
// productSchema.index({ popular: 1 });
// productSchema.index({ totalPrice: 1 });
// productSchema.index({ sellingPrice: 1 });
// productSchema.index({ costPrice: 1 });
// productSchema.index({ stock: 1 });
// productSchema.index({ color: 1 });
// productSchema.index({ fabricType: 1 });
// productSchema.index({ fitType: 1 });
// productSchema.index({ pattern: 1 });
// productSchema.index({ sleeveType: 1 });
// productSchema.index({ collarType: 1 });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;