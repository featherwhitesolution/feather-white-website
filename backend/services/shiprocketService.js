const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

let shiprocketToken = null;

const shiprocketApi = axios.create({
    baseURL: 'https://apiv2.shiprocket.in/v1/external',
});

// Middleware to attach token
shiprocketApi.interceptors.request.use(async (config) => {
    if (!shiprocketToken) {
        await loginShiprocket();
    }
    config.headers.Authorization = `Bearer ${shiprocketToken}`;
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 1. Authentication
const loginShiprocket = async () => {
    try {
        const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
            email: process.env.SHIPROCKET_EMAIL,
            password: process.env.SHIPROCKET_PASSWORD,
        });
        shiprocketToken = response.data.token;
        console.log('Shiprocket Login Successful');
        return shiprocketToken;
    } catch (error) {
        console.error('Shiprocket Login Failed:', error.response?.data || error.message);
        throw new Error('Shiprocket Authentication Failed');
    }
};

// 2. Serviceability & Rates
const checkServiceability = async (pickupPostcode, deliveryPostcode, weight, cod) => {
    try {
        const response = await shiprocketApi.get('/courier/serviceability/', {
            params: {
                pickup_postcode: pickupPostcode,
                delivery_postcode: deliveryPostcode,
                weight: weight,
                cod: cod,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Serviceability Check Failed:', error.response?.data || error.message);
        throw new Error('Failed to check serviceability');
    }
};

// 3. Order Creation
const createShiprocketOrder = async (orderData) => {
    try {
        // payload mapping
        const payload = {
            order_id: orderData._id.toString(),
            order_date: new Date().toISOString(),
            pickup_location: 'Primary', // Must match name in Shiprocket dashboard
            billing_customer_name: orderData.user?.name || 'Guest',
            billing_last_name: '',
            billing_address: orderData.shippingAddress.address,
            billing_city: orderData.shippingAddress.city,
            billing_pincode: orderData.shippingAddress.postalCode,
            billing_state: orderData.shippingAddress.state || 'State', // You need to add state to your address
            billing_country: orderData.shippingAddress.country,
            billing_email: orderData.user?.email || 'guest@example.com',
            billing_phone: orderData.shippingAddress.phone || '9999999999',
            shipping_is_billing: true,
            order_items: orderData.orderItems.map(item => ({
                name: item.name,
                sku: item.product.toString(),
                units: item.quantity,
                selling_price: item.price,
            })),
            payment_method: orderData.paymentMethod === 'Cash on Delivery' ? 'COD' : 'Prepaid',
            sub_total: orderData.totalPrice,
            length: 10, // Default dimensions, should come from product details
            breadth: 10,
            height: 10,
            weight: 0.5, // Total weight calculation needed
        };

        const response = await shiprocketApi.post('/orders/create/adhoc', payload);
        return response.data;
    } catch (error) {
        console.error('Shiprocket Order Creation Failed:', error.response?.data || error.message);
        throw new Error('Failed to create Shiprocket order');
    }
};

// 4. Label Generation
const generateLabel = async (shipmentId) => {
    try {
        const response = await shiprocketApi.post('/courier/generate/label', {
            shipment_id: [shipmentId],
        });
        return response.data;
    } catch (error) {
        console.error('Label Generation Failed:', error.response?.data || error.message);
        throw new Error('Failed to generate label');
    }
};

// 5. Tracking
const getTrackingData = async (shipmentId) => {
    try {
        const response = await shiprocketApi.get(`/courier/track/shipment/${shipmentId}`);
        return response.data;
    } catch (error) {
        console.error('Tracking Failed:', error.response?.data || error.message);
        throw new Error('Failed to fetch tracking data');
    }
};

module.exports = {
    loginShiprocket,
    checkServiceability,
    createShiprocketOrder,
    generateLabel,
    getTrackingData,
};
