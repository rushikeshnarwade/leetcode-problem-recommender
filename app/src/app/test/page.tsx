'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function TestPage() {
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const testFirestore = async () => {
      try {
        console.log('Testing Firestore connection...');
        const problemsRef = collection(db, 'problems');
        console.log('Collection reference:', problemsRef);
        
        const q = query(problemsRef, limit(5));
        const snapshot = await getDocs(q);
        console.log('Query result:', snapshot.docs.length, 'documents');
        
        const problemData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setProblems(problemData);
      } catch (error: any) {
        console.error('Firestore test error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    testFirestore();
  }, []);

  if (loading) {
    return <div className="p-8">Testing database connection...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Database Error</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Test Results</h1>
      <p className="mb-4">Found {problems.length} problems in database</p>
      
      {problems.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Sample Problems:</h2>
          <div className="space-y-2">
            {problems.map((problem, index) => (
              <div key={index} className="bg-gray-100 p-3 rounded">
                <div><strong>ID:</strong> {problem.id}</div>
                <div><strong>Title:</strong> {problem.title}</div>
                <div><strong>Slug:</strong> {problem.slug}</div>
                <div><strong>Difficulty:</strong> {problem.difficulty}</div>
                {problem.zerotracRating && (
                  <div><strong>Rating:</strong> {problem.zerotracRating}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}