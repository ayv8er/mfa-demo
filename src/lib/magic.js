import { Magic } from "magic-sdk";
import { OAuthExtension } from '@magic-ext/oauth2';

export const magic = new Magic("pk_live_B1717ED2BD01337F", {
    extensions: [new OAuthExtension()]
});