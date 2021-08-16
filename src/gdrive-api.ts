import dotenv from 'dotenv';
const { google } = require('googleapis');


dotenv.config();

const driveClientId = process.env.GOOGLE_DRIVE_CLIENT_ID || '';
const driveClientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET || '';
const driveRedirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI || '';
const driveRefreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN || '';
const folderId = '1hl65CYzxpQ4x5urLdq84lGhxa-kBKvQu';

export class GoogleDriveService {
  public imageFileList = new Array;
  public imageFileInfo;
  private driveClient;

  public constructor(){
    this.driveClient = this.createDriveClient();
  }

  createDriveClient() {
    const client = new google.auth.OAuth2(driveClientId, driveClientSecret, driveRedirectUri);

    client.setCredentials({ refresh_token: driveRefreshToken });

    return google.drive({
      version: 'v3',
      auth: client,
    });
  }

  searchFolder() {
    return new Promise(async (resolve, reject) => {
      this.imageFileList = new Array;
      await this.getImageList(folderId);
      resolve(this.imageFileList);
    });
  }

  async getImageList(folderId: String) {
    return new Promise((resolve, reject) => {
      this.driveClient.files.list(
        {
          q: "'" + folderId + "' in parents and trashed = false",
          fields: "files(id, name, mimeType, createdTime)",
          orderBy: "createdTime desc",
        },
        async (err, res: { data }) => {
          var files = res.data.files;
          if (files && files.length > 0) {
              for (var i = 0; i < files.length; i++) {
                  var file = files[i];
                  if(file.mimeType == "application/vnd.google-apps.folder"){
                      await this.getImageList(file['id']);
                  }else if(file.mimeType == "image/jpeg" || file.mimeType == "image/png"){
                      this.imageFileInfo = {"id":file.id, "name":file.name, "mimeType":file.mimeType, "createdTime": file.createdTime};
                      this.imageFileList.push(this.imageFileInfo);
                  }
              }
          } else {
              this.imageFileList.push(null);
          }
          resolve(this.imageFileList);
        },
      );
    })
  }

}