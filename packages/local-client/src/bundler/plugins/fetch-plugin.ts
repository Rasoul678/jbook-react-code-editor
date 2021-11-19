import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localForage from "localforage";

const fileCache = localForage.createInstance({
  name: "file_cache",
});

export const fetchPlugin = (text: string) => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
      //! OnLoad for entry point file of index.js.
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: "jsx",
          contents: text,
        };
      });

      //! OnLoad for getting files that already have been fetched.
      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        //! Check to see if we have already fetched this file.
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        //! and if it is in the cache, return it immediately.
        if (cachedResult) {
          return cachedResult;
        }
        return null;
      });

      //! OnLoad for css files.
      build.onLoad({ filter: /.css$/ }, async (args: esbuild.OnLoadArgs) => {
        const { data, request } = await axios.get(args.path);

        const resolveDir = new URL("./", request.responseURL).pathname;

        const escapedData = data
          .replace(/\n/g, "")
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");

        const contents = `
                const style = document.createElement('style');
                style.innerText = '${escapedData}';
                document.head.appendChild(style);
                `;

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents,
          resolveDir,
        };

        //! Store response in cache.
        await fileCache.setItem(args.path, result);

        return result;
      });

      //! OnLoad for modules.
      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        const { data: contents, request } = await axios.get(args.path);

        const resolveDir = new URL("./", request.responseURL).pathname;

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents,
          resolveDir,
        };

        //! Store response in cache.
        await fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
};
