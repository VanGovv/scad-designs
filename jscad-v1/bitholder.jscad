function vsub(v1, v2) {
  return v1.map((v, i) => v - v2[i]);
}

function main() {
  // adjust to your requirements. No value may be 0 or missing. Double check resulting model!
  // Changing setting outside of these is not necessary most of the time
  let config = {
    containerSize: [85, 85, 20],

    magnetRadius: 3,
    magnetHeight: 3,
  };

  return bitHolder(config);
}

function bitHolder({
  containerSize,
  magnetRadius,
  magnetHeight,
  bevelRadius = 5,
  floorStrenth = 1,
  wallSize = magnetHeight + 1,
}) {
  let container = cube({ size: containerSize, center: true });

  container = difference(
    container,
    cube({
      size: vsub(containerSize, [wallSize, wallSize, floorStrenth]),
      center: true,
    }).translate([0, 0, wallSize / 2])
  );

  container.properties.leftConnector = new CSG.Connector(
    [-containerSize[0] / 2, 0, 0],
    [1, 0, 0],
    [0, 0, 0]
  );

  // let magnetConnector = [[0, 0, off], [0, 0, 1], 0];
  // let leftMagnetConnector = [[-containerSize[0] / 2, 0, 0], [1, 0, 0], 0];
  // let rightMagnetConnector = [[containerSize[0] / 2, 0, 0], [-1, 0, 0], 0];
  // let frontMagnetConnector = [[0, containerSize[0] / 2, 0], [0, -1, 0], 0];
  // let backMagnetConnector = [[0, -containerSize[0] / 2, 0], [0, 1, 0], 0];

  let magnet = cylinder({ r: magnetRadius, h: magnetHeight, center: true });
  magnet.properties.connector = new CSG.Connector(
    [0, 0, -magnetHeight / 2],
    [0, 0, 1],
    [0, 0, 0]
  );

  return magnet
container =  union(
    container,
    magnet.transform(container.properties.leftConnector.getTransformationTo(magnet.properties.connector, true, 0))
)
  // attach(leftMagnetConnector, magnetConnector) cylinder(d = magnetDiameter, h = magnetHeight + off);
  // attach(rightMagnetConnector, magnetConnector) cylinder(d = magnetDiameter, h = magnetHeight + off);
  // attach(frontMagnetConnector, magnetConnector) cylinder(d = magnetDiameter, h = magnetHeight + off);
  // attach(backMagnetConnector, magnetConnector) cylinder(d = magnetDiameter, h = magnetHeight + off);

  return container;
}

/*
// input vars
containerSize = [85, 85, 20];
containerFloorStrength = 1;
containerWallStrength = 4;
bevelRadius = 5;
bevelResolution = 10;
magnetDiameter = 6;
magnetHeight = 3;

// imports
use <obiscad/bevel.scad>
use <obiscad/attach.scad>




// calculated vars
off = 0.1;

innerContainerPosition = [0, 0, containerFloorStrength];
innerContainerSize = containerSize - [containerWallStrength * 2, containerWallStrength * 2, 0]; // don't substract floor strengt to make sure that inner box exceeds outer box's boudaries

magnetConnector = [[0, 0, off], [0, 0, 1], 0];
leftMagnetConnector = [[-containerSize[0] / 2, 0, 0], [1, 0, 0], 0];
rightMagnetConnector = [[containerSize[0] / 2, 0, 0], [-1, 0, 0], 0];
frontMagnetConnector = [[0, containerSize[0] / 2, 0], [0, -1, 0], 0];
backMagnetConnector = [[0, -containerSize[0] / 2, 0], [0, 1, 0], 0];


module beveledCube (size = [85, 85, 20], bevelRadius = 5, bevelResolution = 10, debug = false) {

    // floor back
    ec1 = [[0, size[1] / 2, -size[2] / 2], [1, 0, 0]];   // Kante die abgerundet werden soll
    en1 = [ec1[0], [0, 1, -1]];   // Ausrichtung der Abrundung

    // floor front
    ec2 = [[0, -size[1] / 2, -size[2] / 2], [1, 0, 0]];
    en2 = [ec2[0], [0, -1, -1]];

    // floor right
    ec3 = [[size[0] / 2, 0, -size[2] / 2], [0, 1, 0]];
    en3 = [ec3[0], [1, 0, -1]];

    // floor left
    ec4 = [[-size[0] / 2, 0, -size[2] / 2], [0, 1, 0]];
    en4 = [ec4[0], [-1, 0, -1]];

    // bevel side edges
    ec5 = [[-size[0] / 2, -size[1] / 2, 0], [0, 0, 1]];
    en5 = [ec5[0], [-1, -1, 0]];

    ec6 = [[size[0] / 2, -size[1] / 2, 0], [0, 0, 1]];
    en6 = [ec6[0], [1, -1, 0]];

    ec7 = [[-size[0] / 2, size[1] / 2, 0], [0, 0, 1]];
    en7 = [ec7[0], [-1, 1, 0]];

    ec8 = [[size[0] / 2, size[1] / 2, 0], [0, 0, 1]];
    en8 = [ec8[0], [1, 1, 0]];

    difference() {
        cube(size = size, center = true);

        if (debug) {
            #union() {
                bevel(ec1, en1, cr = bevelRadius, cres = bevelResolution, l = size[0] + 2);
                bevel(ec2, en2, cr = bevelRadius, cres = bevelResolution, l = size[0] + 2);
                bevel(ec3, en3, cr = bevelRadius, cres = bevelResolution, l = size[1] + 2);
                bevel(ec4, en4, cr = bevelRadius, cres = bevelResolution, l = size[1] + 2);
                bevel(ec5, en5, cr = bevelRadius, cres = bevelResolution, l = size[2] + 2);
                bevel(ec6, en6, cr = bevelRadius, cres = bevelResolution, l = size[2] + 2);
                bevel(ec7, en7, cr = bevelRadius, cres = bevelResolution, l = size[2] + 2);
                bevel(ec8, en8, cr = bevelRadius, cres = bevelResolution, l = size[2] + 2);
            };
        } else {
            union() {
                bevel(ec1, en1, cr = bevelRadius, cres = bevelResolution, l = size[0] + 2);
                bevel(ec2, en2, cr = bevelRadius, cres = bevelResolution, l = size[0] + 2);
                bevel(ec3, en3, cr = bevelRadius, cres = bevelResolution, l = size[1] + 2);
                bevel(ec4, en4, cr = bevelRadius, cres = bevelResolution, l = size[1] + 2);
                bevel(ec5, en5, cr = bevelRadius, cres = bevelResolution, l = size[2] + 2);
                bevel(ec6, en6, cr = bevelRadius, cres = bevelResolution, l = size[2] + 2);
                bevel(ec7, en7, cr = bevelRadius, cres = bevelResolution, l = size[2] + 2);
                bevel(ec8, en8, cr = bevelRadius, cres = bevelResolution, l = size[2] + 2);
            };
        };
    };
};


difference() {
    beveledCube(size = containerSize, debug = true);
    translate(innerContainerPosition) {
        beveledCube(size = innerContainerSize);
    };

    attach(leftMagnetConnector, magnetConnector) cylinder(d = magnetDiameter, h = magnetHeight + off);
    attach(rightMagnetConnector, magnetConnector) cylinder(d = magnetDiameter, h = magnetHeight + off);
    attach(frontMagnetConnector, magnetConnector) cylinder(d = magnetDiameter, h = magnetHeight + off);
    attach(backMagnetConnector, magnetConnector) cylinder(d = magnetDiameter, h = magnetHeight + off);
};*/
