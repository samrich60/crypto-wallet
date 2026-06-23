import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, TextInput, Animated, Image, RefreshControl,
} from 'react-native';
import { fetchTopCoins, formatCurrency, formatPercent } from '../services/cryptoApi';

export default function HomeScreen({ navigation }) {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  // Animação: header fade-in ao carregar
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadCoins();
  }, []);

  const loadCoins = async () => {
    try {
      const data = await fetchTopCoins(1, 50);
      setCoins(data);
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filtered = coins.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item, index }) => {
    const isPositive = item.price_change_percentage_24h >= 0;
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Detalhes', { coin: item })}
        activeOpacity={0.85}
      >
        <Image source={{ uri: item.image }} style={styles.coinImage} />
        <View style={styles.cardInfo}>
          <Text style={styles.coinName}>{item.name}</Text>
          <Text style={styles.coinSymbol}>{item.symbol.toUpperCase()}</Text>
        </View>
        <View style={styles.cardRight}>
          <Text style={styles.price}>{formatCurrency(item.current_price)}</Text>
          <Text style={[styles.change, { color: isPositive ? '#00C896' : '#FF4D6D' }]}>
            {formatPercent(item.price_change_percentage_24h)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F7A328" />
        <Text style={styles.loadingText}>Carregando mercado...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: headerAnim }]}>
        <Text style={styles.headerTitle}>🪙 Mercado</Text>
        <Text style={styles.headerSub}>Top criptomoedas por capitalização</Text>
      </Animated.View>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar moeda..."
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadCoins(); }} tintColor="#F7A328" />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D', paddingHorizontal: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0D0D0D' },
  loadingText: { color: '#888', marginTop: 12 },
  header: { paddingTop: 60, paddingBottom: 16 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#F5F5F5' },
  headerSub: { fontSize: 13, color: '#888', marginTop: 2 },
  searchInput: {
    backgroundColor: '#1A1A1A',
    color: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  coinImage: { width: 40, height: 40, borderRadius: 20 },
  cardInfo: { flex: 1, marginLeft: 12 },
  coinName: { color: '#F5F5F5', fontWeight: '600', fontSize: 15 },
  coinSymbol: { color: '#888', fontSize: 12, marginTop: 2 },
  cardRight: { alignItems: 'flex-end' },
  price: { color: '#F5F5F5', fontWeight: '700', fontSize: 14 },
  change: { fontSize: 12, marginTop: 4, fontWeight: '600' },
});
