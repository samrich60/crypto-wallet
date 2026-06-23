import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, Image, ActivityIndicator, Alert,
} from 'react-native';
import { fetchCoinDetails, formatCurrency, formatPercent } from '../services/cryptoApi';
import AddToWalletModal from '../components/AddToWalletModal';

export default function DetalhesScreen({ route, navigation }) {
  const { coin } = route.params;
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Animação: imagem pulsa suavemente (requisito de animação)
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadDetails();
    startPulse();
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  };

  const loadDetails = async () => {
    try {
      const data = await fetchCoinDetails(coin.id);
      setDetails(data);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível carregar os detalhes.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F7A328" />
      </View>
    );
  }

  const market = details?.market_data;
  const isPositive = market?.price_change_percentage_24h >= 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

        {/* Header com imagem animada */}
        <View style={styles.coinHeader}>
          <Animated.Image
            source={{ uri: details?.image?.large }}
            style={[styles.coinImage, { transform: [{ scale: pulseAnim }] }]}
          />
          <Text style={styles.coinName}>{details?.name}</Text>
          <Text style={styles.coinSymbol}>{details?.symbol?.toUpperCase()}</Text>
        </View>

        {/* Preço atual */}
        <View style={styles.priceBox}>
          <Text style={styles.priceLabel}>Preço Atual (BRL)</Text>
          <Text style={styles.priceValue}>{formatCurrency(market?.current_price?.brl)}</Text>
          <Text style={[styles.priceChange, { color: isPositive ? '#00C896' : '#FF4D6D' }]}>
            {formatPercent(market?.price_change_percentage_24h)} (24h)
          </Text>
        </View>

        {/* Estatísticas */}
        <View style={styles.statsGrid}>
          <StatCard label="Máxima 24h" value={formatCurrency(market?.high_24h?.brl)} />
          <StatCard label="Mínima 24h" value={formatCurrency(market?.low_24h?.brl)} />
          <StatCard label="Market Cap" value={formatCurrency(market?.market_cap?.brl)} />
          <StatCard label="Volume 24h" value={formatCurrency(market?.total_volume?.brl)} />
        </View>

        {/* Descrição */}
        {details?.description?.pt && (
          <View style={styles.descBox}>
            <Text style={styles.descTitle}>Sobre {details.name}</Text>
            <Text style={styles.descText} numberOfLines={5}>
              {details.description.pt.replace(/<[^>]+>/g, '')}
            </Text>
          </View>
        )}

        {/* Botão Adicionar à Carteira */}
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.addBtnText}>＋ Adicionar à Carteira</Text>
        </TouchableOpacity>
      </Animated.View>

      <AddToWalletModal
        visible={modalVisible}
        coin={coin}
        onClose={() => setModalVisible(false)}
        onSuccess={() => {
          setModalVisible(false);
          Alert.alert('✅ Sucesso', `${coin.name} adicionado à sua carteira!`);
        }}
      />
    </ScrollView>
  );
}

const StatCard = ({ label, value }) => (
  <View style={styles.statCard}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0D0D0D' },
  content: { padding: 20, paddingBottom: 40 },
  coinHeader: { alignItems: 'center', marginBottom: 24, paddingTop: 20 },
  coinImage: { width: 90, height: 90, borderRadius: 45, marginBottom: 12 },
  coinName: { color: '#F5F5F5', fontSize: 26, fontWeight: '800' },
  coinSymbol: { color: '#888', fontSize: 14, marginTop: 4 },
  priceBox: {
    backgroundColor: '#1A1A1A', borderRadius: 16, padding: 20,
    alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#2A2A2A',
  },
  priceLabel: { color: '#888', fontSize: 12, marginBottom: 6 },
  priceValue: { color: '#F7A328', fontSize: 32, fontWeight: '800' },
  priceChange: { fontSize: 16, fontWeight: '600', marginTop: 6 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  statCard: {
    backgroundColor: '#1A1A1A', borderRadius: 12, padding: 14,
    width: '47%', borderWidth: 1, borderColor: '#2A2A2A',
  },
  statLabel: { color: '#888', fontSize: 11, marginBottom: 6 },
  statValue: { color: '#F5F5F5', fontSize: 13, fontWeight: '700' },
  descBox: { backgroundColor: '#1A1A1A', borderRadius: 14, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#2A2A2A' },
  descTitle: { color: '#F7A328', fontWeight: '700', marginBottom: 8 },
  descText: { color: '#AAA', fontSize: 13, lineHeight: 20 },
  addBtn: {
    backgroundColor: '#F7A328', borderRadius: 14, padding: 16,
    alignItems: 'center', marginTop: 8,
  },
  addBtnText: { color: '#0D0D0D', fontWeight: '800', fontSize: 16 },
});
