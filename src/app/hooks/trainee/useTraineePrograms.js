import useSWR from 'swr';
import { fetchTraineePrograms } from '../../apis/Trainee/TraineeProgramApi';

/**
 * SWR hook to get trainee enrolled programs.
 * @param {object} params - { pageNumber, pageSize, status }
 */
export function useTraineePrograms(params) {
  const key = ['trainee-programs', params];
  const { data, error, isLoading, mutate } = useSWR(key, () => fetchTraineePrograms(params));
  return {
    programs: data?.items || [],
    total: data?.totalCount || 0,
    loading: isLoading,
    error,
    mutate,
  };
}
