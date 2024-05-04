// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import RopeLinePoint from "./rope-line-point";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {
    private ropeWidth: number = 50;
    @property(cc.Texture2D)
    ropeTexture: cc.Texture2D = null;
    @property(cc.Vec2)
    points: cc.Vec2[] = [];
    /** Create rope data, according to the rope trajectory*/

    protected onLoad(): void {
        console.log(this.createRopePointList(this.points));
    }

    createRopePointList(points: cc.Vec2[]) {
        let repePointList: RopeLinePoint[] = [];

        for (let i = 0; i < points.length; i++) {
            const curRopePoint = points[i] || cc.v2(0, 0);

            const lastRopePoint = points[i - 1] || cc.v2(0, 0);

            let nextRopePoint = points[i + 1] || cc.v2(0, 0);

            let radian = Math.atan2(
                nextRopePoint.y - lastRopePoint.y,
                nextRopePoint.x - lastRopePoint.y
            );

            if (i == points.length - 1) {
                radian = Math.atan2(
                    curRopePoint.y - lastRopePoint.y,
                    curRopePoint.x - lastRopePoint.x
                );

                nextRopePoint = curRopePoint;
            }

            const dir = nextRopePoint.sub(lastRopePoint);

            const dis = dir.mag();

            const unitDx = dir.x / dis;

            const unitDy = dir.y / dis;

            // Get two positions from the left and right points of the rope to keep the width consistent

            let left = cc.v2(
                curRopePoint.x + this.ropeWidth * unitDy,
                curRopePoint.y - this.ropeWidth * unitDx
            );

            let right = cc.v2(
                curRopePoint.x - this.ropeWidth * unitDy,
                curRopePoint.y + this.ropeWidth * unitDx
            );

            // Calculate the current rope distance

            let ropePoint = new RopeLinePoint(curRopePoint, left, right);

            ropePoint.calculateDis(repePointList[repePointList.length - 1]);

            let index = Math.floor(ropePoint.len / this.ropeTexture.height);

            let lastIndex = repePointList[repePointList.length - 1]
                ? Math.floor(
                      repePointList[repePointList.length - 1].len /
                          this.ropeTexture.height
                  )
                : 0;

            repePointList.push(ropePoint);

            if (index != lastIndex) {
                // Here is to be 0.9 ~ 0.1 when sampling in UV, add 1 and 0 in the middle, transition
                ropePoint.repeatEnd = true;

                let tempRopePoint = new RopeLinePoint(
                    curRopePoint,
                    left,
                    right
                );

                tempRopePoint.calculateDis(
                    repePointList[repePointList.length - 1]
                ); // Calculation distance

                repePointList.push(tempRopePoint);
                // Here is to be 0.9 ~ 0.1 when sampling in UV, add 1 and 0 in the middle, transition
                tempRopePoint.repeatStart = true;
            }
        }

        return repePointList;
    }
}
