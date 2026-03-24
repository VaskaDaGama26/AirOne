import { geojson } from "./data.js";

let svg, path, projection, width, height;
let centerLon, centerLat, minLon, maxLon, minLat, maxLat;
let activeTooltip = null;
let activePopup = null;

function calculateBounds() {
  const allPoints = [];
  geojson.features.forEach((feature) => {
    const coords = feature.geometry.coordinates;
    if (feature.geometry.type === "Polygon") {
      allPoints.push(...coords[0]);
    } else if (feature.geometry.type === "MultiPolygon") {
      coords.forEach((poly) => allPoints.push(...poly[0]));
    }
  });

  const lons = allPoints.map((p) => p[0]);
  const lats = allPoints.map((p) => p[1]);
  minLon = Math.min(...lons);
  maxLon = Math.max(...lons);
  minLat = Math.min(...lats);
  maxLat = Math.max(...lats);
  centerLon = (minLon + maxLon) / 2;
  centerLat = (minLat + maxLat) / 2;
}

function calculateScale(width, height) {
  const padding = 50;
  const tempProj = d3
    .geoEquirectangular()
    .center([centerLon, centerLat])
    .translate([width / 2, height / 2]);

  const topLeft = tempProj([minLon, maxLat]);
  const bottomRight = tempProj([maxLon, minLat]);

  if (
    topLeft &&
    bottomRight &&
    isFinite(topLeft[0]) &&
    isFinite(bottomRight[0])
  ) {
    const scaleX =
      (width - 2 * padding) / Math.abs(bottomRight[0] - topLeft[0]);
    const scaleY =
      (height - 2 * padding) / Math.abs(bottomRight[1] - topLeft[1]);
    if (window.innerWidth >= 769) {
      return Math.min(scaleX, scaleY) * 150;
    }
    return Math.min(scaleX, scaleY) * 175;
  }
  return 50000;
}

function hideHoverTooltip() {
  if (activeTooltip) {
    activeTooltip.remove();
    activeTooltip = null;
  }
}

function hidePopup() {
  if (activePopup) {
    activePopup.remove();
    activePopup = null;
  }
}

function showHoverTooltip(event, feature) {
  hideHoverTooltip();

  const name = feature.properties.name || feature.properties.Emirate;

  const tooltipWidth = 180;
  const tooltipHeight = 50;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  let left = event.pageX + 15;
  let top = event.pageY - 40;

  if (left + tooltipWidth > windowWidth) {
    left = event.pageX - tooltipWidth - 15;
  }
  if (left < 0) left = 10;

  if (top + tooltipHeight > windowHeight) {
    top = event.pageY - tooltipHeight - 10;
  }
  if (top < 0) top = 10;

  activeTooltip = d3
    .select("body")
    .append("div")
    .attr("class", "hover-tooltip")
    .style("left", left + "px")
    .style("top", top + "px").html(`
      <div class="hover-tooltip__content">
        <span>📍</span>
        <span><strong>${name}</strong></span>
        <span style="font-size: 12px; opacity: 0.8;">(click for details)</span>
      </div>
    `);
}

