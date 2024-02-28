import BottomSheet, {BottomSheetBackdrop} from "@gorhom/bottom-sheet";
import React, {forwardRef, useCallback, useMemo} from "react";

type CustomBottomModalProps = {
    children: JSX.Element;
    closeFunc: () => void;
    snapIndex: number;
};

type Ref = BottomSheet;

/**
 * @description Custom bottom sheet
 * @param ref Bottom sheet reference
 * @param children Child jsx components
 * @param closeFunc Clean up function when bottom sheet closes
 * @param snapIndex Index in the snapPoints array to snap modal to
 * @returns
 */
const CustomBottomSheet = forwardRef<Ref, CustomBottomModalProps>(
    (props, ref) => {
        const snapPoints = useMemo(
            () => ["20%", "35%", "40%", "50%", "80%"],
            []
        );

        const renderBackdrop = useCallback(
            (backdropProps) => (
                <BottomSheetBackdrop
                    {...backdropProps}
                    disappearsOnIndex={-1}
                    appearsOnIndex={0}
                />
            ),
            []
        );

        function closeBottomSheet() {
            // @ts-expect-error current is an attribute but for some reason TS doesn't pick it up
            ref.current.close();
            props.closeFunc();
        }

        return (
            <BottomSheet
                ref={ref}
                enablePanDownToClose={true}
                index={-1}
                snapPoints={snapPoints}
                onClose={closeBottomSheet}
                backdropComponent={renderBackdrop}
                style={{borderRadius: 50}}
            >
                {props.children}
            </BottomSheet>
        );
    }
);

CustomBottomSheet.displayName = "CustomBottomSheet";
export default CustomBottomSheet;
