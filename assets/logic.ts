export default class Logic {
    // generate point between 2 points
    static generatePointsBetween(
        startPoint: cc.Vec2,
        endPoint: cc.Vec2,
        numberOfPoints: number
    ) {
        var points = [];
        for (var i = 0; i <= numberOfPoints; i++) {
            var t = i / numberOfPoints;
            var x = startPoint.x * (1 - t) + endPoint.x * t;
            var y = startPoint.y * (1 - t) + endPoint.y * t;
            points.push(cc.v2(x, y)); // Assuming you're using Cocos Creator's cc.v2 for 2D vectors
        }
        return points;
    }

    //Obtain interpolation

    static cardinalSplineAt(p0, p1, p2, p3, tension, t) {
        var t2 = t * t;

        var t3 = t2 * t;

        /*

     * Formula: s(-ttt + 2tt - t)P1 + s(-ttt + tt)P2 + (2ttt - 3tt + 1)P2 + s(ttt - 2tt + t)P3 + (-2ttt + 3tt)P3 + s(ttt - tt)P4

     */

        var s = (1 - tension) / 2;

        var b1 = s * (-t3 + 2 * t2 - t); // s(-t3 + 2 t2 - t)P1

        var b2 = s * (-t3 + t2) + (2 * t3 - 3 * t2 + 1); // s(-t3 + t2)P2 + (2 t3 - 3 t2 + 1)P2

        var b3 = s * (t3 - 2 * t2 + t) + (-2 * t3 + 3 * t2); // s(t3 - 2 t2 + t)P3 + (-2 t3 + 3 t2)P3

        var b4 = s * (t3 - t2); // s(t3 - t2)P4

        var x = p0.x * b1 + p1.x * b2 + p2.x * b3 + p3.x * b4;

        var y = p0.y * b1 + p1.y * b2 + p2.y * b3 + p3.y * b4;

        return cc.v2(x, y);
    }

    // Obtain data points based on index

    static getControlPointAt(controlPoints: cc.Vec2[], pos: number) {
        var p = Math.min(controlPoints.length - 1, Math.max(pos, 0));

        return controlPoints[p];
    }

    // According to the input point array, get the curve

    static catmullRomSpline(
        points: cc.Vec2[],
        minSeg: number,
        alpha: number
    ): cc.Vec2[] {
        const result: cc.Vec2[] = [];
        result.push(points[0]);

        for (let i = 0; i < points.length; i++) {
            let start = points[i];

            let end = points[i + 1];

            if (!end) continue;

            let dis = start.sub(end).mag();

            let count = Math.floor(dis / minSeg);

            let p0 = this.getControlPointAt(points, i - 1);

            let p1 = this.getControlPointAt(points, i - 0);

            let p2 = this.getControlPointAt(points, i + 1);

            let p3 = this.getControlPointAt(points, i + 2);

            for (let t = 0; t <= 1; t += 1 / count) {
                const x = this.cardinalSplineAt(
                    p0,

                    p1,

                    p2,

                    p3,

                    alpha,
                    t
                );

                result.push(x);

                // console.log(result.length, x)
            }
        }

        // Add the last point

        return result;
    }
}
