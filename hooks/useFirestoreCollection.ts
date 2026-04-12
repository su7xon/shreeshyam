import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, QueryConstraint } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export function useFirestoreCollection<T>(
  collectionName: string,
  ...queryConstraints: QueryConstraint[]
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, collectionName),
      orderBy('order', 'asc'), // default for banners
      ...queryConstraints
    );
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
        setData(docs);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, ...queryConstraints.map(c => c.toString())]);

  return { data, loading, error };
}

