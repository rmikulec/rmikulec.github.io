## Build / Deploy

First, the site must be built using npm

```bash
cd ./site
npm run build
```

Then the build files must be moved to the root directory

```bash
mv ./build/* ../
```

To deploy commit and push all the build files in the root directory
