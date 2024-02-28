import {DependencyList, useEffect} from "react";

/**
 * An asynchronous version of useEffect
 *
 * @param effect The callback to be run
 * @param deps
 */
export const useEffectAsync = (
    effect: () => Promise<any>,
    deps?: DependencyList
): void => {
    useEffect(() => {
        (async () => {
            await effect();
        })();
    }, deps);
};
