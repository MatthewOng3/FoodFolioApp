import {useCallback, useState} from "react";

/**
 * @description Hook for using refresh control in flatlist
 * @param onRefreshCallback Callback function to be called on refresh
 */
const useRefresh = (onRefreshCallback: () => void) => {
    const [refreshing, setRefreshing] = useState(false);

    //
    const onRefresh = useCallback(() => {
        setRefreshing(true);

        //Call call back function
        onRefreshCallback();

        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, [onRefreshCallback]);

    return {refreshing, onRefresh};
};

export default useRefresh;
