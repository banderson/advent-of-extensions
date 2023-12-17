import fs from "fs";
import path from "path";
import hubspotClient from "./api-client.mjs";

const filesToUpload = ["images/secret-santa.png"];
const fileMgrOptions = {
  rootPath: "advent",
  fileSettings: {
    access: "PUBLIC_INDEXABLE",
    ttl: "P3M",
    overwrite: true,
    duplicateValidationStrategy: "NONE",
    duplicateValidationScope: "ENTIRE_PORTAL",
  },
};

const uploads = await uploadAssets();

console.log("Files uploaded ===>", uploads);

async function uploadAssets(client = hubspotClient) {
  let files = {};
  for (const file of filesToUpload) {
    const [folder, filename] = file.split("/");
    const contents = fs.readFileSync(path.join("assets", folder, filename));

    const upload = await client.files.filesApi.upload(
      { name: filename, data: contents },
      undefined,
      path.join(fileMgrOptions.rootPath, folder),
      filename,
      undefined,
      JSON.stringify(fileMgrOptions.fileSettings)
    );

    files[filename] = { id: upload.id, path: upload.path, url: upload.url };
  }

  return files;
}
