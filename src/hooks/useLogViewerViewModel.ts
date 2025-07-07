import { useState, useEffect, useCallback } from 'react';
import type { LogData } from '../services/logService';
import { getAppNames, getModels, getLogData } from '../services/logService';

export const useLogViewerViewModel = () => {
  const [appNames, setAppNames] = useState<string[]>(['선택', '전체']);
  const [selectedApp, setSelectedApp] = useState<string>('선택');
  const [models, setModels] = useState<string[]>(['선택']);
  const [selectedModel, setSelectedModel] = useState<string>('선택');
  const [logData, setLogData] = useState<LogData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 날짜 상태 및 핸들러 선언
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const handleStartDateChange = useCallback((date: string) => {
    setStartDate(date);
  }, []);
  const handleEndDateChange = useCallback((date: string) => {
    setEndDate(date);
  }, []);

  useEffect(() => {
    const fetchAppNames = async () => {
      try {
        setLoading(true);
        const names = await getAppNames();
        setAppNames(['선택', '전체', ...names]);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchAppNames();
  }, []);

  const handleAppChange = useCallback(async (appName: string) => {
    setSelectedApp(appName);
    setSelectedModel('선택');
    setLogData(null);
    setModels(['선택']);

    if (appName === '선택') return;

    try {
      setLoading(true);
      const modelList = await getModels(appName);
      setModels(['선택', '전체', ...modelList]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleModelChange = useCallback((modelName: string) => {
    setSelectedModel(modelName);
  }, []);

  // 조회 함수 명시적 분리
  const fetchLogData = useCallback(async () => {
    if (
      selectedApp === '선택' ||
      selectedModel === '선택' ||
      !startDate ||
      !endDate
    ) {
      setLogData(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getLogData(
        selectedApp,
        selectedModel,
        startDate,
        endDate
      );
      setLogData(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [selectedApp, selectedModel, startDate, endDate]);

  return {
    appNames,
    selectedApp,
    models,
    selectedModel,
    logData,
    loading,
    error,
    handleAppChange,
    handleModelChange,
    startDate,
    endDate,
    handleStartDateChange,
    handleEndDateChange,
    fetchLogData,
    setLogData, // 필요시 외부에서 초기화
  };
};
