import * as esbuild from "esbuild-wasm";
import { fetchPlugin, unpkgPathPlugin } from "./plugins";

interface BundlerResult {
  code: string;
  err: string;
}

type Bundler = (rawCode: string) => Promise<BundlerResult | undefined>;

let service: esbuild.Service;

const bundler: Bundler = async (rawCode) => {
  if (!service) {
    service = await esbuild.startService({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
    });
  }

  try {
    const result = await service.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      define: { "process.env.NODE_ENV": '"production"', global: "window" },
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      jsxFactory: "_React.createElement",
      jsxFragment: "_React.Fragment",
    });

    return {
      code: result.outputFiles[0].text,
      err: "",
    };
  } catch (error) {
    if (error instanceof Error) {
      return { code: "", err: error.message };
    }
  }
};

export default bundler;
