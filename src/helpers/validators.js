// /**
//  * @file Домашка по FP ч. 1
//  *
//  * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
//  * Эти функции/их аналоги есть и в ramda и в lodash
//  *
//  * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
//  * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
//  * удовлетворяет этим аргументам (возвращает true)
//  *
//  * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
//  *
//  * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
//  */

// // 1. Красная звезда, зеленый квадрат, все остальные белые.
// export const validateFieldN1 = ({star, square, triangle, circle}) => {
//     if (triangle !== 'white' || circle !== 'white') {
//         return false;
//     }

//     return star === 'red' && square === 'green';
// };

// // 2. Как минимум две фигуры зеленые.
// export const validateFieldN2 = () => false;

// // 3. Количество красных фигур равно кол-ву синих.
// export const validateFieldN3 = () => false;

// // 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
// export const validateFieldN4 = () => false;

// // 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
// export const validateFieldN5 = () => false;

// // 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
// export const validateFieldN6 = () => false;

// // 7. Все фигуры оранжевые.
// export const validateFieldN7 = () => false;

// // 8. Не красная и не белая звезда, остальные – любого цвета.
// export const validateFieldN8 = () => false;

// // 9. Все фигуры зеленые.
// export const validateFieldN9 = () => false;

// // 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
// export const validateFieldN10 = () => false;

import * as R from "ramda";


const isRed = R.equals("red");
const isGreen = R.equals("green");
const isWhite = R.equals("white");
const isBlue = R.equals("blue");
const isOrange = R.equals("orange");
const isNotWhite = R.complement(isWhite);
const isNotRed = R.complement(isRed);
const isNotWhiteOrRed = R.allPass([isNotWhite, isNotRed]);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = R.allPass([
    R.propSatisfies(isRed, "star"),
    R.propSatisfies(isGreen, "square"),
    R.propSatisfies(isWhite, "triangle"),
    R.propSatisfies(isWhite, "circle"),
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (colors) => {
    const greenCount = R.pipe(R.values, R.filter(isGreen), R.length)(colors);

    return greenCount >= 2;
};

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (colors) => {
    const allColors = R.values(colors);
    const redCount = R.filter(isRed, allColors).length;
    const blueCount = R.filter(isBlue, allColors).length;

    return redCount === blueCount;
};

//  4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = R.allPass([
    R.propEq("circle", "blue"),
    R.propEq("star", "red"),
    R.propEq("square", "orange"),
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = (colors) => {
    const colorCounts = R.countBy(R.identity, R.values(colors));
    const entries = R.toPairs(colorCounts); // [ [color, count], ... ]

    return entries.some(([color, count]) => color !== "white" && count >= 3);
};

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная.
// Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = (colors) => {
    const values = R.values(colors);
    const greenCount = R.filter(isGreen, values).length;
    const redCount = R.filter(isRed, values).length;

    const triangleIsGreen = isGreen(colors.triangle);

    return greenCount === 2 && triangleIsGreen && redCount === 1;
};

// 7. Все фигуры оранжевые.
export const validateFieldN7 = R.allPass([
    R.propEq("star", "orange"),
    R.propEq("square", "orange"),
    R.propEq("triangle", "orange"),
    R.propEq("circle", "orange"),
]);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = R.propSatisfies(isNotWhiteOrRed, "star");

// 9. Все фигуры зеленые.
export const validateFieldN9 = R.allPass([
    R.propEq("star", "green"),
    R.propEq("square", "green"),
    R.propEq("triangle", "green"),
    R.propEq("circle", "green"),
]);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = ({ triangle, square }) => triangle === square && triangle !== "white";
