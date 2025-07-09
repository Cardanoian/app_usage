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
  model: string,
  startDate: string,
  endDate: string
): Promise<LogData> => {
  if (appName === '선택' || model === '선택' || !startDate || !endDate) {
    return { count: 0, inputLength: 0, outputLength: 0 };
  }

  // 날짜 범위: 시작일 0시 0분 0초 ~ 종료일 23시 59분 59초
  const start = `${startDate}T00:00:00`;
  const end = `${endDate}T23:59:59.999999`;

  // 1. 전체 count만 별도로 가져오기
  let countQuery = supabase
    .from('app_usage')
    .select('*', { count: 'exact', head: true });

  if (appName !== '전체') {
    countQuery = countQuery.eq('app_name', appName);
  }
  if (model !== '전체') {
    countQuery = countQuery.eq('model', model);
  }
  countQuery = countQuery.gte('created_at', start).lte('created_at', end);

  const { count, error: countError } = await countQuery;

  if (countError) {
    console.error('Error fetching log count:', countError);
    throw new Error('로그 개수를 불러오는 중 오류가 발생했습니다.');
  }

  // 2. input/output 길이 집계용 데이터는 페이지네이션을 통해 전체 조회
  let totalInputLength = 0;
  let totalOutputLength = 0;
  let page = 0;
  const pageSize = 1000; // Supabase의 기본 제한이 1000

  while (true) {
    const from = page * pageSize;
    const to = from + pageSize - 1;

    let dataQuery = supabase
      .from('app_usage')
      .select('input, output')
      .gte('created_at', start)
      .lte('created_at', end)
      .range(from, to);

    if (appName !== '전체') {
      dataQuery = dataQuery.eq('app_name', appName);
    }
    if (model !== '전체') {
      dataQuery = dataQuery.eq('model', model);
    }

    const { data, error: dataError } = await dataQuery;

    if (dataError) {
      console.error('Error fetching log data:', dataError);
      throw new Error('로그 데이터를 불러오는 중 오류가 발생했습니다.');
    }

    if (!data || data.length === 0) {
      break; // 더 이상 데이터가 없으면 종료
    }

    totalInputLength += data.reduce(
      (acc, item) => acc + (item.input?.length || 0),
      0
    );
    totalOutputLength += data.reduce(
      (acc, item) => acc + (item.output?.length || 0),
      0
    );

    page++;
  }

  return {
    count: count ?? 0,
    inputLength: totalInputLength,
    outputLength: totalOutputLength,
  };
};
