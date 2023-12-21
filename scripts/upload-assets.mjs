import fs from "fs";
import path from "path";
import hubspotClient from "./api-client.mjs";

const filesToUpload = [
  "images/secret-santa.png",
  "images/01-christmas-countdown.gif",
  "images/02-compact-countdown.png",
  "images/03-holiday-humor.png",
  "images/04-advent-calendar.png",
  "images/05-secret-santa.png",
  "images/14-hello-public-world.png",
  "images/16-gift-of-script.png",
  "images/17-project-form.gif",
  "images/18-advent-validation.gif",
  "images/19-hubdb.png",
  "images/20-super-secret.png",
];
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
