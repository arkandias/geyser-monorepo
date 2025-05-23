import { AccessTokenPayload, errorMessage } from "@geyser/shared";
import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import type { Request, Response } from "express";

import { Cookies } from "../common/cookies.decorator";
import { ConfigService } from "../config/config.service";
import { IdentityService } from "../identity/identity.service";
import { AuthService } from "./auth.service";
import { CallbackQueryDto } from "./callback-query.dto";
import { RedirectUrlDto } from "./redirect-url.dto";
import { StateService } from "./state.service";

@Controller("auth")
export class AuthController {
  private callbackUrl: URL;

  constructor(
    private configService: ConfigService,
    private identityService: IdentityService,
    private authService: AuthService,
    private stateService: StateService,
  ) {
    this.callbackUrl = new URL("/auth/callback", this.configService.apiUrl);
  }

  @Get("login")
  login(
    @Query() loginQueryDto: RedirectUrlDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { redirectUrl } = loginQueryDto;

    // Use state parameter to prevent CSRF attacks
    const stateId = this.stateService.newState(redirectUrl);

    // Building authentication URL
    const authUrl = new URL(this.identityService.metadata.authUrl);
    authUrl.searchParams.set("client_id", this.configService.oidc.clientId);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("state", stateId);
    authUrl.searchParams.set("scope", "openid");
    authUrl.searchParams.set("redirect_uri", this.callbackUrl.href);

    res.redirect(authUrl.toString());
  }

  @Get("callback")
  async callback(
    @Query() callbackQueryDto: CallbackQueryDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const { state, code } = callbackQueryDto;

    let redirectUrl: URL | null = null;
    try {
      redirectUrl = this.stateService.getState(state, req).redirectUrl;

      const { accessToken: identityToken } =
        await this.identityService.requestToken({
          client_id: this.configService.oidc.clientId,
          client_secret: this.configService.oidc.clientSecret,
          grant_type: "authorization_code",
          code,
          redirect_uri: this.callbackUrl.href,
        });

      const { uid } = await this.identityService.verifyToken(identityToken);
      const user = await this.authService.getUser(uid);
      await this.authService.setAccessCookie(res, user);
      await this.authService.setRefreshCookie(res, user);

      if (redirectUrl) {
        res.redirect(redirectUrl.toString());
      } else {
        res
          .status(200)
          .contentType("text/plain")
          .send("Authentication successful");
      }
    } catch (error) {
      if (redirectUrl) {
        redirectUrl.searchParams.set("auth_error", errorMessage(error));
        res.redirect(redirectUrl.toString());
      } else {
        throw error;
      }
    }
  }

  @Get("verify")
  async verify(
    @Cookies("access_token") accessToken: string | undefined,
  ): Promise<AccessTokenPayload> {
    if (!accessToken) {
      throw new UnauthorizedException("Missing access token");
    }
    return this.authService.verifyAccessToken(accessToken);
  }

  @Post("refresh")
  async refresh(
    @Cookies("refresh_token") refreshToken: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    if (!refreshToken) {
      throw new UnauthorizedException("Missing refresh token");
    }
    const { sub } = await this.authService.verifyRefreshToken(refreshToken);
    const user = await this.authService.getUser(sub);
    await this.authService.setAccessCookie(res, user);
    await this.authService.setRefreshCookie(res, user);
  }

  @Get("logout")
  logout(
    @Query() redirectUrlDto: RedirectUrlDto,
    @Res({ passthrough: true }) res: Response,
  ): void {
    const { redirectUrl } = redirectUrlDto;

    // Building logout URL
    const logoutUrl = new URL(this.identityService.metadata.logoutUrl);
    if (redirectUrl) {
      logoutUrl.searchParams.set("client_id", "backend");
      logoutUrl.searchParams.set("post_logout_redirect_uri", redirectUrl);
    }

    // Removing cookies
    this.authService.unsetAccessCookie(res);
    this.authService.unsetRefreshCookie(res);

    res.redirect(logoutUrl.toString());
  }
}
