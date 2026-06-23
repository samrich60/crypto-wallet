// Serviço de consumo da API CoinGecko (gratuita, sem necessidade de API key)
const BASE_URL = 'https://api.coingecko.com/api/v3';

export const fetchTopCoins = async (page = 1, perPage = 20) => {
  const response = await fetch(
    `${BASE_URL}/coins/markets?vs_currency=brl&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false`
  );
  if (!response.ok) throw new Error('Erro ao buscar moedas');
  return response.json();
};

export const fetchCoinDetails = async (coinId) => {
  const response = await fetch(
    `${BASE_URL}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
  );
  if (!response.ok) throw new Error('Erro ao buscar detalhes da moeda');
  return response.json();
};

export const searchCoins = async (query) => {
  const response = await fetch(`${BASE_URL}/search?query=${query}`);
  if (!response.ok) throw new Error('Erro na busca');
  const data = await response.json();
  return data.coins.slice(0, 10);
};

export const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatPercent = (value) => {
  if (value === null || value === undefined) return '0,00%';
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};
