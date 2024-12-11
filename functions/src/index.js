const functions = require("firebase-functions");
const { onDocumentCreated,onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { faker } = require('@faker-js/faker');
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

// // Initialize products array
// const products = [];

// // Max number of products
// const LIMIT = 100;

// // Prepopulate products array with fake data
// for (let i = 0; i < LIMIT; i++) {
//     products.push({
//         id: faker.string.uuid(), // Unique identifier for each product
//         name: faker.commerce.productName(),
//         price: parseFloat(faker.commerce.price()), // Ensure price is a number
//     });
// }

// // Function to list all products
// exports.listProducts = functions.https.onCall(async (data, context) => {
//     try {
//         const productsSnapshot = await db.collection('products').get();
//         const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//         // Log the products
//         functions.logger.log("Fetched Products:", products);

//         return { success: true, data: products };
//     } catch (error) {
//         functions.logger.error("Error fetching products:", error);
//         return { success: false, error: error.message };
//     }
// });

// // Function to add a new product
// exports.addProduct = functions.https.onCall((data, context) => {
//     const { name, price } = data;

//     // Input validation
//     if (!name || typeof name !== 'string') {
//         throw new functions.https.HttpsError('invalid-argument', 'The "name" field is required and must be a string.');
//     }
//     if (!price || typeof price !== 'number') {
//         throw new functions.https.HttpsError('invalid-argument', 'The "price" field is required and must be a number.');
//     }

//     // Add the product
//     const newProduct = {
//         id: faker.datatype.uuid(),
//         name,
//         price,
//     };
//     products.push(newProduct);

//     console.log('Product added:', newProduct);
//     return { message: 'Product added successfully', product: newProduct };
// });

// // Example "helloFunction" to respond to HTTP requests
// exports.helloFunction = functions.https.onRequest((req, res) => {
//     res.json({ message: "Hello world from a serverless application." });
// });

// // Example "testFunction" to respond to HTTP requests
// exports.testFunction = functions.https.onRequest((req, res) => {
//     res.json({ message: "Hello testing from a serverless application." });
// });


// // Example "testFunction" to respond to HTTP requests
// exports.testDeployment = functions.https.onRequest((req, res) => {
//     res.status(200).send("Deployment check successful!");
// });

exports.CheckingDeployment = functions.https.onRequest((req, res) => {
    res.status(200).send("Deployment check successful!");
});



// exports.newUserTrigger = functions.auth.user().onCreate(async (user) => {
//     try {
//         // Log the new user's details
//         functions.logger.log("A new user signed in for the first time", user);

//         // Further processing can be done here
//         // For example, you could send a welcome email or update the user's profile

//         return null; // Indicate successful execution
//     } catch (error) {
//         functions.logger.error("Error processing new user:", error);
//         throw new functions.https.HttpsError('internal', 'Failed to process new user.');
//     }
// });




exports.onUserCreate = onDocumentCreated("users/{userId}", (event) => {
    // Get an object representing the document
    const snapshot = event.data;
    if (!snapshot) {
        console.log("No data associated with the event");
        return;
    }
    const values = snapshot.data();
    const timestamp = new Date().toISOString(); // Get the current timestamp in ISO format

    // send email or perform other actions
    // Example: Add a logging entry with timestamp
    return admin.firestore().collection('logging').add({
        description: `Email was sent to user with username:${values.username}`,
        timestamp: timestamp // Include the timestamp
    });
});


exports.onUserUpdate = onDocumentUpdated("users/{userId}", async (event) => {
    const after = event.data; // New document snapshot
    const before = event.data.previous; // Previous document snapshot

    if (!after || !before) {
        console.log("No data associated with the event");
        return;
    }

    const newValues = after.data();
    const previousValues = before.data();

    if (newValues.username !== previousValues.username) {
        const snapshot = await admin.firestore().collection('reviews')
            .where('username', '==', previousValues.username)
            .get();

        let updatePromises = [];

        snapshot.forEach(doc => {
            updatePromises.push(
                admin.firestore().collection('reviews').doc(doc.id).update({
                    username: newValues.username
                })
            );
        });

        await Promise.all(updatePromises);
    }
});






