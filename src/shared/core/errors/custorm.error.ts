import { ErrorCodes } from "src/shared/core/errors/error-enum.error";
import type { FormattedErrorResponse } from "src/shared/core/interfaces/format-error-response.interface";

interface PropsBadRequest {
    payload: Array<FormattedErrorResponse>;
    path: string;
}

interface Props {
    message?: string;
    path: string;
}

export class CustomError extends Error {
    public readonly statusCode: number;
    public readonly errors: Array<FormattedErrorResponse>;

    private constructor(statusCode: number, errors: Array<FormattedErrorResponse>) {
        const defaultMessage = errors.length > 0 ? errors[0].message : "An unexpected error occurred";

        super(defaultMessage);

        this.statusCode = statusCode;
        this.errors = errors;

        Object.setPrototypeOf(this, new.target.prototype);
    }

    public static badRequest(props: PropsBadRequest): CustomError {
        const { payload, path } = props;
        const formattedErrors = typeof payload === "string" ? [{ message: payload, path }] : payload;

        return new CustomError(ErrorCodes.BAD_REQUEST, formattedErrors);
    }

    public static unauthorized({ message = "No autorizado", path }: Props): CustomError {
        return new CustomError(ErrorCodes.UNAUTHORIZED, [{ message, path }]);
    }

    public static forbidden({ message = "No autorizado", path }: Props): CustomError {
        return new CustomError(ErrorCodes.FORBIDDEN, [{ message, path }]);
    }

    public static notFound({ message = "No encontrado", path }: Props): CustomError {
        return new CustomError(ErrorCodes.NOT_FOUND, [{ message, path }]);
    }

    public static conflict({ message = "Conflicto", path }: Props): CustomError {
        return new CustomError(ErrorCodes.CONFLICT, [{ message, path }]);
    }

    public static internalServer({ message = "Error interno del servidor", path = "desconocido" }: Props): CustomError {
        return new CustomError(ErrorCodes.INTERNAL_SERVER, [{ message, path }]);
    }

    public static serviceUnavailable({
        message = "Servicio no disponible temporalmente",
        path = "desconocido",
    }: Props): CustomError {
        return new CustomError(ErrorCodes.SERVICE_UNAVAILABLE, [{ message, path }]);
    }
}
