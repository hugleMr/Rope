import RopeRender from "./rope-render";

const { ccclass, property } = cc._decorator;

export class RoleLine {
    public ropePointNodes: cc.Node[] = [];
    constructor() {
        this.ropePointNodes = [];
    }
}

@ccclass("PointList")
export class PointList {
    @property(cc.Node) posA: cc.Node = null;
    @property(cc.Node) posB: cc.Node = null;
}

@ccclass
export default class PhysicRopeNode extends cc.Component {
    @property(cc.Node)
    pointPrefab: cc.Node = null;
    @property(cc.Node)
    renderRopePrefab: cc.Node = null;
    @property(cc.Node)
    ropeContent: cc.Node = null;

    @property(PointList)
    pointList: PointList[] = [];
    private lines: RoleLine[] = [];
    private renderRope: cc.Node[] = [];

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
    }

    start() {
        for (let obj of this.pointList) {
            this.draw(obj.posA, obj.posB);
        }
    }

    draw(pointA: cc.Node, pointB: cc.Node) {
        const posA = pointA.getPosition();
        const posB = pointB.getPosition();
        const distance = cc.Vec2.distance(posA, posB);
        console.log("distance : ", distance);
        let e: cc.Node[] = [];
        const numberOfPoints = Math.ceil(distance / 32);
        for (let k = 0; k < numberOfPoints; k++) {
            let pointNode = cc.instantiate(this.pointPrefab);
            const rig = pointNode.getComponent(cc.RigidBody);
            var t = k / numberOfPoints;
            const x = posA.x * (1 - t) + posB.x * t;
            const y = posA.y * (1 - t) + posB.y * t;
            pointNode.x = x;
            pointNode.y = y;
            pointNode.active = true;
            pointNode.parent = this.ropeContent;
            if (0 == k) rig.type = cc.RigidBodyType.Animated;
            else {
                rig.type = cc.RigidBodyType.Dynamic;
                var prevNode = e[k - 1];
                var joint = pointNode.addComponent(cc.DistanceJoint);
                joint.connectedBody = prevNode.getComponent(cc.RigidBody);
                joint.distance = 40;
            }
            e.push(pointNode);
            if (0 !== k && numberOfPoints - 1 != k) {
                pointNode.on(
                    cc.Node.EventType.TOUCH_END,
                    () => {
                        this.cutRope(pointNode);
                    },
                    this
                );
            } else {
                pointNode.on(
                    cc.Node.EventType.TOUCH_MOVE,
                    function (e) {
                        pointNode.x += e.getDeltaX();
                        pointNode.y += e.getDeltaY();
                    },
                    this
                );
                if (k == 0) {
                    e[0].x = posA.x;
                    e[0].y = posA.y;
                    e[0].getComponent(cc.RigidBody).type =
                        cc.RigidBodyType.Static;
                    e[0].addComponent(cc.DistanceJoint);
                } else {
                    e[e.length - 1].x = posB.x;
                    e[e.length - 1].y = posB.y;
                    e[e.length - 1].getComponent(cc.RigidBody).type =
                        cc.RigidBodyType.Static;
                    e[e.length - 1].addComponent(cc.DistanceJoint);
                }
            }
        }

        var n = new RoleLine();
        n.ropePointNodes = e;
        this.lines.push(n);
    }

    cutRope(pointNode: cc.Node) {
        for (var e = 0; e < this.lines.length; e++) {
            var line = this.lines[e];
            const r = line.ropePointNodes.indexOf(pointNode);
            if (-1 != r) {
                pointNode.removeComponent(cc.DistanceJoint);
                var n = line.ropePointNodes.slice(0, r);
                let c = line.ropePointNodes.slice(r);
                line.ropePointNodes = n;
                var s = new RoleLine();
                return (s.ropePointNodes = c), void this.lines.push(s);
            }
        }
    }

    update() {
        for (var t = 0; t < this.lines.length; t++) {
            var e = this.lines[t];
            var o = [];
            var r = this.renderRope[t];
            if (!r) {
                r = cc.instantiate(this.renderRopePrefab);
                r.parent = this.node;
                r.zIndex = -1;
                r.active = true;
                r.x = 0;
                r.y = 0;
                this.renderRope[t] = r;
            }
            for (var i = 0; i < e.ropePointNodes.length; i++) {
                var n = e.ropePointNodes[i];
                o.push(n.getPosition());
            }
            const comp = r.getComponent(RopeRender);
            comp?.updateRenderPonits(o);
        }
    }
}
