import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

type HttpErrorBody =
  | string
  | {
      statusCode?: number;
      message?: string | string[];
      error?: string;
      [key: string]: unknown;
    };

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const timestamp = new Date().toISOString();
    const path = request?.url ?? '';
    const method = request?.method ?? 'GET';

    // 1) Gestion HttpException (strict)
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const raw = exception.getResponse() as HttpErrorBody;
      const message =
        typeof raw === 'string'
          ? raw
          : (normalizeMessage(raw?.message) ?? exception.message ?? 'HttpException');
      const code = typeof raw === 'string' ? exception.name : (raw?.error ?? exception.name);

      const details = typeof raw === 'object' ? raw : undefined;
      return response.status(status).json({
        timestamp,
        path,
        method,
        status,
        code,
        message,
        details,
      });
    }

    // 2) Prisma Known Error
    if (this.isPrismaKnownError(exception)) {
      const prismaErr = exception;
      const status = this.mapPrismaCodeToStatus(prismaErr.code);
      return response.status(status).json({
        timestamp,
        path,
        method,
        status,
        code: prismaErr.code,
        message: this.mapPrismaCodeToMessage(prismaErr.code),
        details: prismaErr.meta ? { meta: prismaErr.meta } : undefined,
      });
    }

    // 3) Erreur générique (conserver types sûrs)
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const generic = toGenericError(exception);
    return response.status(status).json({
      timestamp,
      path,
      method,
      status,
      code: generic.name,
      message: generic.message,
    });
  }

  private isPrismaKnownError(ex: unknown): ex is Prisma.PrismaClientKnownRequestError {
    return (
      !!ex &&
      typeof ex === 'object' &&
      'code' in ex &&
      typeof (ex as { code: unknown }).code === 'string' &&
      'clientVersion' in ex
    );
  }

  private mapPrismaCodeToStatus(code: string): number {
    switch (code) {
      case 'P2002':
        return HttpStatus.CONFLICT; // Unique constraint failed
      case 'P2003':
        return HttpStatus.BAD_REQUEST; // Foreign key constraint failed
      case 'P2025':
        return HttpStatus.NOT_FOUND; // Record not found
      default:
        return HttpStatus.BAD_REQUEST;
    }
  }

  private mapPrismaCodeToMessage(code: string): string {
    switch (code) {
      case 'P2002':
        return 'Contrainte d’unicité violée';
      case 'P2003':
        return 'Contrainte de clé étrangère violée';
      case 'P2025':
        return 'Enregistrement introuvable';
      default:
        return 'Erreur de base de données';
    }
  }
}

/**
 * Normalise le champ message potentiel de HttpErrorBody en string lisible.
 */
function normalizeMessage(input?: string | string[]): string | undefined {
  if (typeof input === 'string') return input;
  if (Array.isArray(input)) return input.join('; ');
  return undefined;
}

/**
 * Convertit une erreur inconnue en structure générique typée sans any.
 */
function toGenericError(ex: unknown): { name: string; message: string } {
  if (ex instanceof Error) {
    return { name: ex.name || 'Error', message: ex.message || 'Internal server error' };
  }
  // Si ce n'est pas une Error, fallback sûr
  return { name: 'Error', message: 'Internal server error' };
}
