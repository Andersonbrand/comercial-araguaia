import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                name: String,
                price: Number,
                quantity: Number,
            },
        ],
        total: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
