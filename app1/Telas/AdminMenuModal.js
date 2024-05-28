import React, { useEffect, useState } from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminMenuModal = ({ visible, onClose, navigation }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const adminStatus = await AsyncStorage.getItem('isAdmin');
      setIsAdmin(JSON.parse(adminStatus));
    };

    checkAdminStatus();
  }, []);

  if (!isAdmin) return null;

  const navigateToScreen = (screen) => {
    onClose();
    setTimeout(() => {
      navigation.navigate(screen);
    }, 300); // Delay para garantir que o modal feche antes da navegação
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Admin Menu</Text>
          <Button title="Usuários" onPress={() => navigateToScreen('Usuarios')} />
          <Button title="Vagas" onPress={() => navigateToScreen('Vagas')} />
          <Button title="Fechar" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default AdminMenuModal;
