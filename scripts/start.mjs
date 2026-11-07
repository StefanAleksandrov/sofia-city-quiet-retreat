import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const nextCli = fileURLToPath(
  new URL("../node_modules/next/dist/bin/next", import.meta.url),
);
const next = spawn(process.execPath, [nextCli, "start", ...process.argv.slice(2)], {
  stdio: ["inherit", "pipe", "pipe"],
});

let localUrl;
let ready = false;
let browserOpened = false;
let startupTimer;
let urlWarningTimer;
let outputBuffer = "";

function openWhenReady() {
  if (ready && localUrl && !browserOpened) {
    browserOpened = true;
    openBrowser(localUrl);
  }
}

function openBrowser(url) {
  const [command, args] =
    process.platform === "win32"
      ? ["explorer.exe", [url]]
      : process.platform === "darwin"
        ? ["open", [url]]
        : ["xdg-open", [url]];
  const browser = spawn(command, args, { detached: true, stdio: "ignore" });

  browser.once("error", (error) => {
    console.error(`Could not open the default browser: ${error.message}`);
  });
  browser.unref();
}

function observeOutput(chunk) {
  outputBuffer += chunk
    .toString()
    .replace(/\u001b\[[0-?]*[ -/]*[@-~]/g, "");
  const lines = outputBuffer.split(/\r?\n/);
  outputBuffer = lines.pop() ?? "";

  for (const line of lines) {
    const localAddress = line.match(/Local:\s+(https?:\/\/[^\s]+)/i);

    if (localAddress) {
      localUrl = localAddress[1];
      clearTimeout(urlWarningTimer);
    }

    if (/Ready in\b/i.test(line)) {
      ready = true;
      clearTimeout(startupTimer);
      urlWarningTimer = setTimeout(() => {
        if (!localUrl) {
          console.error("Next.js is ready, but its local URL could not be detected.");
        }
      }, 2_000);
    }

    openWhenReady();
  }
}

next.stdout.on("data", (chunk) => {
  process.stdout.write(chunk);
  observeOutput(chunk);
});
next.stderr.on("data", (chunk) => {
  process.stderr.write(chunk);
  observeOutput(chunk);
});

startupTimer = setTimeout(() => {
  if (!ready) {
    console.error("Next.js did not become ready within 120 seconds.");
    next.kill();
  }
}, 120_000);

next.once("error", (error) => {
  clearTimeout(startupTimer);
  console.error(`Could not start Next.js: ${error.message}`);
  process.exitCode = 1;
});

next.once("exit", (code, signal) => {
  clearTimeout(startupTimer);
  clearTimeout(urlWarningTimer);
  process.exitCode = code ?? (signal ? 1 : 0);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, () => next.kill(signal));
}
