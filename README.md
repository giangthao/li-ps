# LIPS

## Run tasks

To run tasks with Nx use:

```sh
npx nx run-many --target=serve --parallel --maxParallel=5
```

## Install @nx/angular

```sh
npm install -D @nx/angular
```

## Init angular to NX workspace (If the configuration for supporting Angular is not set up yet.)

```sh
npx nx generate @nx/angular:init --keepExistingVersion --updatePackageScripts
```

## Add new @nx/angular:host

```sh
npx nx generate @nx/angular:host apps/angular-monorepo --prefix=app --e2eTestRunner=none
```

## Add new @nx/angular:remote (LEA)

```sh
npx nx generate @nx/angular:remote apps/lea --host=angular-monorepo --prefix=app --e2eTestRunner=none
```

## Add new @nx/angular:remote (LEMF)

```sh
npx nx generate @nx/angular:remote apps/lemf --host=angular-monorepo --prefix=app --e2eTestRunner=none
```
