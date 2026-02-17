export function Json(response, status, data) {
  response.writeHead(status, { "Content-type": "application/json" });
  response.end(JSON.stringify(data));
}
//yaaqoub@octicode.com
