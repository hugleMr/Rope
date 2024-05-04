// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import TouchNode from "./touch-node";
const { ccclass, property } = cc._decorator;

@ccclass
export default class RopeNode extends cc.Component {
    @property(cc.Node)
    touchNode: cc.Node = null;
    @property(cc.Node)
    touchNode2: cc.Node = null;
    @property(cc.Node)
    renderNode: cc.Node = null;

    @property
    fixed: boolean = false;
    @property
    ropeLength: number = 12;
    @property
    nodeNum: number = 32;

    ropePoints: RopePoint[] = [];

    start() {
        const len = this.ropeLength;
        for (let i = 0; i < this.nodeNum; i++) {
            var point = new RopePoint();
            if (i == 0) point.init(0, 0, len, 0);
            else {
                const p = this.ropePoints[i - 1];
                const x = p.len * Math.cos(p.angle);
                const y = p.len * Math.sin(p.angle);
                const newPoint = cc.v2(p.position.x + x, p.position.y + y);
                point.init(newPoint.x, newPoint.y, len, -i);
            }
            this.ropePoints.push(point);
        }
        this.update();
    }

    update() {
        for (var t = this.ropePoints.length - 1; t >= 0; t--) {
            var e = this.ropePoints[t];
            if (t == this.ropePoints.length - 1)
                e.updatePosition(cc.v2(this.touchNode.position));
            else {
                var o = this.ropePoints[t + 1];
                e.updatePosition(o.position);
            }
        }
        if (this.touchNode2)
            for (t = 0; t < this.ropePoints.length; t++)
                (e = this.ropePoints[t]),
                    0 == t
                        ? e.updatePosition(cc.v2(this.touchNode2.position))
                        : ((o = this.ropePoints[t - 1]),
                          e.updatePosition(o.position));
        if (this.fixed)
            for (
                this.ropePoints[0].position = cc.Vec2.ZERO, t = 1;
                t < this.ropePoints.length;
                t++
            )
                (e = this.ropePoints[t]),
                    (o = this.ropePoints[t - 1]),
                    e.updatePosition(o.position);
        this.updateTarget();
    }

    updateTarget() {
        for (var t = [], e = 0; e < this.ropePoints.length; e++) {
            var o = this.ropePoints[e];
            t.push(o.position);
        }
        this.renderNode.getComponent(c.default).updateRenderPonits(t);
    }
}

export class RopePoint {
    position: cc.Vec2;
    angle: number = 0;
    len: number = 0;
    init(x: number, y: number, len: number, angle: number) {
        this.position = cc.v2(x, y);
        this.len = len;
        this.angle = angle;
    }
    updatePosition(pos: cc.Vec2) {
        var posAdd = pos.sub(this.position).normalizeSelf();
        this.angle = Math.atan2(posAdd.y, posAdd.x);
        posAdd = posAdd.mul(-1 * this.len);
        this.position = pos.add(posAdd);
    }
}
