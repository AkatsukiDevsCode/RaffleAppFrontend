export interface FormattedErrorResponse {
    statusCode?: number;
    error?: string;
    message: string;
    path?: string; // Opcional para mapear el campo que falló en .NET
}
