export function polarToCartesian(centerX, centerY, radiusX, radiusY, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radiusX * Math.cos(angleInRadians)),
    y: centerY + (radiusY * Math.sin(angleInRadians))
  };
}

export function describeAnnularSector(x, y, innerRadiusX, innerRadiusY, outerRadiusX, outerRadiusY, startAngle, endAngle) {
  const startOuter = polarToCartesian(x, y, outerRadiusX, outerRadiusY, endAngle);
  const endOuter = polarToCartesian(x, y, outerRadiusX, outerRadiusY, startAngle);
  const startInner = polarToCartesian(x, y, innerRadiusX, innerRadiusY, endAngle);
  const endInner = polarToCartesian(x, y, innerRadiusX, innerRadiusY, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  const d = [
    "M", startOuter.x, startOuter.y,
    "A", outerRadiusX, outerRadiusY, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
    "L", endInner.x, endInner.y,
    "A", innerRadiusX, innerRadiusY, 0, largeArcFlag, 1, startInner.x, startInner.y,
    "Z"
  ].join(" ");

  return d;
}

export function generateStadiumData(gates, levels, capacity) {
  const centerX = 400;
  const centerY = 300;
  const baseInnerRadiusX = 140; // Wider to make it oval
  const baseInnerRadiusY = 80;  // Shorter height
  const ringThickness = Math.max(30, Math.min(80, capacity / (levels * 1000))); // Dynamic thickness based on capacity
  const gapAngle = gates > 0 ? Math.min(15, 360 / (gates * 3)) : 0; // The physical gate gaps

  const sections = [];

  for (let level = 0; level < levels; level++) {
    const innerRadiusX = baseInnerRadiusX + (level * (ringThickness + 10));
    const innerRadiusY = baseInnerRadiusY + (level * (ringThickness + 10));
    const outerRadiusX = innerRadiusX + ringThickness;
    const outerRadiusY = innerRadiusY + ringThickness;
    
    // If gates = 0, just one solid ring
    const numGates = Math.max(1, gates);
    const sliceAngle = gates > 0 ? (360 - (numGates * gapAngle)) / numGates : 360;

    for (let g = 0; g < numGates; g++) {
      const startAngle = g * (sliceAngle + gapAngle);
      let endAngle = startAngle + sliceAngle;
      
      // If it's a solid ring without gates, end angle is 359.99 to avoid SVG arc clipping issues
      if (gates === 0) endAngle = startAngle + 359.99;

      // Assign a random density and derive status
      const density = Math.floor(Math.random() * 100);
      let status = 'normal';
      if (density > 90) status = 'critical';
      else if (density > 75) status = 'warning';

      sections.push({
        id: `L${level + 1}-G${g + 1}`,
        name: `Level ${level + 1}, Gate ${g + 1}`,
        density: density,
        path: describeAnnularSector(centerX, centerY, innerRadiusX, innerRadiusY, outerRadiusX, outerRadiusY, startAngle, endAngle),
        status: status,
        level: level + 1,
        gate: g + 1
      });
    }
  }

  return sections;
}
