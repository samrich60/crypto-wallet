import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  Alert, Animated, RefreshControl, Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getWallet, deleteCoin } from '../services/walletService';
import { formatCurrency } from '../services/cryptoApi';
import EditCoinModal from '../components/EditCoinModal';

export default function CarteiraScreen() {
  const [wallet, setWallet] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [editingCoin, setEditingCoin] = useState(null);

  // Animação: itens entram com fade ao carregar a carteira
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      loadWallet();
    }, [])
  );

  const loadWallet = async () => {
    try {
      const data = await getWallet();
      setWallet(data);
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível carregar a carteira.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleDelete = (id, name) => {
    Alert.alert(
      'Remover moeda',
      `Deseja remover ${name} da carteira?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            await deleteCoin(id);
            setWallet((prev) => prev.filter((c) => c.id !== id));
          },
        },
      ]
    );
  };

  const totalInvestido = wallet.reduce(
    (acc, c) => acc + (c.precoCompra * c.quantidade),
    0
  );

  const renderItem = ({ item }) => (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
      <Image source={{ uri: item.image }} style={styles.coinImg} />
      <View style={styles.cardInfo}>
        <Text style={styles.coinName}>{item.name}</Text>
        <Text style={styles.coinDetail}>
          {item.quantidade} {item.symbol?.toUpperCase()} × {formatCurrency(item.precoCompra)}
        </Text>
        {item.nota ? <Text style={styles.nota}>📝 {item.nota}</Text> : null}
        <Text style={styles.total}>
          Total: {formatCurrency(item.precoCompra * item.quantidade)}
        </Text>
      </View>
      <View style={styles.actions}>
        {/* UPDATE */}
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => setEditingCoin(item)}
        >
          <Text style={styles.editIcon}>✏️</Text>
        </TouchableOpacity>
        {/* DELETE */}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item.id, item.name)}
        >
          <Text style={styles.deleteIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💼 Minha Carteira</Text>
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total Investido</Text>
          <Text style={styles.totalValue}>{formatCurrency(totalInvestido)}</Text>
          <Text style={styles.coinCount}>{wallet.length} moeda(s)</Text>
        </View>
      </View>

      {wallet.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>Nenhuma moeda na carteira.</Text>
          <Text style={styles.emptyHint}>Vá ao Mercado e adicione sua primeira moeda!</Text>
        </View>
      ) : (
        <FlatList
          data={wallet}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); loadWallet(); }}
              tintColor="#F7A328"
            />
          }
        />
      )}

      <EditCoinModal
        visible={!!editingCoin}
        coin={editingCoin}
        onClose={() => setEditingCoin(null)}
        onSuccess={() => {
          setEditingCoin(null);
          loadWallet();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D', paddingHorizontal: 16 },
  header: { paddingTop: 60, paddingBottom: 16 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#F5F5F5', marginBottom: 16 },
  totalBox: {
    backgroundColor: '#1A1A1A', borderRadius: 16, padding: 18,
    borderWidth: 1, borderColor: '#F7A328',
  },
  totalLabel: { color: '#888', fontSize: 12 },
  totalValue: { color: '#F7A328', fontSize: 28, fontWeight: '800', marginTop: 4 },
  coinCount: { color: '#888', fontSize: 12, marginTop: 4 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1A1A1A', borderRadius: 14, padding: 14,
    marginBottom: 10, borderWidth: 1, borderColor: '#2A2A2A',
  },
  coinImg: { width: 42, height: 42, borderRadius: 21 },
  cardInfo: { flex: 1, marginLeft: 12 },
  coinName: { color: '#F5F5F5', fontWeight: '700', fontSize: 15 },
  coinDetail: { color: '#888', fontSize: 12, marginTop: 3 },
  nota: { color: '#F7A328', fontSize: 11, marginTop: 3 },
  total: { color: '#00C896', fontSize: 13, fontWeight: '600', marginTop: 4 },
  actions: { gap: 8 },
  editBtn: { padding: 6 },
  deleteBtn: { padding: 6 },
  editIcon: { fontSize: 18 },
  deleteIcon: { fontSize: 18 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { fontSize: 50, marginBottom: 12 },
  emptyText: { color: '#F5F5F5', fontSize: 18, fontWeight: '700' },
  emptyHint: { color: '#888', fontSize: 13, marginTop: 6, textAlign: 'center' },
});