function showPopup(event, feature) {
  hidePopup();
  hideHoverTooltip();

  const tooltipWidth = 280;
  const tooltipHeight = 200;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  let left = event.pageX + 15;
  let top = event.pageY - 40;

  if (left + tooltipWidth > windowWidth) {
    left = event.pageX - tooltipWidth - 15;
  }
  if (left < 0) left = 10;

  if (top + tooltipHeight > windowHeight) {
    top = event.pageY - tooltipHeight - 10;
  }
  if (top < 0) top = 10;

  const name = feature.properties.name || feature.properties.Emirate;
  const description =
    feature.properties.description && feature.properties.description !== null
      ? `<div style="margin-top: 10px;">
      ${feature.properties.description
        .map((item) => `<span>${item}</span><br><br>`)
        .join("")}
      </div>`
      : "";

  const why =
    feature.properties.why && feature.properties.why.length
      ? `
    <div style="margin-top: 10px;">
      <strong>Why investors choose ${name}:</strong>
      <ul style="margin: 8px 0 0 8px; padding: 0;">
        ${feature.properties.why
          .map((item) => `<li style="margin: 4px 0;">• ${item}</li>`)
          .join("")}
      </ul>
    </div>`
      : "";

  const developers =
    feature.properties.developers && feature.properties.developers.length
      ? `
    <div style="margin-top: 10px;">
      <strong>Major developers:</strong>
      <ul style="margin: 8px 0 0 8px; padding: 0;">
        ${feature.properties.developers
          .map((item) => `<li style="margin: 4px 0;">• ${item}</li>`)
          .join("")}
      </ul>
    </div>`
      : "";

  // Создаем детальный поповер
  activePopup = d3
    .select("body")
    .append("div")
    .attr("class", "popup-tooltip")
    .style("left", left + "px")
    .style("top", top + "px")
    .html(`
      <div style="position: relative;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <strong>📍 ${name}</strong>
          <button 
            onclick="this.parentElement.parentElement.parentElement.remove(); activePopup = null;"
            style="background: none; border: none; font-size: 18px; cursor: pointer; color: #999; padding: 0 4px;"
            onmouseover="this.style.color='#666'"
            onmouseout="this.style.color='#999'"
          >✕</button>
        </div>
        ${description}
        ${developers}
        ${why}
        <div style="margin-top: 12px; font-size: 11px; color: #999; border-top: 1px solid #ffdcd4; padding-top: 8px; text-align: center;">
          click anywhere to close
        </div>
      </div>
    `);
}

function drawMap() {
  const container = document.getElementById("map").getBoundingClientRect();
  width = container.width;
  height = container.height;

  if (!svg) {
    svg = d3.select("#map").append("svg").style("border-radius", "12px");
  }

  svg.attr("width", width).attr("height", height);

  const scale = calculateScale(width, height);

  projection = d3
    .geoEquirectangular()
    .center([centerLon, centerLat])
    .scale(scale)
    .translate([width / 2, height / 2]);

  path = d3.geoPath().projection(projection);

  svg.selectAll("path").remove();

  geojson.features.forEach((feature) => {
    const color =
      feature.properties.fill || feature.properties.stroke || "#1f2336";

    svg
      .append("path")
      .datum(feature)
      .attr("d", path)
      .attr("fill", color)
      .attr("fill-opacity", 0.65)
      .attr("stroke-width", 1)
      .attr("stroke", "#252b48")
      .style("cursor", "pointer")
      .style("z-index", "1")
      .style("transition", "all 0.2s")
      .on("mouseenter", function (event, d) {
        d3.select(this)
          .attr("stroke-width", 2.5)
          .attr("stroke", "#ffdcd4")
          .attr("fill-opacity", 0.85)
          .style("z-index", "10");

        showHoverTooltip(event, d);
      })
      .on("mousemove", function (event, d) {
        if (activeTooltip) {
          const tooltipWidth = 180;
          const tooltipHeight = 50;
          const windowWidth = window.innerWidth;
          const windowHeight = window.innerHeight;

          let left = event.pageX + 15;
          let top = event.pageY - 40;

          if (left + tooltipWidth > windowWidth) {
            left = event.pageX - tooltipWidth - 15;
          }
          if (left < 0) left = 10;

          if (top + tooltipHeight > windowHeight) {
            top = event.pageY - tooltipHeight - 10;
          }
          if (top < 0) top = 10;

          activeTooltip.style("left", left + "px").style("top", top + "px");
        }
      })
      .on("mouseleave", function () {
        d3.select(this)
          .attr("stroke-width", 1)
          .attr("stroke", "#252b48")
          .attr("fill-opacity", 0.65)
          .style("z-index", "1");

        hideHoverTooltip();
      })
      .on("click", function (event, d) {
        event.stopPropagation();
        // Показываем детальный поповер
        showPopup(event, d);
      });
  });

  svg.on("click", function (event) {
    if (event.target === svg.node()) {
      hidePopup();
      hideHoverTooltip();
    }
  });
}

function handleResize() {
  if (geojson.features.length === 0) return;
  drawMap();
}

if (geojson.features.length > 0) {
  calculateBounds();
  drawMap();
  window.addEventListener("resize", handleResize);
}

document.body.addEventListener("click", function (event) {
  if (
    !event.target.closest(".popup-tooltip") &&
    !event.target.closest("path")
  ) {
    hidePopup();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    hidePopup();
  }
});
