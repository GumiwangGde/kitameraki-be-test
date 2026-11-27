import { createRemoteJWKSet, jwtVerify } from 'jose';
import { UnauthorizedError } from './errors.util.js';

export interface AuthUser {
    userId: string;
    tenantId: string;
    name: string;
    email: string;
    roles: string[];
}

const JWKS = createRemoteJWKSet(
  new URL('https://login.microsoftonline.com/common/discovery/v2.0/keys')
);

export async function verifyToken(authHeader: string | null): Promise<AuthUser> {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('Authorization header wajib disertakan dengan format Bearer')
    }

    const token = authHeader.substring(7).trim();

    try {
        const { payload } = await jwtVerify(token, JWKS, {
            audience: process.env.AZURE_CLIENT_ID
        }); 

        const issuer = payload.iss || '';
        if (!issuer.startsWith('https://login.microsoftonline.com/') || !issuer.endsWith('/v2.0')) {
            throw new UnauthorizedError('Issuer token tidak valid');
        }

        if (!payload.tid) {
            throw new UnauthorizedError('Token tidak memiliki klaim tenantId (tid).');
        }

        return {
            userId: (payload.oid || payload.sub || '') as string,
            tenantId: payload.tid as string,
            name: (payload.name || '') as string,
            email: (payload.preferred_username || payload.email || '') as string,
            roles: (payload.roles || []) as string[],
        };
    } catch (error) {
        if (error instanceof UnauthorizedError) throw error;
        throw new UnauthorizedError('Token tidak valid atau sudah kedaluwarsa.');
    }
}