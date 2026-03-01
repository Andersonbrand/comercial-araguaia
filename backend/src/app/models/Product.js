import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        imageUrl: {
            type: String,
            required: false
        },

                category: {
            type: String,
            trim: true,
            default: null
        },

        description: {
            type: String,
            trim: true,
            default: null
        },


        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
