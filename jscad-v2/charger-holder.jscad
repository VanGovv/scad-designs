const jscad = require("@jscad/modeling");

const { union } = jscad.booleans;
const { extrudeLinear } = jscad.extrusions;
const { hullChain } = jscad.hulls;
const { cuboid, circle } = jscad.primitives;
const { vectorText } = jscad.text;
const { translate, align } = jscad.transforms;
const { subtract } = jscad.booleans;
const beveledCube = require("../beveledCube.jscad").main;

const getParameterDefinitions = () => {
    return [
        { name: "markerWidth", type: "int", initial: 10, caption: "Marker Width" },
        { name: "markerDepth", type: "int", initial: 10, caption: "Marker Depth" },
        { name: "height", type: "int", initial: 3, caption: "Height" },
        { name: "wallSize", type: "float", initial: 3, caption: "Wall size" },
        { name: "start", type: "int", initial: 1, caption: "Start" },
        { name: "steps", type: "int", initial: 1, caption: "Steps" },
        { name: "count", type: "int", initial: 10, caption: "Count" },
        { name: "fontHeight", type: "float", initial: 3, caption: "fontHeight" },
        { name: "textHeight", type: "float", initial: 2, caption: "textHeight" },
        { name: "textWidth", type: "float", initial: 1, caption: "textWidth" },
        { name: "textDistance", type: "float", initial: 1, caption: "textDistance" },
        {
            name: "type",
            type: "choice",
            caption: "Recess or extrude text",
            values: ["recess", "extrude"],
            initial: "recess",
        },
    ];
};

const main = ({ markerWidth, markerDepth, height, wallSize, start, steps, count, fontHeight, textHeight, textWidth, textDistance, type }) => {
    const add = [];
    const sub = [];

    const fullWidth = (markerWidth + wallSize) * count + wallSize;
    const fullDepth = markerDepth + wallSize * 2 + textDistance + fontHeight + textWidth;

    const base = translate(
        [fullWidth / 2, 0, height / 2],
        beveledCube({
            x: fullWidth,
            y: fullDepth,
            z: height,
            r: 1,
            exclude: ["t", "b"],
        })
    );

    for (let i = start; i < count * steps; i+=steps) {
        const lineCorner = circle({ radius: textWidth / 2 });

        const lineSegmentPointArrays = vectorText({
            height: fontHeight,
            input: (i + 1).toString(),
        }); // line segments for each character
        const lineSegments = [];
        lineSegmentPointArrays.forEach((segmentPoints) => {
            // process the line segment
            const corners = segmentPoints.map((point) => translate(point, lineCorner));
            lineSegments.push(hullChain(corners));
        });
        const message2D = union(lineSegments);
        const message3D = extrudeLinear({ height: textHeight }, message2D);
        (type === 'recess' ? sub : add).push(
            translate(
                [
                    (markerWidth + wallSize) * i + wallSize + markerWidth / 2,
                    fullDepth / 2 - textWidth / 2 - fontHeight - wallSize,
                    (type === 'recess' ? height - textHeight : height),
                ],
                align({ modes: ["center"], relativeTo: [0, 0, 0], grouped: true }, message3D)
            )
        );

        const cubeCutout = cuboid({ size: [markerWidth, markerDepth, height] });

        sub.push(
            translate(
                [
                    (markerWidth + wallSize) * i + markerWidth / 2 + wallSize,
                    -fullDepth / 2 + markerDepth / 2 + wallSize,
                    height / 2,
                ],
                cubeCutout
            )
        );
    }

    return translate([-fullWidth /2, 0, 0], subtract(union(base, add), sub));
};

module.exports = { main, getParameterDefinitions };
