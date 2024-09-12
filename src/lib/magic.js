import { Magic } from "magic-sdk";
import { OAuthExtension } from '@magic-ext/oauth2';

export const magic = new Magic("pk_live_4404D9451D29CFC5", {
    extensions: [new OAuthExtension()]
});