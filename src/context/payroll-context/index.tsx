import React, { createContext, useContext, useState, useEffect } from 'react';
import { PayrollPeriod } from 'src/types/payroll';
import { payrollAPI } from 'src/api/payroll';

interface PayrollContextType {
  periods: PayrollPeriod[];
  activePeriod: PayrollPeriod | null;
  loading: boolean;
  error: string | null;
  fetchPeriods: () => Promise<void>;
  createPeriod: (data: Partial<PayrollPeriod>) => Promise<PayrollPeriod>;
  updatePeriod: (id: string, data: Partial<PayrollPeriod>) => Promise<PayrollPeriod>;
  deletePeriod: (id: string) => Promise<void>;
  setActivePeriod: (period: PayrollPeriod | null) => void;
}

const PayrollContext = createContext<PayrollContextType | undefined>(undefined);

export const PayrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [periods, setPeriods] = useState<PayrollPeriod[]>([]);
  const [activePeriod, setActivePeriod] = useState<PayrollPeriod | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPeriods = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await payrollAPI.listPayrollPeriods();
      setPeriods(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payroll periods');
    } finally {
      setLoading(false);
    }
  };

  const createPeriod = async (data: Partial<PayrollPeriod>) => {
    try {
      const newPeriod = await payrollAPI.createPayrollPeriod(data);
      setPeriods([...periods, newPeriod]);
      return newPeriod;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create payroll period';
      setError(errorMsg);
      throw err;
    }
  };

  const updatePeriod = async (id: string, data: Partial<PayrollPeriod>) => {
    try {
      const updatedPeriod = await payrollAPI.updatePayrollPeriod(id, data);
      setPeriods(periods.map(p => (p.id === id ? updatedPeriod : p)));
      if (activePeriod?.id === id) {
        setActivePeriod(updatedPeriod);
      }
      return updatedPeriod;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update payroll period';
      setError(errorMsg);
      throw err;
    }
  };

  const deletePeriod = async (id: string) => {
    try {
      await payrollAPI.deletePayrollPeriod(id);
      setPeriods(periods.filter(p => p.id !== id));
      if (activePeriod?.id === id) {
        setActivePeriod(null);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete payroll period';
      setError(errorMsg);
      throw err;
    }
  };

  // Fetch periods on mount
  useEffect(() => {
    fetchPeriods();
  }, []);

  const value: PayrollContextType = {
    periods,
    activePeriod,
    loading,
    error,
    fetchPeriods,
    createPeriod,
    updatePeriod,
    deletePeriod,
    setActivePeriod,
  };

  return (
    <PayrollContext.Provider value={value}>
      {children}
    </PayrollContext.Provider>
  );
};

export const usePayroll = () => {
  const context = useContext(PayrollContext);
  if (!context) {
    throw new Error('usePayroll must be used within a PayrollProvider');
  }
  return context;
};
