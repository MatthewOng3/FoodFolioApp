import React from "react";
import {SvgXml} from "react-native-svg";

type Props = {
    svgContent: string;
    width: number;
    height: number;
};

function SvgComponent({svgContent, width, height}: Props) {
    return (
        <SvgXml
            xml={svgContent}
            width={width}
            height={height}
        />
    );
}

export default SvgComponent;
