/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from "../tools/api";

import {
    __,
    allPass,
    andThen,
    assoc,
    compose,
    gt,
    ifElse,
    length,
    lt,
    mathMod,
    otherwise,
    partial,
    prop,
    tap,
    test,
} from "ramda";

const api = new Api();

//  для валидации
const isLengthGtTwo = compose(gt(__, 2), length);
const isLengthLtTen = compose(lt(__, 10), length);
const isOnlyDigitsAndDot = test(/^[0-9]+(\.[0-9]+)?$/);

// Все условия валидации
const validate = allPass([isLengthGtTwo, isLengthLtTen, isOnlyDigitsAndDot]);

// преобразвания и API функции
const roundStringToNumber = compose(Math.round, Number);

const convertToBinaryParams = assoc("number", __, { from: 10, to: 2 });

const convertToBinary = compose(api.get("https://api.tech/numbers/base"), convertToBinaryParams);

const extractResult = prop("result");

const getStringLength = length;
const square = (x) => x ** 2;
const mod3ToString = compose(String, mathMod(__, 3));

const getAnimalById = (id) => api.get(`https://animals.tech/${id}`, {});

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
    const logValue = tap(writeLog);
    const onValidationError = partial(handleError, ["ValidationError"]);

    const runProcess = compose(
        otherwise(handleError),

        andThen(handleSuccess),

        // 7. Запрос животного
        andThen((id) =>
            getAnimalById(id).then((response) => {
                writeLog(" Animal API response: " + JSON.stringify(response));
                const result = response?.result;
                if (result) {
                    return result;
                }
                throw new Error("Invalid API response");
            })
        ),

        // 6. Остаток от деления на 3
        andThen(
            compose((value) => {
                writeLog(value);
                return value;
            }, mod3ToString)
        ),

        // 5. Квадрат длины
        andThen((result) => {
            const squared = square(result);
            writeLog(squared);
            return squared;
        }),

        // 4. Длина бинарной строки
        andThen((result) => {
            const len = getStringLength(result);
            writeLog(len);
            return len;
        }),

        // 3. Извлечение бинарной строки
        andThen((result) => {
            const binary = extractResult(result);
            writeLog(binary);
            return binary;
        }),

        // 2. Переход в API для перевода в бинарное
        convertToBinary,

        // 1. Округление и логгирование
        compose((x) => {
            const num = roundStringToNumber(x);
            writeLog(num);
            return num;
        }, logValue)
    );

    const processIfValid = ifElse(validate, runProcess, onValidationError);

    processIfValid(value);
};

export default processSequence;
