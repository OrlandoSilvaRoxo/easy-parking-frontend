import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Modal, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import AdminMenuModal from './AdminMenuModal';

const Usuarios = ({ navigation }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [plate, setPlate] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [adminMenuVisible, setAdminMenuVisible] = useState(false);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('http://192.168.0.101:8443/user/get-all/');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const deleteUsuario = async (id) => {
    try {
      await axios.delete(`http://192.168.0.101:8443/user/delete/?id=${id}`);
      fetchUsuarios();
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
    }
  };

  const toggleAdminStatus = async (id) => {
    try {
      await axios.post(`http://192.168.0.101:8443/user/toggle-admin/?id=${id}`);
      fetchUsuarios();
    } catch (error) {
      console.error('Erro ao alterar status de administrador:', error);
    }
  };

  const saveUsuario = async () => {
    try {
      const payload = { name, lastName, phone, plate, email, password };
      await axios.put(`http://192.168.0.101:8443/user/update/?id=${selectedUser.id}`, payload);
      setModalVisible(false);
      fetchUsuarios();
    } catch (error) {
      console.error('Erro ao editar usuário:', error);
    }
  };

  const createUsuario = async () => {
    try {
      const payload = { name, lastName, phone, plate, email, password };
      await axios.post('http://192.168.0.101:8443/user/create/', payload);
      setRegisterModalVisible(false);
      fetchUsuarios();
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setName(user.name);
    setLastName(user.lastName);
    setPhone(user.phone);
    setPlate(user.plate);
    setEmail(user.email);
    setPassword(user.password);
    setModalVisible(true);
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Usuários</Text>
        <TouchableOpacity style={styles.button} onPress={() => setRegisterModalVisible(true)}>
          <FontAwesome name="user-plus" size={20} color="white" />
          <Text style={styles.buttonText}>Novo Usuário</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setAdminMenuVisible(true)}>
          <FontAwesome name="bars" size={20} color="white" />
          <Text style={styles.buttonText}>Menu Admin</Text>
        </TouchableOpacity>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Nome</Text>
          <Text style={styles.headerText}>Sobrenome</Text>
          <Text style={styles.headerText}>Telefone</Text>
          <Text style={styles.headerText}>Placa</Text>
          <Text style={styles.headerText}>Email</Text>
          <Text style={styles.headerText}>Ações</Text>
        </View>
        {usuarios.map((user) => (
          <View key={user.id} style={styles.userContainer}>
            <Text style={styles.userText}>{user.name}</Text>
            <Text style={styles.userText}>{user.lastName}</Text>
            <Text style={styles.userText}>{user.phone}</Text>
            <Text style={styles.userText}>{user.plate}</Text>
            <Text style={styles.userText}>{user.email}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.actionButton} onPress={() => openEditModal(user)}>
                <FontAwesome name="edit" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => deleteUsuario(user.id)}>
                <FontAwesome name="trash" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => toggleAdminStatus(user.id)}>
                <FontAwesome name={user.isAdmin ? "user-times" : "user-plus"} size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          animationType="slide"
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={[styles.modalTitle, { color: 'black' }]}>Editar Usuário</Text>
              <View style={styles.modalContent}>
                <Text style={styles.modalLabel}>Nome:</Text>
                <TextInput style={styles.input} placeholder="Nome" value={name} onChangeText={setName} />
              </View>
              <View style={styles.modalContent}>
                <Text style={styles.modalLabel}>Sobrenome:</Text>
                <TextInput style={styles.input} placeholder="Sobrenome" value={lastName} onChangeText={setLastName} />
              </View>
              <View style={styles.modalContent}>
                <Text style={styles.modalLabel}>Telefone:</Text>
                <TextInput style={styles.input} placeholder="Telefone" value={phone} onChangeText={setPhone} />
              </View>
              <View style={styles.modalContent}>
                <Text style={styles.modalLabel}>Placa:</Text>
                <TextInput style={styles.input} placeholder="Placa" value={plate} onChangeText={setPlate} />
              </View>
              <View style={styles.modalContent}>
                <Text style={styles.modalLabel}>Email:</Text>
                <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
              </View>
              <View style={styles.modalContent}>
                <Text style={styles.modalLabel}>Senha:</Text>
                <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
              </View>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={styles.modalButton} onPress={saveUsuario}>
                  <Text style={styles.modalButtonText}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          transparent={true}
          visible={registerModalVisible}
          onRequestClose={() => setRegisterModalVisible(false)}
          animationType="slide"
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={[styles.modalTitle, { color: 'black' }]}>Novo Usuário</Text>
              <View style={styles.modalContent}>
                <Text style={styles.modalLabel}>Nome:</Text>
                <TextInput style={styles.input} placeholder="Nome" value={name} onChangeText={setName} />
              </View>
              <View style={styles.modalContent}>
                <Text style={styles.modalLabel}>Sobrenome:</Text>
                <TextInput style={styles.input} placeholder="Sobrenome" value={lastName} onChangeText={setLastName} />
              </View>
              <View style={styles.modalContent}>
                <Text style={styles.modalLabel}>Telefone:</Text>
                <TextInput style={styles.input} placeholder="Telefone" value={phone} onChangeText={setPhone} />
              </View>
              <View style={styles.modalContent}>
                <Text style={styles.modalLabel}>Placa:</Text>
                <TextInput style={styles.input} placeholder="Placa" value={plate} onChangeText={setPlate} />
              </View>
              <View style={styles.modalContent}>
                <Text style={styles.modalLabel}>Email:</Text>
                <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
              </View>
              <View style={styles.modalContent}>
                <Text style={styles.modalLabel}>Senha:</Text>
                <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
              </View>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={styles.modalButton} onPress={createUsuario}>
                  <Text style={styles.modalButtonText}>Criar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={() => setRegisterModalVisible(false)}>
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <AdminMenuModal visible={adminMenuVisible} onClose={() => setAdminMenuVisible(false)} navigation={navigation} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    paddingBottom: 10,
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 10,
    width: '100%',
  },
  userText: {
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    flex: 1,
  },
  actionButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 5,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'white',
    marginBottom: 10,
    paddingHorizontal: 10,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'black',
  },
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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalContent: {
    marginBottom: 15,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 5,
    padding: 10,
    margin: 5,
    flex: 1,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
    marginLeft: 5,
  },
});

export default Usuarios;
