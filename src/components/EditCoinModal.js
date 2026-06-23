import React, { useState, useEffect, useRef } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  StyleSheet, Animated, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { updateCoin } from '../services/walletService';

export default function EditCoinModal({ visible, coin, onClose, onSuccess }) {
  const [quantidade, setQuantidade] = useState('');
  const [nota, setNota] = useState('');
  const [loading, setLoading] = useState(false);

  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (coin) {
      setQuantidade(coin.quantidade?.toString() || '');
      setNota(coin.nota || '');
    }
  }, [coin]);

  const pressIn = () =>
    Animated.spring(btnScale, { toValue: 0.95, useNativeDriver: true }).start();
  const pressOut = () =>
    Animated.spring(btnScale, { toValue: 1, useNativeDriver: true }).start();

  const handleUpdate = async () => {
    if (!quantidade) {
      Alert.alert('Atenção', 'Informe a quantidade.');
      return;
    }
    setLoading(true);
    try {
      await updateCoin(coin.id, {
        quantidade: parseFloat(quantidade),
        nota,
      });
      onSuccess();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível atualizar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modal}>
          <Text style={styles.title}>Editar {coin?.name}</Text>

          <Text style={styles.label}>Nova Quantidade</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 1.5"
            placeholderTextColor="#555"
            keyboardType="decimal-pad"
            value={quantidade}
            onChangeText={setQuantidade}
          />

          <Text style={styles.label}>Nota</Text>
          <TextInput
            style={styles.input}
            placeholder="Atualize sua nota..."
            placeholderTextColor="#555"
            value={nota}
            onChangeText={setNota}
          />

          <Animated.View style={{ transform: [{ scale: btnScale }] }}>
            <TouchableOpacity
              style={styles.saveBtn}
              onPressIn={pressIn}
              onPressOut={pressOut}
              onPress={handleUpdate}
              disabled={loading}
            >
              <Text style={styles.saveBtnText}>
                {loading ? 'Salvando...' : '💾 Salvar Alterações'}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#1A1A1A', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 40,
  },
  title: { color: '#F5F5F5', fontSize: 20, fontWeight: '800', marginBottom: 20 },
  label: { color: '#888', fontSize: 12, marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: '#0D0D0D', color: '#F5F5F5', borderRadius: 12,
    padding: 14, fontSize: 15, borderWidth: 1, borderColor: '#2A2A2A',
  },
  saveBtn: {
    backgroundColor: '#F7A328', borderRadius: 14,
    padding: 16, alignItems: 'center', marginTop: 20,
  },
  saveBtnText: { color: '#0D0D0D', fontWeight: '800', fontSize: 16 },
  cancelBtn: { alignItems: 'center', marginTop: 14, padding: 8 },
  cancelText: { color: '#888', fontSize: 14 },
});
