export const sliceText = (text, n) => {
    if (text.length > n) {
        return `${text.slice(0, n)}....`;
    } else {
        return text;
    }
};
