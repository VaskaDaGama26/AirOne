import { geojson } from "./data.js";

let map = null;
let activePopup = null;

// Цвета для каждого эмирата
const emirateColors = {
  Dubai: { fill: "#e87c5a", stroke: "#f0a882" },
  "Abu Dhabi": { fill: "#5a7ce8", stroke: "#82a0f0" },
  Sharjah: { fill: "#5ae8a0", stroke: "#82f0c0" },
  Ajman: { fill: "#e8c55a", stroke: "#f0d882" },
  "Ras Al Khaimah": { fill: "#c55ae8", stroke: "#d882f0" },
  Fujairah: { fill: "#5ac5e8", stroke: "#82d8f0" },
  "Umm Al Quwain": { fill: "#e85a7c", stroke: "#f082a0" },
};

function getColor(name) {
  return emirateColors[name] || { fill: "#7c8db0", stroke: "#a0b0cc" };
}

function initMap() {
  // Центр UAE
  map = L.map("map", {
    center: [24.4, 54.6],
    zoom: 7,
    zoomControl: true,
    attributionControl: true,
  });

  // CartoDB Dark Matter tiles
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 19,
  }).addTo(map);

  // Рисуем GeoJSON поверх тайлов
  L.geoJSON(geojson, {
    style: function (feature) {
      const name = feature.properties.name;
      const colors = getColor(name);
      return {
        fillColor: colors.fill,
        fillOpacity: 0.35,
        color: colors.stroke,
        weight: 1.5,
        opacity: 0.7,
      };
    },
    onEachFeature: function (feature, layer) {
      const name = feature.properties.name;
      const colors = getColor(name);

      // Hover
      layer.on("mouseover", function (e) {
        layer.setStyle({
          fillOpacity: 0.6,
          weight: 2.5,
          color: "#ffffff",
        });

        showHoverTooltip(e.originalEvent, name);
      });

      layer.on("mousemove", function (e) {
        moveHoverTooltip(e.originalEvent);
      });

      layer.on("mouseout", function () {
        layer.setStyle({
          fillColor: colors.fill,
          fillOpacity: 0.35,
          color: colors.stroke,
          weight: 1.5,
          opacity: 0.7,
        });
        hideHoverTooltip();
      });

      // Click — детальный попап
      layer.on("click", function (e) {
        L.DomEvent.stopPropagation(e);
        showDetailPopup(e.latlng, feature.properties);
      });
    },
  }).addTo(map);

  // Клик по карте — закрываем попап
  map.on("click", function () {
    hideDetailPopup();
  });
}

/* ── Hover tooltip ── */
let hoverEl = null;

function showHoverTooltip(event, name) {
  hideHoverTooltip();
  hoverEl = document.createElement("div");
  hoverEl.className = "map-hover-tooltip";
  hoverEl.innerHTML = `<span class="pin">📍</span> <strong>${name}</strong> <span class="hint">click for details</span>`;
  document.body.appendChild(hoverEl);
  positionTooltip(hoverEl, event, 180, 44);
}

function moveHoverTooltip(event) {
  if (hoverEl) positionTooltip(hoverEl, event, 180, 44);
}

function hideHoverTooltip() {
  if (hoverEl) {
    hoverEl.remove();
    hoverEl = null;
  }
}

/* ── Detail popup ── */
function showDetailPopup(latlng, props) {
  hideDetailPopup();

  const name = props.name || "";
  const description = props.description || [];
  const why = props.why || [];
  const developers = props.developers || [];
  const img = props.img ? `<img class="popup-image" src="${props.img}" />` : "";

  const descHTML = description.length
    ? description.map((d) => `<p>${d}</p>`).join("")
    : "";

  const whyHTML = why.length
    ? `<div class="popup-section"><strong>Why investors choose ${name}:</strong><ul>${why
        .map((i) => `<li>${i}</li>`)
        .join("")}</ul></div>`
    : "";

  const devHTML = developers.length
    ? `<div class="popup-section"><strong>Major developers:</strong><ul>${developers
        .map((i) => `<li>${i}</li>`)
        .join("")}</ul></div>`
    : "";

  const popup = L.popup({
    maxWidth: 320,
    className: "map-detail-popup",
    closeButton: true,
    autoClose: true,
    closeOnEscapeKey: true,
  })
    .setLatLng(latlng)
    .setContent(
      `
      <div class="popup-inner">
        <div class="popup-header">📍 ${name}</div>
        <div class="popup-body">
          ${img}
          ${descHTML}
          ${devHTML}
          ${whyHTML}
        </div>
        <div class="popup-footer">click map to close</div>
      </div>
    `,
    )
    .addTo(map);

  activePopup = popup;
}

function hideDetailPopup() {
  if (activePopup) {
    activePopup.remove();
    activePopup = null;
  }
}

/* ── Utils ── */
function positionTooltip(el, event, w, h) {
  const ww = window.innerWidth;
  const wh = window.innerHeight;
  let left = event.pageX + 15;
  let top = event.pageY - 40;
  if (left + w > ww) left = event.pageX - w - 15;
  if (left < 0) left = 10;
  if (top + h > wh) top = event.pageY - h - 10;
  if (top < 0) top = 10;
  el.style.left = left + "px";
  el.style.top = top + "px";
}

/* ── Init ── */
initMap();
