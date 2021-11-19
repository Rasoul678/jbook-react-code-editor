import { Command } from "commander";
import { serve } from "@js-note-678/local-api";
import path from "path";

interface Options {
  port: string;
}

const isProduction = process.env.NODE_ENV === "production";

export const serveCommand = new Command()
  .command("serve [filename]")
  .description("Open a file for editing")
  .option("-p, --port <number>", "port to run server on", "4005")
  .action(async (filename = "notebook.js", options: Options) => {
    try {
      const dir = path.join(process.cwd(), path.dirname(filename));
      await serve(
        parseInt(options.port),
        path.basename(filename),
        dir,
        !isProduction
      );
      console.log(`Listening on port: ${options.port}`);
    } catch (error: any) {
      if (error.code === "EADDRINUSE") {
        console.log("Port in use. Try running on a different port.");
      } else {
        console.log(`Error: ${error.message}`);
      }

      process.exit(1);
    }
  });
