import { randomBytes } from "node:crypto";
import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { OAuth2Client } from "google-auth-library";

const port = 8787;
const redirectUri = `http://localhost:${port}/oauth2callback`;
const clientId = process.env.GMAIL_CLIENT_ID;
const clientSecret = process.env.GMAIL_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  throw new Error(
    "Set GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET in .env before authorizing.",
  );
}

const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);
const state = randomBytes(32).toString("hex");
const authorizationUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent select_account",
  scope: ["https://www.googleapis.com/auth/gmail.send"],
  state,
});

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", redirectUri);
  if (url.pathname !== "/oauth2callback") {
    response.writeHead(404).end("Not found");
    return;
  }
  if (url.searchParams.get("state") !== state) {
    response.writeHead(400).end("OAuth state validation failed.");
    return;
  }
  if (url.searchParams.has("error")) {
    response.writeHead(400).end("Google authorization was cancelled or failed.");
    server.close();
    return;
  }

  const code = url.searchParams.get("code");
  if (!code) {
    response.writeHead(400).end("Google did not return an authorization code.");
    server.close();
    return;
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    if (!tokens.refresh_token) {
      throw new Error(
        "Google returned no refresh token. Revoke this app's access from your Google Account, then run authorization again.",
      );
    }

    await saveRefreshToken(tokens.refresh_token);
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end(
      "<!doctype html><title>Gmail authorized</title><p>Gmail authorization succeeded. The refresh token was saved to .env. You can close this tab.</p>",
    );
    console.log("Gmail authorization succeeded; refresh token saved to .env.");
    server.close();
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Gmail authorization failed. Check the terminal for details.");
    console.error(
      error instanceof Error ? error.message : "Gmail authorization failed.",
    );
    server.close();
    process.exitCode = 1;
  }
});

await new Promise((resolve, reject) => {
  server.once("error", reject);
  server.listen(port, "localhost", resolve);
});

const timeout = setTimeout(() => {
  console.error("Authorization timed out. Run npm run gmail:authorize to retry.");
  server.close();
  process.exitCode = 1;
}, 10 * 60 * 1000);
timeout.unref();

console.log("Open this URL in your browser and sign in to the Gmail account used by the site:");
console.log(authorizationUrl);

async function saveRefreshToken(refreshToken) {
  let contents;
  try {
    contents = await readFile(".env", "utf8");
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      throw new Error(".env was not found; create it with the Gmail client credentials first.");
    }
    throw error;
  }

  const assignment = `GMAIL_REFRESH_TOKEN=${refreshToken}`;
  const tokenLine = /^GMAIL_REFRESH_TOKEN=.*$/m;
  if (tokenLine.test(contents)) {
    contents = contents.replace(tokenLine, assignment);
  } else {
    const newline = contents.includes("\r\n") ? "\r\n" : "\n";
    contents = `${contents}${contents.endsWith("\n") ? "" : newline}${assignment}${newline}`;
  }
  await writeFile(".env", contents, "utf8");
}
