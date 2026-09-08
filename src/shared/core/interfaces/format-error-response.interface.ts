import type { ErrorCodesType } from "src/shared/core/types/error-codes.type";

export interface FormattedErrorResponse {
    statusCode?: ErrorCodesType;
    error?: string;
    message: string;
    path?: string; // Opcional para mapear el campo que falló en .NET
}
