import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { db, doc, updateDoc, deleteDoc } from '../firebase/index';

const ShoppingItem = (props) => {
  const [isChecked, setIsChecked] = useState(props.isChecked);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(props.title); 

 
  const updateIsChecked = async () => { 
    const shoppingRef = doc(db, "shopping", props.id);
    await updateDoc(shoppingRef, {
      isChecked: isChecked,
    });
  };


  const updateTitle = async () => {
    const shoppingRef = doc(db, "shopping", props.id);
    try {
      await updateDoc(shoppingRef, {
        title: editedTitle,
      });
      setIsEditing(false); 
      props.getShoppingList(); 
    } catch (error) {
      console.error("Error updating title:", error);
    }
  };


  const deleteShoppingItem = async () => {
    await deleteDoc(doc(db, "shopping", props.id));
    props.getShoppingList();
  };


  useEffect(() => {
    updateIsChecked();
  }, [isChecked]);

  return (
    <View style={styles.container}>
      {/* Checkbox  */}
      <TouchableOpacity onPress={() => setIsChecked(!isChecked)}>
        {isChecked ? (
          <AntDesign name="checkcircle" size={24} color="white" />
        ) : (
          <AntDesign name="checkcircleo" size={24} color="white" />
        )}
      </TouchableOpacity>

      {/* Title or input field for editing */}
      {isEditing ? (
        <TextInput
          style={[styles.txt, styles.input]}
          value={editedTitle}
          onChangeText={setEditedTitle}
          onBlur={updateTitle} 
          returnKeyType="done"
          onSubmitEditing={updateTitle} 
        />
      ) : (
        <Text style={styles.txt}>{props.title}</Text>
      )}

      {/* Edit button */}
      {!isEditing && (
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(true)}
        >
          <MaterialIcons name="edit" size={24} color="white" />
        </TouchableOpacity>
      )}

      {/* Delete button */}
      <TouchableOpacity style={styles.delete} onPress={deleteShoppingItem}>
        <MaterialIcons name="delete" size={24} color="#FF6768" />
        {/* <MaterialCommunityIcons name="delete-alert" size={24} color="#FF6768" /> */}
      </TouchableOpacity>
    </View>
  );
};

export default ShoppingItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#282828",
    width: 360, 
    borderRadius: 10,
    padding: 13,
    alignItems: "center",
    marginTop: 15,
    marginHorizontal: 20,
    elevation:10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  txt: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
    marginHorizontal: 15,
    flex: 1,
  },
  input: {
    backgroundColor: "#fff",
    color: "#000",
    fontSize: 16,
    padding: 8,
    borderRadius: 8,
  },
  editButton: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  delete: {
    alignSelf: "flex-end",
    justifyContent: "center",
    padding: 2,
  },
});
