import { Status } from "https://deno.land/x/oak/mod.ts";
import { User } from "../models/index.ts";
import { UserFields } from "../models/user.ts";
import * as djwt from "https://deno.land/x/djwt@v2.7/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

const ONE_DAY_MINUTES = 60 * 60 * 24;
// @TODO: Move this to another place
const key = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"],
);

// Needed for deno deploy: https://github.com/JamesBroadberry/deno-bcrypt/issues/26
const compare = (passwordA: string, passwordB: string): Promise<boolean> =>
  new Promise((resolve, reject) => {
    const passwordMatches = bcrypt.compareSync(passwordA, passwordB);
    resolve(passwordMatches);
  });

export default {
  login: async (context: any) => {
    const fields: UserFields = await context.request.body({ type: "json" })
      .value;
    const [user] = await User.where("username", fields.username).get() as any[];
    if (!user) {
      context.response.status = Status.Forbidden;
      return;
    }
    const passwordMatches = await compare(fields.password, user.password);
    if (passwordMatches) {
      context.response.status = Status.OK;
      const jwtToken = await djwt.create({ alg: "HS512", typ: "JWT" }, {
        exp: djwt.getNumericDate(ONE_DAY_MINUTES),
      }, key);
      context.response.body = { auth_token: jwtToken };
    } else {
      context.response.status = Status.Unauthorized;
    }
  },

  validate: async (context: any, next: any) => {
    const headers: Headers = context.request.headers;
    const token = headers.get("Authorization");
    if (!token) {
      context.response.status = Status.Unauthorized;
      return;
    }

    try {
      await djwt.verify(token, key);
      return next();
    } catch (error) {
      console.log(`Error verifying token, ${error}`);
      context.response.status = Status.Unauthorized;
    }
  },
};
