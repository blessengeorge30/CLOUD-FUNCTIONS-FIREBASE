import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { getDatabase, ref, update } from 'firebase/database';
import Icon from 'react-native-vector-icons/MaterialIcons'; 

const PickedItem = ({ title, description, imageUrl, price, deleteProduct, id }) => {
    const [editMode, setEditMode] = useState(false); 
    const [updatedTitle, setUpdatedTitle] = useState(title);
    const [updatedDescription, setUpdatedDescription] = useState(description);
    const [updatedPrice, setUpdatedPrice] = useState(price);

    // Function to handle Firebase update
    const handleUpdate = () => {
        const db = getDatabase();
        const itemRef = ref(db, `items/${id}`);

        update(itemRef, {
            title: updatedTitle,
            description: updatedDescription,
            price: updatedPrice,
        })
            .then(() => {
                console.log('Item updated successfully');
                setEditMode(false); 
            })
            .catch((error) => {
                console.error('Error updating item:', error);
            });
    };

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                {imageUrl && (
                    <Image source={{ uri: imageUrl }} style={styles.image} />
                )}
                {/* Edit Icon */}
                <TouchableOpacity onPress={() => setEditMode(true)} style={styles.editIcon}>
                    <Icon name="edit" size={24} color="#fff"   />
                </TouchableOpacity>
            </View>
            <View style={styles.infoContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.description}>{description}</Text>
                </View>
                <Text style={styles.price}>${price}</Text>    
            </View>

            {/* Delete Button */}
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteProduct(id)}>
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>

            {/* Modal for Editing */}
            <Modal visible={editMode} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Item</Text>
                        <TextInput
                            style={styles.input}
                            value={updatedTitle}
                            onChangeText={setUpdatedTitle}
                            placeholder="Title"
                        />
                        <TextInput
                            style={styles.input}
                            value={updatedDescription}
                            onChangeText={setUpdatedDescription}
                            placeholder="Description"
                        />
                        <TextInput
                            style={styles.input}
                            value={String(updatedPrice)}
                            onChangeText={(text) => setUpdatedPrice(Number(text))}
                            placeholder="Price"
                            keyboardType="numeric"
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setEditMode(false)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 350,
        alignSelf: 'center',
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 10,
    },
    editIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 5,
        borderRadius: 15,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        color: '#555',
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'right',
        marginLeft: 10,
    },
    deleteButton: {
        marginTop: 10,
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 20, // More rounded corners for the iOS look
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 10, // Rounded corners for input fields
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    saveButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: 'gray',
        padding: 10,
        borderRadius: 5,
    },
    cancelButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default PickedItem;
