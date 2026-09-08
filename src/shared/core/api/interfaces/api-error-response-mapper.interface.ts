import type { FormattedErrorResponse } from "src/shared/core/interfaces/format-error-response.interface";

export interface ApiErrorResponseMapper {
    validate(errorResponse: unknown): FormattedErrorResponse;
}
