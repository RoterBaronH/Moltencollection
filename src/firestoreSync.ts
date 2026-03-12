import { db } from './firebase';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';

// Utility functions for binders, decks, collection

export async function getBinders(userId: string) {
  const bindersCol = collection(db, `users/${userId}/binders`);
  const snapshot = await getDocs(bindersCol);
  return snapshot.docs.map(doc => doc.data());
}

export async function saveBinder(userId: string, binderId: string, binderData: any) {
  const binderDoc = doc(db, `users/${userId}/binders/${binderId}`);
  await setDoc(binderDoc, binderData);
}

export async function getDecks(userId: string) {
  const decksCol = collection(db, `users/${userId}/decks`);
  const snapshot = await getDocs(decksCol);
  return snapshot.docs.map(doc => doc.data());
}

export async function saveDeck(userId: string, deckId: string, deckData: any) {
  const deckDoc = doc(db, `users/${userId}/decks/${deckId}`);
  await setDoc(deckDoc, deckData);
}

export async function getCollection(userId: string) {
  const collectionDoc = doc(db, `users/${userId}/collection/main`);
  const snapshot = await getDoc(collectionDoc);
  return snapshot.exists() ? snapshot.data() : null;
}

export async function saveCollection(userId: string, collectionData: any) {
  const collectionDocRef = doc(db, `users/${userId}/collection/main`);
  await setDoc(collectionDocRef, collectionData);
}
