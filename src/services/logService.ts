import { supabase } from '../lib/supabase';

export interface LogData {
  count: number;
  inputLength: number;
  outputLength: number;
}

export const getAppNames = async (): Promise<string[]> => {
  const { data, error } = await supabase.from('app_usage').select('app_name');
  if (error) {
    console.error('Error fetching app names:', error);
    throw new Error('앱 목록을 불러오는 중 오류가 발생했습니다.');
  }
  const uniqueAppNames = [...new Set(data.map((item) => item.app_name))];
  return uniqueAppNames;
};

export const getModels = async (appName: string): Promise<string[]> => {
  let query = supabase.from('app_usage').select('model');
  if (appName !== '전체') {
    query = query.eq('app_name', appName);
  }
  const { data, error } = await query;
  if (error) {
    console.error('Error fetching models:', error);
    throw new Error('모델 목록을 불러오는 중 오류가 발생했습니다.');
  }
  const uniqueModels = [...new Set(data.map((item) => item.model))];
  return uniqueModels;
};

export const getLogData = async (
  appName: string,
  model: string
): Promise<LogData> => {
  if (appName === '선택' || model === '선택') {
    return { count: 0, inputLength: 0, outputLength: 0 };
  }

  let query = supabase.from('app_usage').select('input, output');

  if (appName !== '전체') {
    query = query.eq('app_name', appName);
  }
  if (model !== '전체') {
    query = query.eq('model', model);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching log data:', error);
    throw new Error('로그 데이터를 불러오는 중 오류가 발생했습니다.');
  }

  const count = data.length;
  const inputLength = data.reduce(
    (acc, item) => acc + (item.input?.length || 0),
    0
  );
  const outputLength = data.reduce(
    (acc, item) => acc + (item.output?.length || 0),
    0
  );

  return { count, inputLength, outputLength };
};
