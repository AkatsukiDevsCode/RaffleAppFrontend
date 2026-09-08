import type { ErrorCodes } from "src/shared/core/errors/error-enum.error";

export type ErrorCodesType = (typeof ErrorCodes)[keyof typeof ErrorCodes];
