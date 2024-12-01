import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'lemf',
  exposes: {
    './Routes': 'apps/lemf/src/app/remote-entry/entry.routes.ts',
  },
  shared: (libraryName, sharedConfig) => {
    switch (libraryName) {
      case '@angular/core':
      case '@angular/common':
      case '@angular/router':
        return { ...sharedConfig, singleton: true, strictVersion: false, eager: false };
      case '@ngx-translate/core':
      case '@ngx-translate/http-loader':
        return { ...sharedConfig, singleton: true, strictVersion: false, requiredVersion: 'latest' };
      default:
        return false;
    }
  },  
};
 
/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;
