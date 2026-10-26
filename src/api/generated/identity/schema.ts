// Generated from contracts/identity/openapi.json. Do not edit.
export interface paths {
  '/api/v1/auth/register': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: {
      parameters: {
        query?: {
          'api-version'?: string;
        };
        header?: never;
        path?: never;
        cookie?: never;
      };
      requestBody?: {
        content: {
          'application/json': components['schemas']['DevFlow.Identity.API.Controllers.RegisterRequest'];
          'text/json': components['schemas']['DevFlow.Identity.API.Controllers.RegisterRequest'];
          'application/*+json': components['schemas']['DevFlow.Identity.API.Controllers.RegisterRequest'];
        };
      };
      responses: {
        /** @description Accepted */
        202: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            'application/json': components['schemas']['DevFlow.Identity.Application.Features.Auth.Commands.Registration.RegistrationAcceptedResponse'];
          };
        };
        /** @description Bad Request */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            'application/json': components['schemas']['Microsoft.AspNetCore.Mvc.ProblemDetails'];
          };
        };
        /** @description Too Many Requests */
        429: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            'application/json': components['schemas']['Microsoft.AspNetCore.Mvc.ProblemDetails'];
          };
        };
        /** @description Service Unavailable */
        503: {
          headers: {
            [name: string]: unknown;
          };
          content?: never;
        };
      };
    };
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        /** @description OK */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content?: never;
        };
      };
    };
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/v1/integrations/Users/{userId}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: {
      parameters: {
        query?: never;
        header: {
          /** @description Integration API key configured in IntegrationApi:ApiKeys. */
          'X-Integration-Key': string;
        };
        path: {
          userId: string;
        };
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        /** @description OK */
        200: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            'application/json': components['schemas']['DevFlow.Identity.Contracts.UserIntegrationDto'];
          };
        };
        /** @description Bad Request */
        400: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            'application/json': components['schemas']['Microsoft.AspNetCore.Mvc.ProblemDetails'];
          };
        };
        /** @description Unauthorized */
        401: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            'application/json': components['schemas']['Microsoft.AspNetCore.Mvc.ProblemDetails'];
          };
        };
        /** @description Not Found */
        404: {
          headers: {
            [name: string]: unknown;
          };
          content: {
            'application/json': components['schemas']['Microsoft.AspNetCore.Mvc.ProblemDetails'];
          };
        };
      };
    };
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
}
export type webhooks = Record<string, never>;
export interface components {
  schemas: {
    'DevFlow.Identity.API.Controllers.RegisterRequest': {
      email?: string | null;
      password?: string | null;
      displayName?: string | null;
      locale?: string | null;
      timeZone?: string | null;
    };
    'DevFlow.Identity.Application.Features.Auth.Commands.Registration.RegistrationAcceptedResponse': {
      message?: string | null;
    };
    'DevFlow.Identity.Contracts.UserIntegrationDto': {
      /** Format: uuid */
      id?: string;
      displayName?: string | null;
      avatarUrl?: string | null;
      status?: string | null;
    };
    'Microsoft.AspNetCore.Mvc.ProblemDetails': {
      type?: string | null;
      title?: string | null;
      /** Format: int32 */
      status?: number | null;
      detail?: string | null;
      instance?: string | null;
    } & {
      [key: string]: unknown;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
