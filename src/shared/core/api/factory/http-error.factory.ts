import type { ApiErrorFactory } from "src/shared/core/api/interfaces/error-factory.interface";
import { CustomError } from "src/shared/core/errors/custorm.error";
import { ErrorCodes } from "src/shared/core/errors/error-enum.error";
import type { FormattedErrorResponse } from "src/shared/core/interfaces/format-error-response.interface";
import type { ErrorCodesType } from "src/shared/core/types/error-codes.type";

type ErrorFactoryFn = (error: FormattedErrorResponse) => CustomError;

const DEFAULT_ERROR_PATH = "desconocido";

const statusCodeToErrorMap: Record<ErrorCodesType, ErrorFactoryFn> = {
    [ErrorCodes.BAD_REQUEST]: (error) => CustomError.badRequest({ payload: [error], path: error.path ?? DEFAULT_ERROR_PATH }),
    [ErrorCodes.UNAUTHORIZED]: (error) =>
        CustomError.unauthorized({ message: error.message, path: error.path ?? DEFAULT_ERROR_PATH }),
    [ErrorCodes.FORBIDDEN]: (error) => CustomError.forbidden({ message: error.message, path: error.path ?? DEFAULT_ERROR_PATH }),
    [ErrorCodes.NOT_FOUND]: (error) => CustomError.notFound({ message: error.message, path: error.path ?? DEFAULT_ERROR_PATH }),
    [ErrorCodes.CONFLICT]: (error) => CustomError.conflict({ message: error.message, path: error.path ?? DEFAULT_ERROR_PATH }),
    [ErrorCodes.INTERNAL_SERVER]: (error) =>
        CustomError.internalServer({ message: error.message, path: error.path ?? DEFAULT_ERROR_PATH }),
    [ErrorCodes.SERVICE_UNAVAILABLE]: (error) =>
        CustomError.serviceUnavailable({ message: error.message, path: error.path ?? DEFAULT_ERROR_PATH }),
};

export class HttpErrorFactory implements ApiErrorFactory {
    public createError(statusCode: ErrorCodesType | number, error: FormattedErrorResponse): CustomError {
        const errorFactory =
            statusCodeToErrorMap[statusCode as ErrorCodesType] ?? statusCodeToErrorMap[ErrorCodes.INTERNAL_SERVER];
        return errorFactory(error);
    }
}
