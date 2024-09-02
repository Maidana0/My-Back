import { HttpStatus } from "@nestjs/common";

export const today = new Date().getDay() - 1;

export function dateTime() {
    let currentDate = new Date();

    let year = currentDate.getFullYear();
    let month = String(currentDate.getMonth() + 1).padStart(2, '0');
    let day = String(currentDate.getDate()).padStart(2, '0');

    let localHours = String(currentDate.getHours()).padStart(2, '0');
    let minutes = String(currentDate.getMinutes()).padStart(2, '0');
    let seconds = String(currentDate.getSeconds()).padStart(2, '0');
    let milliseconds = String(currentDate.getMilliseconds()).padStart(3, '0');

    return `${year}-${month}-${day}T${localHours}:${minutes}:${seconds}.${milliseconds}Z|MATH-${Math.floor(Math.random() * 900000000) + 100000000}`
}

export interface IResponseMessage { message: string, success: boolean, httpStatus?: HttpStatus }

export const responseMessage = (success: boolean, message: string, httpStatus?: HttpStatus)
    : IResponseMessage => (
    { success, message, httpStatus }
)
