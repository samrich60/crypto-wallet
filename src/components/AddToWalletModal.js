import React, { useState, useRef } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  StyleSheet, Animated, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { addCoin } from '../services/walletService';

export default function AddToWalletModal({ visible, coin, onClose, onSuccess }) {
  const [quantidade, setQuantidade] = useState('');
  const [precoCompra, setPrecoCompra] = useState(
    coin?.current_price?.toString() || ''
  );
  const [nota, setNota] = useState('');
  const [loading, setLoading] = useState(false);

  // Animação: botão com escala ao pressionar
  const btnScale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(btnScale, { toValue: 0.95, useNativeDriver: true }).start();
  const pressOut = () =>
    Animated.spring(btnScale, { toValue: 1, useNativeDriver: true }).start();

  const handleAdd = async () => {
    if (!quantidade || !precoCompra) {
      Alert.alert('Atenção', 'Preencha quantidade e preço de compra.');
      return;
    }
    setLoading(true);
    try {
      await addCoin({
        coinId: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image,
        quantidade: parseFloat(quantidade),
        precoCompra: parseFloat(precoCompra),
        nota,
      });
      setQuantidade('');
      setNota('');
      onSuccess();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível adicionar a moeda.');
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
          <Text style={styles.title}>Adicionar {coin?.name}</Text>

          <Text style={styles.label}>Quantidade</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 0.5"
            placeholderTextColor="#555"
            keyboardType="decimal-pad"
            value={quantidade}
            onChangeText={setQuantidade}
          />

          <Text style={styles.label}>Preço de Compra (BRL)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 320000"
            placeholderTextColor="#555"
            keyboardType="decimal-pad"
            value={precoCompra}
            onChangeText={setPrecoCompra}
          />

          <Text style={styles.label}>Nota (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Compra de longo prazo"
            placeholderTextColor="#555"
            value={nota}
            onChangeText={setNota}
          />

          <Animated.View style={{ transform: [{ scale: btnScale }] }}>
            <TouchableOpacity
              style={styles.addBtn}
              onPressIn={pressIn}
              onPressOut={pressOut}
              onPress={handleAdd}
              disabled={loading}
            >
              <Text style={styles.addBtnText}>
                {loading ? 'Salvando...' : '＋ Adicionar'}
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
  addBtn: {
    backgroundColor: '#F7A328', borderRadius: 14,
    padding: 16, alignItems: 'center', marginTop: 20,
  },
  addBtnText: { color: '#0D0D0D', fontWeight: '800', fontSize: 16 },
  cancelBtn: { alignItems: 'center', marginTop: 14, padding: 8 },
  cancelText: { color: '#888', fontSize: 14 },
});
