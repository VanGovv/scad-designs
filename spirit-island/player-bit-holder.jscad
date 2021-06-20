function main() {
  return playerBitHolder({});
}

/*-------------------------------------------------------------------------------------------------
  ------------------------ From here on: Touch with caution! ----------------------------------------
  -------------------------------------------------------------------------------------------------*/

function playerBitHolder({
  totalX = 26.5, // totalY / 2
  totalY = 53,
  totalZ = 11.25, // reminderD / 2 + floorStrength
  influenceD = 15.75,
  influenceRecess = 2,
  reminderD = 21.5,
  reminderH = 2.4,
  wallStrength = 0.5,
  floorStrength = .5,
  magnetD = 2.2,
  magnetH = 1.2,
}) {
  const x = totalX;
  const y = totalY;
  const z = reminderD / 2 + floorStrength;

  const box = cube([x, y, z]);

  const influenceCutout = cylinder({ d: influenceD, h: x - 2 * wallStrength })
    .rotateY(90)
    .translate([wallStrength, 0, z]);

  const influenceCutout1 = influenceCutout.translate([0, influenceD / 2 + wallStrength, 0]);
  const influenceCutout2 = influenceCutout1.translate([0, y - 2 * wallStrength - influenceD, 0]);

  const reminderCutout = cylinder({ d: reminderD, h: 3 * reminderH })
    .rotateY(90)
    .translate([0, y / 2, z]);

  const reminderCutout1 = reminderCutout.translate([(x + 2 * wallStrength - 6 * reminderH) / 4, 0, 0]);
  const reminderCutout2 = reminderCutout.translate([0.75 * x - 0.5 * wallStrength - 1.5 * reminderH, 0, 0]);

  const reminderFingerCutout = cylinder({ d: (reminderD / 3) * 2, h: x })
    .rotateY(90)
    .translate([0, y / 2, z]);

  const reminderConnection = cube([3 * reminderH, reminderD + influenceD, influenceRecess]).translate([
    0,
    influenceD / 2,
    z - influenceRecess,
  ]);

  const reminderConnection1 = reminderConnection.translate([
    (x + 2 * wallStrength - 6 * reminderH) / 4,
    0,
    0,
  ]);
  const reminderConnection2 = reminderConnection.translate([
    0.75 * x - 0.5 * wallStrength - 1.5 * reminderH,
    0,
    0,
  ]);

  const magnetCutout = cylinder({ d: magnetD, h: magnetH }).translate([x / 2, 0, z - magnetH]);

  const magnetCutout1 = magnetCutout.translate([0, y / 2 + (5 * reminderD) / 12, 0]);
  const magnetCutout2 = magnetCutout.translate([0, y / 2 - (5 * reminderD) / 12, 0]);

  return union(
    difference(
      box,
      influenceCutout1,
      influenceCutout2,
      reminderFingerCutout,
      reminderCutout1,
      reminderCutout2,
      reminderConnection1,
      reminderConnection2,
      magnetCutout1,
      magnetCutout2
    )
  );
}
