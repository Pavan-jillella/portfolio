/**
 * Gmail Pay Stub Parser — Google Apps Script
 *
 * Setup:
 * 1. Open script.google.com and create a new project
 * 2. Paste this entire script
 * 3. Run setupTrigger() once to set up automatic 6-hour checks
 * 4. The script will write parsed pay stub data to a sheet named "PayStubs"
 * 5. Publish the sheet as CSV, or deploy as web app for JSON access
 *
 * Deploy as web app: Execute as "Me", Access "Anyone"
 */

// === CONFIGURATION ===
var CONFIG = {
  // Gmail search query to find pay stub emails
  SEARCH_QUERY: 'subject:(pay stub OR paycheck OR direct deposit OR earnings statement) newer_than:90d',
  // Name of the sheet tab to write data to
  SHEET_NAME: 'PayStubs',
  // Known employer email patterns (customize these)
  EMPLOYER_PATTERNS: [
    { from: 'noreply@adp.com', employer: 'ADP' },
    { from: 'noreply@gusto.com', employer: 'Gusto' },
    { from: 'payroll@', employer: 'Payroll' },
  ],
  // Max emails to process per run
  MAX_EMAILS: 50,
};

/**
 * Main function: Searches Gmail for pay stub emails and writes parsed data to sheet.
 * Called automatically every 6 hours via time-driven trigger.
 */
function parsePayStubEmails() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

  // Create sheet with headers if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    sheet.appendRow([
      'Pay Period Start', 'Pay Period End', 'Pay Date',
      'Employer Name', 'Gross Pay', 'Federal Tax', 'State Tax',
      'Social Security', 'Medicare', 'Other Deductions',
      'Other Deductions Label', 'Net Pay', 'Regular Hours',
      'Overtime Hours', 'Hourly Rate', 'Email Subject',
      'Email Date', 'Processed At'
    ]);
    sheet.getRange(1, 1, 1, 18).setFontWeight('bold');
  }

  // Get existing email subjects + dates to avoid duplicates
  var existingData = sheet.getDataRange().getValues();
  var existingKeys = {};
  for (var i = 1; i < existingData.length; i++) {
    var subject = existingData[i][15];
    var emailDate = existingData[i][16];
    existingKeys[subject + '|' + emailDate] = true;
  }

  // Search Gmail
  var threads = GmailApp.search(CONFIG.SEARCH_QUERY, 0, CONFIG.MAX_EMAILS);
  var newCount = 0;

  for (var t = 0; t < threads.length; t++) {
    var messages = threads[t].getMessages();
    for (var m = 0; m < messages.length; m++) {
      var message = messages[m];
      var msgSubject = message.getSubject();
      var msgEmailDate = message.getDate().toISOString().slice(0, 10);
      var key = msgSubject + '|' + msgEmailDate;

      if (existingKeys[key]) continue;

      var body = message.getPlainBody();
      var from = message.getFrom();

      var parsed = parsePayStubContent(body, from, msgSubject, msgEmailDate);

      if (parsed && parsed.gross_pay > 0) {
        sheet.appendRow([
          parsed.pay_period_start,
          parsed.pay_period_end,
          parsed.pay_date,
          parsed.employer_name,
          parsed.gross_pay,
          parsed.federal_tax,
          parsed.state_tax,
          parsed.social_security,
          parsed.medicare,
          parsed.other_deductions,
          parsed.other_deductions_label,
          parsed.net_pay,
          parsed.regular_hours,
          parsed.overtime_hours,
          parsed.hourly_rate,
          msgSubject,
          msgEmailDate,
          new Date().toISOString(),
        ]);
        existingKeys[key] = true;
        newCount++;
      }
    }
  }

  Logger.log('Processed ' + newCount + ' new pay stub emails.');
  return newCount;
}

/**
 * Parse pay stub data from email body text.
 * Uses regex patterns to extract financial data.
 */
