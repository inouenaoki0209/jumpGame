// 足場抽選
export const stepColorChoiceRand = () => {
    const randValue = 3;
    return randBase(randValue);
};
// 足場の2次抽選
export const secondRand = () => {
    const randValue = 2;
    return randBase(randValue);
};
const randBase = (baseNum: number) => {
    return Math.floor(Math.random() * baseNum);
};