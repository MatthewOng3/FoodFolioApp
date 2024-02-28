import {Image} from "native-base";
import React, {useState} from "react";

type SkeletonImageProps = {
    uri: string;
    styleObject: object;
    height: string;
};

/**
 * @description Image component where it displays skeleton loading during image load
 * @param uri Uri of image
 * @param style object
 * @returns
 */
function SkeletonImage({uri, styleObject}: SkeletonImageProps) {
    const [, setImageLoading] = useState<boolean>(false);

    return (
        <>
            {/* {
            imageLoading && <Skeleton animation="wave" height={200} style={{borderRadius: 20}}/>
        } */}
            <Image
                style={styleObject}
                src={uri}
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
                alt="Restaurant Image"
            />
        </>
    );
}

export default SkeletonImage;
