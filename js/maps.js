/* PoCo Cycling - Leaflet + OSM maps from local GPX (no API key) */
(function () {
  function parseGpx(xmlText) {
    var doc = new DOMParser().parseFromString(xmlText, "application/xml");
    if (doc.querySelector("parsererror")) throw new Error("bad gpx");
    var pts = [];
    var nodes = doc.getElementsByTagName("trkpt");
    if (!nodes.length) nodes = doc.getElementsByTagName("rtept");
    for (var i = 0; i < nodes.length; i++) {
      var lat = parseFloat(nodes[i].getAttribute("lat"));
      var lon = parseFloat(nodes[i].getAttribute("lon"));
      if (!isNaN(lat) && !isNaN(lon)) pts.push([lat, lon]);
    }
    return pts;
  }

  function initMap(el) {
    var gpxUrl = el.getAttribute("data-gpx");
    if (!gpxUrl || typeof L === "undefined") return;
    var map = L.map(el, { scrollWheelZoom: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>"
    }).addTo(map);
    var color = el.getAttribute("data-color") || "#3d6b4f";
    fetch(gpxUrl)
      .then(function (r) {
        if (!r.ok) throw new Error("fetch failed");
        return r.text();
      })
      .then(function (txt) {
        var pts = parseGpx(txt);
        if (!pts.length) throw new Error("no points");
        var line = L.polyline(pts, { color: color, weight: 4, opacity: 0.9 }).addTo(map);
        map.fitBounds(line.getBounds(), { padding: [16, 16] });
        L.circleMarker(pts[0], { radius: 6, color: "#111", fillColor: "#fff", fillOpacity: 1, weight: 2 }).addTo(map);
        L.circleMarker(pts[pts.length - 1], { radius: 6, color: "#111", fillColor: color, fillOpacity: 1, weight: 2 }).addTo(map);
      })
      .catch(function () {
        el.classList.add("route-map-error");
        el.textContent = "Map could not load this GPX file.";
      });
    setTimeout(function () { map.invalidateSize(); }, 200);
  }

  document.querySelectorAll(".route-map[data-gpx]").forEach(initMap);
})();
