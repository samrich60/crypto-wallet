// CRUD completo com Firebase Firestore
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const COLLECTION = 'carteira';

// CREATE — Adicionar moeda à carteira
export const addCoin = async (coin) => {
  const docRef = await addDoc(collection(db, COLLECTION), {
    coinId: coin.coinId,
    name: coin.name,
    symbol: coin.symbol,
    image: coin.image,
    quantidade: coin.quantidade,
    precoCompra: coin.precoCompra,
    nota: coin.nota || '',
    criadoEm: new Date().toISOString(),
  });
  return docRef.id;
};

// READ — Listar todas as moedas da carteira
export const getWallet = async () => {
  const q = query(collection(db, COLLECTION), orderBy('criadoEm', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// UPDATE — Atualizar quantidade ou nota de uma moeda
export const updateCoin = async (id, updates) => {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, { ...updates, atualizadoEm: new Date().toISOString() });
};

// DELETE — Remover moeda da carteira
export const deleteCoin = async (id) => {
  await deleteDoc(doc(db, COLLECTION, id));
};
