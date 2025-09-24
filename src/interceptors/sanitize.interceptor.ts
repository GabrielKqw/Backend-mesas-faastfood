import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SanitizeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    
    if (request.body) {
      request.body = this.sanitizeObject(request.body);
    }
    
    if (request.query) {
      request.query = this.sanitizeObject(request.query);
    }
    
    if (request.params) {
      request.params = this.sanitizeObject(request.params);
    }

    return next.handle().pipe(
      map(data => {
        return this.sanitizeResponse(data);
      })
    );
  }

  private sanitizeObject(obj: unknown): unknown {
    if (typeof obj !== 'object' || obj === null) {
      return this.sanitizeString(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item));
    }

    const sanitized: Record<string, unknown> = {};
    for (const key in obj as Record<string, unknown>) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitized[key] = this.sanitizeObject((obj as Record<string, unknown>)[key]);
      }
    }
    return sanitized;
  }

  private sanitizeString(value: unknown): unknown {
    if (typeof value !== 'string') {
      return value;
    }

    return value
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }

  private sanitizeResponse(data: unknown): unknown {
    if (typeof data === 'object' && data !== null) {
      if (Array.isArray(data)) {
        return data.map(item => this.sanitizeResponse(item));
      }
      
      const sanitized = { ...data as Record<string, unknown> };
      
      delete sanitized.password;
      delete sanitized.token;
      delete sanitized.secret;
      
      for (const key in sanitized) {
        if (Object.prototype.hasOwnProperty.call(sanitized, key)) {
          sanitized[key] = this.sanitizeResponse(sanitized[key]);
        }
      }
      
      return sanitized;
    }
    
    return data;
  }
}
