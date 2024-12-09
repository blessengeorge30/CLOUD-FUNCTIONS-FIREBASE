import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Dimensions,
  PixelRatio,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useEffect, useState } from 'react';
import ShoppingItem from '../components/ShoppingItem';
import PickedItem from '../components/PickedItem';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

import { db, collection, addDoc, getDocs, deleteDoc, doc } from '../firebase/index';


const { width, height } = Dimensions.get('window');

export default function App() {
  const [title, setTitle] = useState('');
  const [shoppingList, setShoppingList] = useState([]);
  const [productsList, setProductsList] = useState([]);

  const navigation = useNavigation();

  const AddScreen = () => {
    navigation.navigate('AddScreen');
  };

  const addShoppingItem = async () => {
    try {
      const docRef = await addDoc(collection(db, 'shopping'), {
        title: title,
        isChecked: false,
      });

      console.log('Document written with ID: ', docRef.id);
      setTitle('');
    } catch (e) {
      console.error('Error adding document: ', e);
    }
    getShoppingList();
  };

  const getShoppingList = async () => {
    const querySnapshot = await getDocs(collection(db, 'shopping'));
    const items = [];

    querySnapshot.forEach((doc) => {
      items.push({
        ...doc.data(),
        id: doc.id,
      });
    });

    setShoppingList(items);
  };

  const getProductsList = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const products = [];
      querySnapshot.forEach((doc) => {
        products.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      console.log(products);
      setProductsList(products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    getProductsList();
  }, []);

  const deleteShoppingList = async () => {
    const querySnapshot = await getDocs(collection(db, 'shopping'));
    const deletePromises = querySnapshot.docs.map((item) =>
      deleteDoc(doc(db, 'shopping', item.id))
    );
    await Promise.all(deletePromises);
    getShoppingList();
  };

  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setProductsList((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );

      console.log('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const refresh = navigation.getState().routes.find((route) => route.name === 'App')?.params?.refreshProducts;

      if (refresh) {
        getProductsList();
        navigation.setParams({ refreshProducts: false });
      }
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const auth = getAuth();  // Ensure you have initialized Firebase authentication
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigation.navigate('Login');
      }
    });

    return () => unsubscribe();  // Cleanup the listener when the component unmounts
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await signOut(getAuth());  // Sign out the user
      console.log('User logged out');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  useEffect(() => {
    getShoppingList();
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.headerview}>
          {/* Header Title */}
          <Text style={styles.heading}>FIREBASE-CRUD</Text>

          {/* Items Count and Delete */}
          <View style={styles.actionContainer}>
            <Text style={styles.noofitems}>{shoppingList.length} items</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={deleteShoppingList}
            >
              <MaterialIcons name="delete" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleLogout}>
              <Ionicons name="log-out" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Centered Shopping List */}
        <View style={styles.shoppingListContainer}>
          {shoppingList.length > 0 ? (
            <FlatList
              data={shoppingList}
              renderItem={({ item }) => (
                <ShoppingItem
                  title={item.title}
                  isChecked={item.isChecked}
                  id={item.id}
                  getShoppingList={getShoppingList}
                />
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF6768" />
              <Text style={styles.loadingText}>Loading your list...</Text>
            </View>
          )}

          <FlatList
            data={productsList}
            renderItem={({ item }) => (
              <PickedItem
                id={item.id}
                title={item.title}
                description={item.description}
                imageUrl={item.image}
                price={item.price}
                deleteProduct={deleteProduct}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button} onPress={AddScreen}>
            <Text style={styles.buttonText}>PICK YOUR ITEM </Text>
          </TouchableOpacity>
        </View>

        {/* Input */}
        <TextInput
          placeholder="Enter your item"
          style={styles.input}
          value={title}
          onChangeText={(text) => setTitle(text)}
          onSubmitEditing={addShoppingItem}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const responsiveFontSize = (fontSize) => {
  const scale = width / 375;
  return Math.round(PixelRatio.roundToNearestPixel(fontSize * scale));
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerview: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 12,
    backgroundColor: 'linear-gradient(90deg, #4CAF50, #2E7D32)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  heading: {
    fontSize: responsiveFontSize(20),
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 10,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noofitems: {
    fontSize: responsiveFontSize(14),
    color: '#000',
    fontWeight: '600',
    marginRight: 2,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 3,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6768',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
  },
  shoppingListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    width: '100%',
  },
  loadingText: {
    marginTop: 10,
    fontSize: responsiveFontSize(16),
    fontWeight: '500',
    color: '#555',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    fontSize: responsiveFontSize(16),
    borderRadius: 70,
    width: '90%',
    marginTop: 'auto',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '90%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#FF6768',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
    color: '#fff',
  },
});
