import {BottomSheetMethods} from "@gorhom/bottom-sheet/lib/typescript/types";
import {MutableRefObject} from "react";

export const snapToIndex = (
    ref: MutableRefObject<BottomSheetMethods>,
    index: number
) => {
    ref.current.snapToIndex(index);
};
