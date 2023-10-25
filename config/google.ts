export const GOOGLE_CLIENT_ID =
  "282686462537-egeid580qtoh0mt3uvoecme7u4jac2pg.apps.googleusercontent.com";
export const DISCOVERY_DOC = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
  "https://sheets.googleapis.com/$discovery/rest?version=v4",
];

export const GOOGLE_API_KEY = "AIzaSyAbTS-6uZlsbruNt0gQF3LaNterUsWq4Bg";

export const GOGOLE_SCOPES =
  "https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/spreadsheets.readonly";

export const GOOGLE_REDIRECT_URI =
  "http://localhost:3000/dashboard/select-file";

export const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?scope=${GOGOLE_SCOPES}&include_granted_scopes=true&response_type=token&state=state_parameter_passthrough_value&redirect_uri=${GOOGLE_REDIRECT_URI}&client_id=${GOOGLE_CLIENT_ID}`;
