const ROOMS = ["Room A", "Room B", "Room C"];

const SESSIONS = [
  { id: "S1", label: "Session 1", starts_at: "09:00" },
  { id: "S2", label: "Session 2", starts_at: "11:00" },
  { id: "S3", label: "Session 3", starts_at: "13:30" },
];

const FAKE_ROSTER = [
  { code: "SPIKETEST1", first_name: "Alex", team_id: "T01", room: "Room A" },
  { code: "SPIKETEST2", first_name: "Sam", team_id: "T02", room: "Room B" },
  { code: "SPIKETEST3", first_name: "Noor", team_id: "T03", room: "Room C" },
];

function doPost(e) {
  const receivedAt = new Date().toISOString();

  let request;
  try {
    request = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse_({ ok: false, error: "invalid_json", received_at: receivedAt });
  }

  if (!isValidPin_(request.pin)) {
    return jsonResponse_({ ok: false, error: "invalid_pin", received_at: receivedAt });
  }

  switch (request.action) {
    case "roster":
      return jsonResponse_({
        ok: true,
        rooms: ROOMS,
        sessions: SESSIONS,
        roster: FAKE_ROSTER,
        received_at: receivedAt,
      });
    case "scans":
      return jsonResponse_({
        ok: true,
        batch_id: request.batch_id,
        received: (request.scans || []).map((scan) => scan.scan_id),
        received_at: receivedAt,
      });
    default:
      return jsonResponse_({ ok: false, error: "unknown_action", received_at: receivedAt });
  }
}

function isValidPin_(pin) {
  const expected = PropertiesService.getScriptProperties().getProperty("SPIKE_PIN");
  return Boolean(expected) && pin === expected;
}

function jsonResponse_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
