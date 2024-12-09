import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getDatabase, ref, update } from 'firebase/database';

const EditItemScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { productId, productData } = route.params;

  const [title, setTitle] = useState(productData.title);
  const [description, setDescription] = useState(productData.description);
  const [price, setPrice] = useState(productData.price);

  const handleUpdate = async () => {
    if (!title || !description || !price) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    try {
      const db = getDatabase();
      const productRef = ref(db, `items/${productId}`);
      await update(productRef, {
        title,
        description,
        price,
      });

      Alert.alert('Success', 'Product updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating product: ', error);
      Alert.alert('Error', 'Failed to update product. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Edit Product</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Product Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter Product Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Product Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  updateButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditItemScreen;
