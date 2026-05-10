import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { login } from '../services/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await login(email, password);
      global.token = res.data.accessToken;
      global.user = res.data.user;
      navigation.replace('Home');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Error al iniciar sesion');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SMOLSManager</Text>
      <Text style={styles.subtitle}>Social Media OnLine Shop</Text>
      
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f3f4f6' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', color: '#4f46e5' },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#6b7280', marginBottom: 40 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#d1d5db' },
  button: { backgroundColor: '#4f46e5', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' }
});
