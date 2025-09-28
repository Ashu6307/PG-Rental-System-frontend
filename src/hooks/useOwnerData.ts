// src/hooks/useOwnerData.ts
import { useState, useEffect } from 'react';

interface OwnerData {
  // Add actual fields as per your backend response
  id?: string;
  name?: string;
  email?: string;
  notifications?: any[];
  stats?: {
    totalProperties?: number;
    totalTenants?: number;
    pendingPayments?: number;
    maintenanceRequests?: number;
    occupancyRate?: number;
    monthlyRevenue?: number;
  };
  // ...add more fields as needed
}

export default function useOwnerData() {
  const [ownerData, setOwnerData] = useState<OwnerData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Replace with actual API call
    async function fetchOwnerData() {
      try {
        // Example: fetch from backend
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/owner/data');
        if (!res.ok) throw new Error('Failed to fetch owner data');
        const data = await res.json();
        setOwnerData(data);
      } catch (err) {
  setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchOwnerData();
  }, []);

  return { ownerData, loading, error };
}
