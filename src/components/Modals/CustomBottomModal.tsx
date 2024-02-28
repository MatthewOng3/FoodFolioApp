import {BottomSheetBackdrop, BottomSheetModal} from "@gorhom/bottom-sheet";
import React, {forwardRef, useCallback, useMemo} from "react";

type CustomBottomModalProps = {
    children: JSX.Element;
    // ref: React.MutableRefObject<BottomSheetModalMethods> | null;
    closeFunc: () => void;
    snapIndex: number;
};

type Ref = BottomSheetModal;

/**
 * @description
 * @param
 * @returns
 */
const CustomBottomModal = forwardRef<Ref, CustomBottomModalProps>(
    (props, ref) => {
        const snapPoints = useMemo(
            () => ["20%", "25%", "35%", "40%", "50%", "80%"],
            []
        );

        const renderBackdrop = useCallback(
            (props) => (
                <BottomSheetBackdrop
                    {...props}
                    disappearsOnIndex={-1}
                    appearsOnIndex={1}
                />
            ),
            []
        );

        function onDismissFunc() {
            props.closeFunc();
        }

        return (
            <BottomSheetModal
                ref={ref}
                enablePanDownToClose={true}
                index={props.snapIndex}
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}
                enableDynamicSizing={true}
                style={{borderRadius: 50}}
                onDismiss={onDismissFunc}
            >
                {props.children}
            </BottomSheetModal>
        );
    }
);

CustomBottomModal.displayName = "CustomBottomModal";
export default CustomBottomModal;
