import { Magic } from "magic-sdk";
import { OAuthExtension } from '@magic-ext/oauth2';

export const magic = new Magic("pk_live_CD8F5C0C43A10B97", {
    extensions: [new OAuthExtension()],
    endpoint: 'https://auth.stagef.magic.link'
});