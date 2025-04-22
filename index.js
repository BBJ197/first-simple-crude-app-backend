import express from 'express';
import mongoose from 'mongoose';
import productRoute from './routes/product.route.js';

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// routes
app.use("/api/products", productRoute);


app.get('/', (req, res) => {
    res.send('BBJ');
});


mongoose.connect('mongodb+srv://beamlakbekele197:Beamlak%401998@cluster0.qsihwuu.mongodb.net/Abebe?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })

    .catch((err) => {
        console.error('Error connecting to MongoDB:', err.message);
    });