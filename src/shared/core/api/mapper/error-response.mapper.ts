import type { ApiErrorResponseMapper } from "src/shared/core/api/interfaces/api-error-response-mapper.interface";
import { CustomError } from "src/shared/core/errors/custorm.error";
import { ErrorCodes } from "src/shared/core/errors/error-enum.error";
import type { FormattedErrorResponse } from "src/shared/core/interfaces/format-error-response.interface";
import type { ErrorCodesType } from "src/shared/core/types/error-codes.type";

export class ErrorResponseMapper implements ApiErrorResponseMapper {
    public validate(errorResponse: unknown): FormattedErrorResponse {
        if (typeof errorResponse === "object" && errorResponse !== null) {
            const record = errorResponse as Record<string, unknown>;

            const title = typeof record.title === "string" ? record.title : "Error";
            const detail = typeof record.detail === "string" ? record.detail : title;
            const status: ErrorCodesType =
                typeof record.status === "number" ? (record.status as ErrorCodesType) : ErrorCodes.INTERNAL_SERVER;

            if (record.errors && typeof record.errors === "object") {
                const errorsDict = record.errors as Record<string, Array<string>>;
                const firstKey = Object.keys(errorsDict)[0];
                const firstMessage = firstKey && errorsDict[firstKey]?.[0] ? errorsDict[firstKey][0] : detail;

                return {
                    statusCode: status,
                    error: title,
                    message: firstMessage,
                    path: firstKey ?? "unknown",
                };
            }

            return {
                statusCode: status,
                error: title,
                message: detail,
            };
        }

        throw CustomError.internalServer({
            message: "Error desconocido",
            path: "desconocido",
        });
    }
}
