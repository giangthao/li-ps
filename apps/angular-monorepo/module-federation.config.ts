import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'angular-monorepo',
  /**
   * To use a remote that does not exist in your current Nx Workspace
   * You can use the tuple-syntax to define your remote
   *
   * remotes: [['my-external-remote', 'https://nx-angular-remote.netlify.app']]
   *
   * You _may_ need to add a `remotes.d.ts` file to your `src/` folder declaring the external remote for tsc, with the
   * following content:
   *
   * declare module 'my-external-remote';
   *
   */
  remotes: ['lea', 'lemf'],
  shared: (libraryName, sharedConfig) => {
    switch (libraryName) {
      case '@angular/core':
      case '@angular/common':
      case '@angular/router':
        return {
          ...sharedConfig,
          singleton: true,
          strictVersion: false,
          eager: false,
        };
      case '@ngx-translate/core':
      case '@ngx-translate/http-loader':
        return {
          ...sharedConfig,
          singleton: true,
          strictVersion: false,
          requiredVersion: 'latest',
        };
      default:
        return false;
    }
  },
};

/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;
