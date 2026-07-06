export function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

export function describeAnnularSector(x, y, innerRadius, outerRadius, startAngle, endAngle) {
  const startOuter = polarToCartesian(x, y, outerRadius, endAngle);
  const endOuter = polarToCartesian(x, y, outerRadius, startAngle);
  const startInner = polarToCartesian(x, y, innerRadius, endAngle);
  const endInner = polarToCartesian(x, y, innerRadius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  const d = [
    "M", startOuter.x, startOuter.y,
    "A", outerRadius, outerRadius, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
    "L", endInner.x, endInner.y,
    "A", innerRadius, innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y,
    "Z"
  ].join(" ");

  return d;
}

export function generateStadiumData(gates, levels, capacity) {
  const centerX = 400;
  const centerY = 300;
  const baseInnerRadius = 80;
  const ringThickness = Math.max(30, Math.min(80, capacity / (levels * 1000))); // Dynamic thickness based on capacity
  const gapAngle = gates > 0 ? Math.min(15, 360 / (gates * 3)) : 0; // The physical gate gaps

  const sections = [];

  for (let level = 0; level < levels; level++) {
    const innerRadius = baseInnerRadius + (level * (ringThickness + 10));
    const outerRadius = innerRadius + ringThickness;
    
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
        path: describeAnnularSector(centerX, centerY, innerRadius, outerRadius, startAngle, endAngle),
        status: status,
        level: level + 1,
        gate: g + 1
      });
    }
  }

  return sections;
}
