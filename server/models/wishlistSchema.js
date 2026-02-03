const mongoose=require('mongoose')


const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    validate: {
      validator: async function(productID) {
        const product = await mongoose.model('Product').exists({ _id: productID });
        return product;
      },
      message: props => `Product ${props.value} doesn't exist`
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster queries
// wishlistSchema.index({ user: 1 });

// Update timestamp on save
wishlistSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
module.exports = Wishlist;