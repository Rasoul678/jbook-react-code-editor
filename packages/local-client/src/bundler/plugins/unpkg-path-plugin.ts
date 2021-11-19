import * as esbuild from "esbuild-wasm";

export const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      //! OnResolve for entry point file of index.js.
      build.onResolve(
        { filter: /(^index\.js$)/ },
        (args: esbuild.OnLoadArgs) => {
          return { path: args.path, namespace: "a" };
        }
      );

      //! OnResolve for relative paths in a module like './' or '../'.
      build.onResolve({ filter: /(^\.+\/)/ }, (args: esbuild.OnResolveArgs) => {
        const newPath = new URL(
          args.path,
          `https://unpkg.com${args.resolveDir}/`
        ).href;
        return { path: newPath, namespace: "a" };
      });

      //! OnResolve for main package.
      build.onResolve({ filter: /.*/ }, async (args: esbuild.OnResolveArgs) => {
        return {
          path: `https://unpkg.com/${args.path}`,
          namespace: "a",
        };
      });
    },
  };
};
