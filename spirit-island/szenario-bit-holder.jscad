function main() {

  const szenarioBits = {
    x : 80,
    y : 54.5,
    z : 22.5, // (totalZ - (reminderD / 2 + floorStrength) * 2) / 2 - floorStrength;
    wallStrength : 2,
    floorStrength : 2,
    magnetD : 5.2,
    magnetH : 1.1,
    innerBevel : 10,
    outerBevel : 0,
    compartments : 1
  }

  // return beveledCube([30,20,10], 5, ['b'])


  return bitHolder(szenarioBits);
}

/*-------------------------------------------------------------------------------------------------
    ------------------------ From here on: Touch with caution! ----------------------------------------
    -------------------------------------------------------------------------------------------------*/

function bitHolder({
  x,
  y,
  z,
  magnetD = 0,
  magnetH = 0,
  wallStrength = 2,
  floorStrength = 2,
  innerBevel = 0,
  outerBevel = 0,
  compartments = 1
}) {

  const block = beveledCube([x, y, z], outerBevel, ['t']);

  const cutoutX = beveledCube([x - wallStrength * 4 - magnetD * 2, y - wallStrength * 2, z-floorStrength], innerBevel, ['t']).translate([wallStrength * 2 + magnetD, wallStrength, floorStrength])
  
  const cutoutY = beveledCube([x - wallStrength * 2, y - wallStrength * 4 - magnetD * 2, z-floorStrength], innerBevel, ['t']).translate([wallStrength, wallStrength*2 + magnetD, floorStrength])
  
  const magnetCutout1 = cylinder({d: magnetD, h: magnetH}).translate([wallStrength+magnetD/2, wallStrength+magnetD/2, z-magnetH])
  const magnetCutout2 = cylinder({d: magnetD, h: magnetH}).translate([x - (wallStrength+magnetD/2), wallStrength+magnetD/2, z-magnetH])
  const magnetCutout3 = cylinder({d: magnetD, h: magnetH}).translate([wallStrength+magnetD/2, y - (wallStrength+magnetD/2), z-magnetH])
  const magnetCutout4 = cylinder({d: magnetD, h: magnetH}).translate([x - (wallStrength+magnetD/2), y - (wallStrength+magnetD/2), z-magnetH])

  const magnetBevel1 = bevel(z-floorStrength-magnetD, (magnetD + wallStrength) / 2).translate([wallStrength*2+magnetD-(innerBevel + wallStrength)/2,wallStrength*2+magnetD-(innerBevel + wallStrength)/2,floorStrength+magnetD])
  const magnetBevel2 = bevel(z-floorStrength-magnetD, (magnetD + wallStrength) / 2).rotateZ(90).translate([(innerBevel + wallStrength)/2-2*wallStrength-magnetD+x,wallStrength*2+magnetD-(innerBevel + wallStrength)/2,floorStrength+magnetD])
  const magnetBevel3 = bevel(z-floorStrength-magnetD, (magnetD + wallStrength) / 2).rotateZ(180).translate([(innerBevel + wallStrength)/2-2*wallStrength-magnetD+x,(innerBevel + wallStrength)/2+y-2*wallStrength-magnetD,floorStrength+magnetD])
  const magnetBevel4 = bevel(z-floorStrength-magnetD, (magnetD + wallStrength) / 2).rotateZ(270).translate([wallStrength*2+magnetD-(innerBevel + wallStrength)/2,(innerBevel + wallStrength)/2+y-2*wallStrength-magnetD,floorStrength+magnetD])

  const holder = difference(block, cutoutX, cutoutY, magnetCutout1, magnetCutout2, magnetCutout3, magnetCutout4, magnetBevel1, magnetBevel2, magnetBevel3, magnetBevel4)

  return union(holder)
}


function beveledCube (
  dimensions,
  r,
  exclude = []
) {

  const [x, y, z] = dimensions;

  const c = cube([x,y,z]);

  const bevels = [];

  if (r) {
    if (exclude.includes('s'))  exclude.push('sw', 'se', 'ts', 'bs')
    if (exclude.includes('n'))  exclude.push('nw', 'ne', 'tn', 'bn')
    if (exclude.includes('e'))  exclude.push('ne', 'se', 'te', 'be')
    if (exclude.includes('w'))  exclude.push('nw', 'sw', 'tw', 'bw')
    if (exclude.includes('t'))  exclude.push('tw', 'tn', 'ts', 'te')
    if (exclude.includes('b'))  exclude.push('bw', 'bn', 'bs', 'be')
  
    if (!exclude.includes('nw')) bevels.push(bevel(z,r).rotateZ(0).translate([x-r,y-r,0]))
    if (!exclude.includes('sw')) bevels.push(bevel(z,r).rotateZ(90).translate([r,y-r,0]))
    if (!exclude.includes('se')) bevels.push(bevel(z,r).rotateZ(180).translate([r,r,0]))
    if (!exclude.includes('ne')) bevels.push(bevel(z,r).rotateZ(270).translate([x-r,r,0]))
  
    if (!exclude.includes('bs')) bevels.push(bevel(y,r).rotateX(0).rotateY(90).rotateZ(90).translate([r,0,r]))
    if (!exclude.includes('bn')) bevels.push(bevel(y,r).rotateX(0).rotateY(90).rotateZ(270).translate([x-r,y,r]))
    if (!exclude.includes('be')) bevels.push(bevel(x,r).rotateX(0).rotateY(90).rotateZ(180).translate([x,r,r]))
    if (!exclude.includes('bw')) bevels.push(bevel(x,r).rotateX(0).rotateY(90).rotateZ(0).translate([0,y-r,r]))
  
    if (!exclude.includes('tw')) bevels.push(bevel(x,r).rotateX(0).rotateY(-90).rotateZ(0).translate([x,y-r,z-r]))
    if (!exclude.includes('tn')) bevels.push(bevel(y,r).rotateX(90).rotateY(0).rotateZ(0).translate([x-r,y,z-r]))
    if (!exclude.includes('te')) bevels.push(bevel(x,r).rotateX(90).rotateY(0).rotateZ(-90).translate([x,r,z-r]))
    if (!exclude.includes('ts')) bevels.push(bevel(y,r).rotateX(0).rotateY(-90).rotateZ(90).translate([r,y,z-r]))
  }



  return difference(c , ...bevels) 



}

function bevel (h, r) {

  return difference(
    cube([r,r,h]),
    cylinder({r, h})
  )
}