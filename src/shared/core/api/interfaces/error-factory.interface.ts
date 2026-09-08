import type { CustomError } from "src/shared/core/errors/custorm.error";
import type { FormattedErrorResponse } from "src/shared/core/interfaces/format-error-response.interface";
import type { ErrorCodesType } from "src/shared/core/types/error-codes.type";

export interface ApiErrorFactory {
    createError(statusCode: ErrorCodesType | number, error: FormattedErrorResponse): CustomError;
}
