function main() {

    const citadel = {
      height: 20,
      bottleDiameter: 32.5,
      capDiameter: 20,
      columnWidth: 15,
      xCount: 2,
      yCount: 5,
    }

    const vallejo = {
      height: 40,
      bottleDiameter: 26,
      capDiameter: 8,
      columnWidth: 12,
      xCount: 2,
      yCount: 6,
    }


    return bottleHolder(vallejo)
  }
  /*-------------------------------------------------------------------------------------------------
  ------------------------ From here on: Touch with caution! ----------------------------------------
  -------------------------------------------------------------------------------------------------*/

  function bottleHolder({
    height,
    bottleDiameter,
    capDiameter,
    columnWidth,
    xCount,
    yCount,
    fullWidth = 169.2,
    floorStrength = 2,
  }) {

    const width = fullWidth / yCount;

    const body = cube([width, width, height])

    const topCutout = cylinder({r: bottleDiameter/2, h: height-floorStrength}).translate([width/2,width/2,floorStrength])
    const bottomCutout = cylinder({r: capDiameter/2, h: floorStrength}).translate([width/2,width/2,0])
   
    const centerCutout = union(
      cube([bottleDiameter - columnWidth, width,height-floorStrength]).translate([(width-bottleDiameter+columnWidth)/2,0,floorStrength]),
      cube([width, bottleDiameter -columnWidth,height-floorStrength]).translate([0, (width-bottleDiameter+columnWidth)/2,floorStrength])
    )

    const single = difference(body, topCutout, bottomCutout, centerCutout)

    let x = []
    
    for (let i = 0;  i<xCount; i++ ) {
      for (let j = 0;  j<yCount; j++ ) {
        x.push(single.translate([width*j,width*i,0]))
      }
    }

    return union(...x)
  }
  