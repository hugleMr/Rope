// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Logic from "./logic";
import RopeLinePoint from "./rope-line-point";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RopeRender extends cc.Component {
    private ropePointList: RopeLinePoint[] = [];
    onLoad() {
        this.initRope();
    }

    updateRenderPonits(points: cc.Vec2[]) {
        if (points.length <= 0) return;
        var listPoints = Logic.catmullRomSpline(points, 10, 0.1);
        // console.log("listPoints : ", listPoints);
        this.ropePointList = this.createRopePointList(listPoints);
        this.updateGridSize(cc.size(3, this.ropePointList.length));
    }

    onEnable() {
        // super.onEnable();
        this.updateSimulator();
    }
    updateGridSize(size: cc.Size) {
        this._gridSize = size;
        this.updateAssembler();
    }
    updateAssembler() {
        // this._assembler && this._assembler.updateComData(this),
        //     this._assembler && this._assembler.updateRenderData(this);
    }
    _resetAssembler() {
        // var t = new c.default();
        // (this._assembler = t), t.init(this);
    }
    _updateMaterial() {
        // var t = this.getMaterial(0);
        // t &&
        //     (t.define("CC_USE_MODEL", 1),
        //     this.ropeTexture && t.setProperty("texture", this.ropeTexture));
    }
    updateMaterial() {
        // this.ropeTexture &&
        //     (this._updateMaterial(), (this._initedMaterial = !0));
    }
    getRopePointList() {
        return this.ropePointList;
    }
    initRope() {
        this.updateRenderPonits(this.ropeLinePoint);
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

    getPointList() {
        for (var t = [], e = this.ropePointList, o = 0; o < e.length; o++) {
            var r = e[o],
                i = (e[o - 1], e[o + 1], r.left),
                n = r.right,
                c = r.center;
            t.push(i), t.push(c), t.push(n);
        }
        return t;
    }
    updateSimulator() {}
    update() {
        //this._initedMaterial || this.updateMaterial(), this.setVertsDirty();
    }

    //===========prop

    @property
    get gridSize() {
        return this._gridSize;
    }
    _gridSize: cc.Size = cc.Size.ZERO.clone();

    @property
    get ropeRenderType() {
        return this.type;
    }
    type = 0;

    @property
    ropeWidth: number = 0;

    @property
    minPointDis: number = 0;

    @property(cc.Texture2D)
    ropeTexture: cc.Texture2D = null;

    @property([cc.Vec2])
    get ropeLinePoint() {
        return this._ropeLinePoint;
    }
    set ropeLinePoint(points: cc.Vec2[]) {
        this._ropeLinePoint = points;
        this.initRope();
    }
    _ropeLinePoint: cc.Vec2[] = [];
}
