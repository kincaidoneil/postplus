## Update Bower Packages
1. *Manually* update the versions of all packages listed in bower.json.
2. Run `bower update` from the command line to download the updated packages.

## Update Gulp.js Packages
1. Update all dependencies in package.json to list the latest available version by running `npm-check-updates -u`.
  - NOTE: The package must already be installed globally to work: `npm install -g npm-check-updates`.
2. Then, upgrade packages to the latest version listed in package.json: `npm update`.

**NOTE:** *Only* update Gulp.js packages if it is absolutely necessary and/or there are new features available. Updating just to update may break some key features!