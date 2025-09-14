// === CONFIGURATION ===
const SPREADSHEET_ID = "139Jhux-pkhiHugwH-CSAIhxE3x3kczyJuhDyMUyXN1s";  // Your sheet ID
const SHEET_NAME = "Sheet1";  // Change if your sheet name is different
const UPLOAD_FOLDER_ID = "https://https://drive.google.com/drive/folders/1PHsPTMwDAPsVm15UvH1mR1idkLWr6TKc?usp=sharing.google.com/drive/folders/1PHsPTMwDAPsVm15UvH1mR1idkLWr6TKc?usp=drive_link"; // Create a folder in Google Drive & paste ID

// === MAIN FUNCTION ===
function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);

    // Collect form fields
    const name = e.parameter.name || "";
    const email = e.parameter.email || "";
    const contact_number = e.parameter.contact_number || "";
    const gender = e.parameter.gender || "";
    const message = e.parameter.message || "";
    const age = e.parameter.age || "";
    const ex = e.parameter.ex || "";

    // Handle file upload (base64 string)
    let mediaLink = "";
    if (e.parameter.media) {
      const base64Data = e.parameter.media;
      const blob = Utilities.newBlob(
        Utilities.base64Decode(base64Data),
        "image/jpeg",
        "upload_" + new Date().getTime() + ".jpg"
      );
      const folder = DriveApp.getFolderById(UPLOAD_FOLDER_ID);
      const file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      mediaLink = file.getUrl();
    }

    // Append to sheet
    const timestamp = new Date();
    sheet.appendRow([
      timestamp,
      name,
      email,
      contact_number,
      gender,
      message,
      age,
      ex,
      mediaLink,
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ result: "success" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", error: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
