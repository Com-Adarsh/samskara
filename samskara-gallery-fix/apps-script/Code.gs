var REG_SHEET = 'Registration';
var SUB_SHEET = 'Submissions';

function doPost(e) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
    return jsonOutput_({ result: 'error', error: 'The sheet is busy. Please try again.' });
  }

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var params = (e && e.parameter) || {};
    var type = params.formType;

    if (type === 'creative') {
      var sheet = getSubmissionsSheet_(ss);
      var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
      var imageColumn = findHeader_(headers, ['imageurl', 'image', 'photourl']);
      if (imageColumn === -1) {
        imageColumn = headers.length;
        sheet.getRange(1, imageColumn + 1).setValue('imageUrl');
      }

      var imageUrl = String(params.imageUrl || params.ImageURL || '').trim();
      if (!/^https:\/\//i.test(imageUrl)) {
        return jsonOutput_({ result: 'error', error: 'A valid HTTPS image URL is required.' });
      }
      if (!String(params.Title || '').trim()) {
        return jsonOutput_({ result: 'error', error: 'A title is required.' });
      }

      var submission = new Array(Math.max(sheet.getLastColumn(), imageColumn + 1)).fill('');
      submission[0] = new Date();
      submission[1] = params.Name || 'Anonymous';
      submission[2] = params.Dept || '';
      submission[3] = params.Title;
      submission[4] = params.Content || '';
      submission[5] = 0;
      submission[6] = 'pending';
      submission[imageColumn] = imageUrl;
      sheet.appendRow(submission);
    } else {
      var registrationSheet = ss.getSheetByName(REG_SHEET);
      if (!registrationSheet) {
        return jsonOutput_({ result: 'error', error: 'Registration sheet not found' });
      }
      registrationSheet.appendRow([
        new Date(),
        params.name,
        params.phone,
        params.dept,
        params.year,
        params.blood,
        params.passing_year,
        params.interest,
        'Active'
      ]);
    }

    return jsonOutput_({ result: 'success' });
  } catch (error) {
    return jsonOutput_({ result: 'error', error: error.message });
  } finally {
    lock.releaseLock();
  }
}

function checkUser(identifier) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(REG_SHEET);
  if (!sheet) return false;

  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][2]) === String(identifier)) return true;
  }
  return false;
}

function doGet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SUB_SHEET);
  if (!sheet || sheet.getLastRow() < 2) return jsonOutput_([]);

  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var statusColumn = findHeader_(headers, ['status']);
  if (statusColumn === -1) statusColumn = 6;
  var imageColumn = findHeader_(headers, ['imageurl', 'image', 'photourl']);
  var results = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (String(row[statusColumn] || '').toLowerCase() !== 'approved') continue;

    var item = {};
    for (var j = 0; j < headers.length; j++) item[headers[j]] = row[j];
    item.imageUrl = imageColumn === -1 ? '' : row[imageColumn] || '';
    results.push(item);
  }

  return jsonOutput_(results);
}

function getSubmissionsSheet_(spreadsheet) {
  var sheet = spreadsheet.getSheetByName(SUB_SHEET);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SUB_SHEET);
    sheet.appendRow(['Timestamp', 'Name', 'Dept', 'Title', 'Content', 'Likes', 'Status', 'imageUrl']);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Name', 'Dept', 'Title', 'Content', 'Likes', 'Status', 'imageUrl']);
  }
  return sheet;
}

function findHeader_(headers, names) {
  var normalizedNames = names.map(normalizeHeader_);
  for (var i = 0; i < headers.length; i++) {
    if (normalizedNames.indexOf(normalizeHeader_(headers[i])) !== -1) return i;
  }
  return -1;
}

function normalizeHeader_(value) {
  return String(value || '').replace(/[^a-z0-9]/gi, '').toLowerCase();
}

function jsonOutput_(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
