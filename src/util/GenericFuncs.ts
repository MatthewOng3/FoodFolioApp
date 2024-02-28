/**
 * @description Conditional style function
 * @param condition Condition to check against
 * @param conditionalStyle Conditional Style object with the default style
 * @param defaultStyle Fallback Style
 */
export function conditionalStyling(
    condition: boolean,
    conditionalStyle: object,
    defaultStyle: object
) {
    return condition ? {...conditionalStyle, ...defaultStyle} : defaultStyle;
}
