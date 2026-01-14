import useSWR from 'swr';
import { fetchDashboardOverview } from '../api/dashboard';
import { getLandRegistrations, searchLands } from '../api/auth';





export const useDashboardOverview = () => {
    const fetcher = fetchDashboardOverview;
    const {data, error, mutate} = useSWR('/user/dashboard-overview', () => fetcher(),
    {
        revalidateOnFocus: false,
    }
);

    return {
        data,
        error ,
        isLoading : !error && !data,
        mutate,
    };
}

export const useGetUserLands = ()=>{
    const fetcher = getLandRegistrations;
    const {data, error, mutate} = useSWR('/lands/get-user-lands', () => fetcher(),
    {
        revalidateOnFocus: false,
    }
);
    return {
        data,
        error ,
        isLoading: !error && !data,
        refetch: mutate,
    };

}

export const useLandSearch = (
  longitude?: number,
  latitude?: number
) => {
    const fetcher = searchLands(longitude!, latitude!);
  const shouldFetch =
    typeof longitude === "number" &&
    typeof latitude === "number";

  const { data, error, isLoading } = useSWR(
    shouldFetch
      ? `/lands/search-lands?longitude=${longitude}&latitude=${latitude}&radius=50`
      : null,
    () => fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    data,
    error,
    isLoading,
  };
};