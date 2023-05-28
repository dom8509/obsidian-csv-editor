export const min2 = (val1: number, val2: number) => {
    return val1 <= val2 ? val1 : val2;
}

export const min3 = (val1: number, val2: number, val3: number) => {
    const minValue = min2(val1, val2);
    return minValue <= val3 ? minValue : val3;
}

export const max2 = (val1: number, val2: number) => {
    return val1 >= val2 ? val1 : val2;
}

export const max3 = (val1: number, val2: number, val3: number) => {
    const maxValue = max2(val1, val2);
    return maxValue >= val3 ? maxValue : val3;
}