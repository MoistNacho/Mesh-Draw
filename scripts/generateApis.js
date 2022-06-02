/* eslint-disable no-useless-escape */
const replace = require("replace-in-file");
const shell = require("shelljs");

const commonCustomizations = [
  {
    files: ["src/runtime.ts"],
    from: "GlobalFetch",
    to: "WindowOrWorkerGlobalScope",
  },
  {
    files: ["src/runtime.ts"],
    from: ".join(`&${encodeURIComponent(fullKey)}=`)", // eslint-disable-line
    to: ".join(`&${encodeURIComponent(fullKey)}[]=`)", // eslint-disable-line
  },
  {
    files: ["src/runtime.ts"],
    from: "${encodeURIComponent(fullKey)}=${multiValue}", // eslint-disable-line
    to: "${encodeURIComponent(fullKey)}[]=${multiValue}", // eslint-disable-line
  },
];

const apis = [
  {
    name: "naverOpenApi",
    specLocation: "./apiSpecs/naverOpenApi.yaml",
    customizations: commonCustomizations,
  },
];
const apiClientsDir = "./src/apiClients";

shell.rm("-r", apiClientsDir);

apis.forEach((api) => {
  const apiClientDir = `${apiClientsDir}/${api.name}`;

  shell.mkdir("-p", apiClientDir);
  shell.exec(
    [
      `openapi-generator-cli generate -i ${api.specLocation}`,
      "-g typescript-axios",
      `-o ${apiClientDir}`,
      "-c openapi-config.json",
      "--type-mappings date=string,object=any",
    ].join(" "),
  );
  shell.rm([
    `${apiClientDir}/.gitignore`,
    `${apiClientDir}/.openapi-generator-ignore`,
  ]);
  if (api.customizations) {
    api.customizations.forEach((x) => {
      replace.sync({
        ...x,
        files: x.files.map((file) => `${apiClientDir}/${file}`),
      });
    });
  }
});
