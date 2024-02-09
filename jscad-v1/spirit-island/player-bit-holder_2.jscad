function main() {
  return playerBitHolder({});
}

/*-------------------------------------------------------------------------------------------------
  ------------------------ From here on: Touch with caution! ----------------------------------------
  -------------------------------------------------------------------------------------------------*/

function playerBitHolder({
  totalX = 67.5, // totalY / 2
  totalY = 52,
  totalZ = 13.25, // reminderD / 2 + floorStrength
  influenceD = 15.75,
  influenceStackHeight = 40,
  reminderD = 21.5,
  wallStrength = 1,
  magnetD = 2.2,
  magnetH = 1.2,
}) {
  const x = totalX;
  const y = totalY;
  const z = totalZ;

  const box = cube([x, y, z]);

  const influenceCutout = cylinder({ d: influenceD, h: influenceStackHeight }).rotateY(90).translate([wallStrength, 0, z]);

  const influenceCutout1 = influenceCutout.translate([0, influenceD / 2 + wallStrength, 0]);
  const influenceCutout2 = influenceCutout.translate([x - influenceStackHeight - reminderD - 3 * wallStrength, y / 2, 0]);
  const influenceCutout3 = influenceCutout1.translate([0, y - 2 * wallStrength - influenceD, 0]);

  const reminderCutout = cylinder({ d: reminderD, h: influenceD }).rotateY(90).rotateZ(90).translate([0, 0, z]);

  const reminderCutout1 = reminderCutout.translate([influenceStackHeight + 2 * wallStrength + reminderD / 2, wallStrength, 0]);
  const reminderCutout2 = reminderCutout.translate([x - reminderD / 2 - wallStrength, y / 2 - influenceD / 2, 0]);
  const reminderCutout3 = reminderCutout.translate([influenceStackHeight + 2 * wallStrength + reminderD / 2, y - wallStrength - influenceD, 0]);

  const magnetCutout = cylinder({ d: magnetD, h: magnetH }).translate([0, 0, z - magnetH]);

  const magnetCutout1 = magnetCutout.translate([x - wallStrength - magnetD / 2, influenceD / 2 + wallStrength, 0]);
  const magnetCutout2 = magnetCutout.translate([x - wallStrength - magnetD / 2, y - (influenceD / 2 + wallStrength), 0]);
  const magnetCutout3 = magnetCutout.translate([wallStrength + magnetD / 2, y / 2, 0]);

  return union(
    difference(
      box,
      influenceCutout1,
      influenceCutout2,
      influenceCutout3,
      // reminderFingerCutout,
      reminderCutout1,
      reminderCutout2,
      reminderCutout3,
      magnetCutout1,
      magnetCutout2,
      magnetCutout3
      // reminderCutout2,
      // reminderConnection1,
      // reminderConnection2
    )
  );
}
