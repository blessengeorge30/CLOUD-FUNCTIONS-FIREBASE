import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ImageBackground, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome icons
import { auth, createUserWithEmailAndPassword } from '../firebase/index';

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  // Validation for email and password
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
    setEmail(email);
  };

  const validatePassword = (password) => {
    setIsPasswordValid(password.length >= 6);
    setPassword(password);
  };

  const handleSignUp = async () => {
    if (!isEmailValid || !isPasswordValid) {
      Alert.alert('Invalid Input', 'Please correct the errors before signing up.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('Signup successful');
      navigation.navigate('Crud'); // Redirect to Home screen
    } catch (error) {
      console.error('Signup failed:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top White Section */}
      <View style={styles.topSection}>
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : null}
        >
          <View style={styles.formContainer}>
            <Text style={styles.title}>Sign Up</Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#A9A9A9" // Grey placeholder text
                value={email}
                onChangeText={validateEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {email.length > 0 && ( // Only show the icon if email is not empty
                <FontAwesome
                  name={isEmailValid ? 'check-circle' : 'exclamation-circle'}
                  size={20}
                  color={isEmailValid ? 'green' : 'red'}
                  style={styles.icon}
                />
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#A9A9A9" // Grey placeholder text
                value={password}
                onChangeText={validatePassword}
                secureTextEntry
              />
              {password.length > 0 && ( // Only show the icon if password is not empty
                <FontAwesome
                  name={isPasswordValid ? 'check-circle' : 'exclamation-circle'}
                  size={20}
                  color={isPasswordValid ? 'green' : 'red'}
                  style={styles.icon}
                />
              )}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Already have an account? Login</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>

      {/* Bottom Section with Background Image */}
      <ImageBackground
        source={require('../assets/bg.png')} // Path to your background image
        style={styles.backgroundImage}
      />
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    flex: 7, // Take 70% of the screen height
    backgroundColor: '#FFF', // White background for the top part
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  formContainer: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Transparent white background
    padding: 20,
    borderRadius: 15,
    marginHorizontal: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  input: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    color: '#000',
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white background
    borderColor: 'rgba(0, 0, 0, 0.2)', // Subtle border for better visibility
    borderWidth: 1,
  },
  icon: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#FF3B30', // Red color for the button
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 15,
    elevation: 3,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
  link: {
    marginTop: 15,
    textAlign: 'center',
    color: '#FF3B30', // Red for the link text
    fontWeight: '500',
  },
  backgroundImage: {
    position: 'absolute', // Make the background image absolute
    bottom: -300, // Position it at the very bottom of the screen
    left: 0,
    right: 0,
    height: '62%', // 30% of the screen height
    width: '100%',
  },
});