function parsePayStubContent(plainBody, from, subject, emailDate) {
  var text = plainBody || '';
  var result = {
    pay_period_start: '',
    pay_period_end: '',
    pay_date: emailDate,
    employer_name: detectEmployer(from, subject),
    gross_pay: 0,
    federal_tax: 0,
    state_tax: 0,
    social_security: 0,
    medicare: 0,
    other_deductions: 0,
    other_deductions_label: '',
    net_pay: 0,
    regular_hours: 0,
    overtime_hours: 0,
    hourly_rate: 0,
  };

  // Extract dollar amounts with common labels
  var patterns = {
    gross_pay: /(?:gross\s*(?:pay|earnings?|amount)|total\s*earnings?)\s*[:$]?\s*\$?([\d,]+\.?\d*)/i,
    net_pay: /(?:net\s*(?:pay|earnings?|amount)|take[- ]?home|direct\s*deposit\s*(?:amount)?)\s*[:$]?\s*\$?([\d,]+\.?\d*)/i,
    federal_tax: /(?:federal\s*(?:income\s*)?(?:tax|withholding)|fed\s*tax|FIT)\s*[:$]?\s*\$?([\d,]+\.?\d*)/i,
    state_tax: /(?:state\s*(?:income\s*)?(?:tax|withholding)|SIT)\s*[:$]?\s*\$?([\d,]+\.?\d*)/i,
    social_security: /(?:social\s*security|FICA[- ]SS|OASDI)\s*[:$]?\s*\$?([\d,]+\.?\d*)/i,
    medicare: /(?:medicare|FICA[- ]Med)\s*[:$]?\s*\$?([\d,]+\.?\d*)/i,
    regular_hours: /(?:regular\s*hours?|hours?\s*worked|total\s*hours?)\s*[:=]?\s*([\d.]+)/i,
    overtime_hours: /(?:overtime\s*hours?|OT\s*hours?)\s*[:=]?\s*([\d.]+)/i,
    hourly_rate: /(?:hourly\s*rate|rate\s*of\s*pay|pay\s*rate)\s*[:$]?\s*\$?([\d.]+)/i,
  };

  var keys = Object.keys(patterns);
  for (var k = 0; k < keys.length; k++) {
    var match = text.match(patterns[keys[k]]);
    if (match) {
      result[keys[k]] = parseFloat(match[1].replace(/,/g, '')) || 0;
    }
  }

  // Extract pay period dates
  var periodMatch = text.match(
    /(?:pay\s*period|period)\s*[:=]?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\s*(?:to|through|[-–])\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i
  );
  if (periodMatch) {
    result.pay_period_start = normalizeDate(periodMatch[1]);
    result.pay_period_end = normalizeDate(periodMatch[2]);
  }

  // Extract pay date
  var payDateMatch = text.match(
    /(?:pay\s*date|check\s*date|payment\s*date)\s*[:=]?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i
  );
  if (payDateMatch) {
    result.pay_date = normalizeDate(payDateMatch[1]);
  }

  // If net_pay is 0 but gross_pay exists, estimate net from deductions
  if (result.net_pay === 0 && result.gross_pay > 0) {
    var totalDeductions = result.federal_tax + result.state_tax +
      result.social_security + result.medicare + result.other_deductions;
    result.net_pay = result.gross_pay - totalDeductions;
  }

  return result;
}

/**
 * Detect employer name from email sender and subject.
 */
function detectEmployer(from, subject) {
  for (var i = 0; i < CONFIG.EMPLOYER_PATTERNS.length; i++) {
    if (from.toLowerCase().indexOf(CONFIG.EMPLOYER_PATTERNS[i].from.toLowerCase()) !== -1) {
      return CONFIG.EMPLOYER_PATTERNS[i].employer;
    }
  }
  // Try to extract company name from email domain
  var domainMatch = from.match(/@([^.>]+)/);
  if (domainMatch) {
    var domain = domainMatch[1];
    var generic = ['gmail', 'yahoo', 'outlook', 'hotmail'];
    if (generic.indexOf(domain.toLowerCase()) === -1) {
      return domain.charAt(0).toUpperCase() + domain.slice(1);
    }
  }
  return 'Unknown';
}

/**
 * Normalize date strings to YYYY-MM-DD format.
 */
function normalizeDate(dateStr) {
  var parts = dateStr.split(/[\/\-]/);
  if (parts.length !== 3) return dateStr;
  var month = parts[0];
  var day = parts[1];
  var year = parts[2];
  if (year.length === 2) year = '20' + year;
  while (month.length < 2) month = '0' + month;
  while (day.length < 2) day = '0' + day;
  return year + '-' + month + '-' + day;
}

/**
 * Run once to set up the automatic time-driven trigger.
 */
function setupTrigger() {
  // Remove existing triggers to avoid duplicates
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'parsePayStubEmails') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }

  // Create new trigger: every 6 hours
  ScriptApp.newTrigger('parsePayStubEmails')
    .timeBased()
    .everyHours(6)
    .create();

  Logger.log('Trigger set up: parsePayStubEmails will run every 6 hours.');
}

/**
 * Web app endpoint — allows the Next.js client to trigger a manual check or read data.
 * Deploy as web app: Execute as "Me", Access "Anyone".
 *
 * Usage:
 *   GET ?action=check-gmail  — trigger a manual email check
 *   GET                      — return all pay stub data as JSON
 */
function doGet(e) {
  var action = e && e.parameter && e.parameter.action;

  if (action === 'check-gmail') {
    var count = parsePayStubEmails();
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, newStubs: count })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  // Default: return the pay stub sheet data as JSON
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: 'PayStubs sheet not found' })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var rows = [];
  for (var i = 1; i < data.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j].toString().toLowerCase().replace(/\s+/g, '_')] = data[i][j];
    }
    rows.push(obj);
  }

  return ContentService.createTextOutput(
    JSON.stringify({ paystubs: rows, count: rows.length })
  ).setMimeType(ContentService.MimeType.JSON);
}
