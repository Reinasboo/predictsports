'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store';

export const useMatchData = (matchId: string) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/matches/${matchId}`);
        if (!response.ok) throw new Error('Failed to fetch match');
        const json = await response.json();
        setData(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [matchId]);

  return { data, loading, error };
};

export const usePredictions = (matchId: string) => {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPredictions = async () => {
      const response = await fetch(`/api/predictions/${matchId}`);
      const json = await response.json();
      setPredictions(json.data);
      setLoading(false);
    };

    fetchPredictions();
  }, [matchId]);

  return { predictions, loading };
};

export const useLiveUpdates = (matchId: string) => {
  const { addUpdate } = useStore((state) => ({
    addUpdate: state.addLiveUpdate
  }));

  useEffect(() => {
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/live/${matchId}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      addUpdate(data);
    };

    return () => ws.close();
  }, [matchId, addUpdate]);
};

export const useConfidence = (matchId: string) => {
  const [confidence, setConfidence] = useState(null);

  useEffect(() => {
    const fetchConfidence = async () => {
      const response = await fetch(`/api/confidence/${matchId}`);
      const json = await response.json();
      setConfidence(json.data);
    };

    fetchConfidence();
  }, [matchId]);

  return confidence;
};
