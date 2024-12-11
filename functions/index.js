const functions = require("firebase-functions");
const { onDocumentCreated, onDocumentUpdated, onDocumentDeleted, onDocumentWritten } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

// Firestore Trigger for new user creation
exports.onUserCreate = onDocumentCreated("users/{userId}", (event) => {
    const snapshot = event.data;
    if (!snapshot) {
        console.log("No data associated with the event");
        return;
    }
    const values = snapshot.data();
    const timestamp = new Date().toISOString(); // Get the current timestamp in ISO format

    // send email or perform other actions
    return admin.firestore().collection('logging').add({
        description: `Email was sent to user with username:${values.username}`,
        timestamp: timestamp // Include the timestamp
    });
});

// Firestore Trigger for user updates
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

// Firestore Trigger for document deletion
exports.onUserDelete = onDocumentDeleted("users/{userId}", (event) => {
    const snap = event.data;
    if (!snap) {
        console.log("No data associated with the event");
        return;
    }
    const data = snap.data();

    // Perform your operations here
    console.log(`User with ID ${event.params.userId} and data ${JSON.stringify(data)} was deleted.`);
});

// Firestore Trigger for modifying a user document
exports.modifyUser = onDocumentWritten("users/{userId}", (event) => {
    // Get an object with the current document values.
    const document = event.data.after.data();

    // Get an object with the previous document values
    const previousValues = event.data.before.data();

    if (document && previousValues) {
        // Example: Log the modification
        console.log(`User document modified. User ID: ${event.params.userId}`);
        console.log('Current Values:', document);
        console.log('Previous Values:', previousValues);

        // Perform more operations here...
    } else {
        console.log("No document found for this event or it was deleted.");
    }
});


// Example function to list all products
exports.listProducts = functions.https.onCall(async (data, context) => {
    try {
        const productsSnapshot = await db.collection('products').get();
        const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Log the products
        functions.logger.log("Fetched Products:", products);

        return { success: true, data: products };
    } catch (error) {
        functions.logger.error("Error fetching products:", error);
        return { success: false, error: error.message };
    }
});

// Function to add a new product
exports.addProduct = functions.https.onCall((data, context) => {
    const { name, price } = data;

    // Input validation
    if (!name || typeof name !== 'string') {
        throw new functions.https.HttpsError('invalid-argument', 'The "name" field is required and must be a string.');
    }
    if (!price || typeof price !== 'number') {
        throw new functions.https.HttpsError('invalid-argument', 'The "price" field is required and must be a number.');
    }

    // Add the product
    const newProduct = {
        id: faker.datatype.uuid(),
        name,
        price,
    };

    console.log('Product added:', newProduct);
    return { message: 'Product added successfully', product: newProduct };
});

exports.TestingDeployment = functions.https.onRequest((req, res) => {
    res.json({ message: "Testing Deployment!" });
});

exports.Deployment = functions.https.onRequest((req, res) => {
    res.json({ message: "Testing Deployment!" });
});

exports.DeploymentCheck = functions.https.onRequest((req, res) => {
    res.json({ message: "Testing Deployment!" });
});

exports.Deployed = functions.https.onRequest((req, res) => {
    res.json({ message: "Testing Deployment!" });
});