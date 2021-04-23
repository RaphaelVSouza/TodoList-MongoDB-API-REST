"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const signRoutes = {
    register: {
        post: {
            tags: ['Register/Session'],
            produces: ['application/json'],
            description: 'Register user',
            operationId: 'registerUser',
            requestBody: {
                content: {
                    'multipart/form-data': {
                        schema: {
                            $ref: '#/components/schemas/RegisterUpdate',
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'User Successfully created',
                },
                400: {
                    description: 'Bad Request',
                },
                401: {
                    description: 'Unauthorized',
                },
                403: {
                    description: 'User already exists',
                },
            },
            security: [],
        },
    },
    verify_email: {
        get: {
            tags: ['Register/Session'],
            description: 'Verify Email to login',
            operationId: 'verifyEmail',
            parameters: [
                {
                    name: 'verifyToken',
                    description: '',
                    in: 'path',
                    required: true,
                },
            ],
            responses: {
                200: {
                    description: 'Email verified successfully',
                },
            },
            security: [],
        },
    },
    resend_verify_email: {
        post: {
            tags: ['Register/Session'],
            description: 'Resend Verify Email to login',
            operationId: 'resendVerifyEmail',
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                email: {
                                    type: 'string',
                                    example: 'john.doe25@email.com',
                                },
                            },
                        },
                    },
                },
                required: true,
            },
            responses: {
                200: {
                    description: 'Email verified successfully',
                },
            },
            security: [],
        },
    },
    login: {
        post: {
            tags: ['Register/Session'],
            produces: ['application/json'],
            description: 'login',
            operationId: 'createSession',
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/Login',
                        },
                    },
                },
                required: true,
            },
            responses: {
                200: {
                    description: 'Token successfully generated',
                },
                400: {
                    description: 'Bad Request',
                },
                401: {
                    description1: 'Need to verify email first',
                    description2: 'User or password invalid',
                },
            },
            security: [],
        },
    },
};
exports.default = signRoutes;
