import { createRemoteJWKSet, jwtVerify } from 'jose';
import { InternalServerError, UnauthorizedError } from './errors.util.js';

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

    const clientId = process.env.AZURE_CLIENT_ID;
    if (!clientId) throw new InternalServerError("Konfigurasi AZURE_CLIENT_ID belum diatur di server");

    const token = authHeader.substring(7).trim();
    if (!token) throw new UnauthorizedError('Token tidak boleh kosong');

    try {
        const { payload } = await jwtVerify(token, JWKS, { audience: [clientId, `api://${clientId}`] }); 

        const issuer = payload.iss || '';
        if (!issuer.startsWith('https://login.microsoftonline.com/') || !issuer.endsWith('/v2.0')) {
            throw new UnauthorizedError('Issuer token tidak valid');
        }

        if (!payload.tid) throw new UnauthorizedError('Token tidak memiliki klaim tenantId (tid).');

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