import React, {memo, useState} from "react";
import {ActivityIndicator, Image, ImageProps} from "react-native";

interface CustomImageProps extends ImageProps {}

function CustomImage(props: CustomImageProps) {
    const [imageLoading, setImageLoading] = useState<boolean>(true);

    return (
        <>
            {imageLoading && <ActivityIndicator size="large" />}
            <Image
                {...props}
                style={{
                    ...(props.style as object),
                    opacity: imageLoading ? 0 : 100
                }}
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
                alt={"Restaurant Image"}
            />
        </>
    );
}

export default memo(CustomImage);
