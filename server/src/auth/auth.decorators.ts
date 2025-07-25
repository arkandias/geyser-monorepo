import { type ExecutionContext, createParamDecorator } from "@nestjs/common";
import type { Request } from "express";

export const OrgId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): number | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (!request.auth) {
      throw new Error("OrgId decorator can only be used with AuthGuard");
    }

    return request.auth.orgId;
  },
);

export const UserId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): number | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (!request.auth) {
      throw new Error("UserId decorator can only be used with AuthGuard");
    }

    return request.auth.userId;
  },
);

export const UserRole = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (!request.auth) {
      throw new Error("UserRole decorator can only be used with AuthGuard");
    }

    return request.auth.role;
  },
);

export const IsAdmin = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): boolean => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (!request.auth) {
      throw new Error("IsAdmin decorator can only be used with AuthGuard");
    }

    return request.auth.isAdmin ?? false;
  },
);
