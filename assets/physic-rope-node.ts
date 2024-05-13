import RopeRender from "./rope-render";

const { ccclass, property } = cc._decorator;

export class RoleLine {
    public ropePointNodes: cc.Node[] = [];
    constructor() {
        this.ropePointNodes = [];
    }
}

@ccclass
export default class PhysicRopeNode extends cc.Component {
    @property(cc.Node)
    pointPrefab: cc.Node = null;
    @property(cc.Node)
    renderRopePrefab: cc.Node = null;
    @property(cc.Node)
    ropeContent: cc.Node = null;

    private lines: RoleLine[] = [];
    private renderRope: cc.Node[] = [];

    onLoad() {
        cc.director.getPhysicsManager().enabled = !0;
    }
    start() {
        let e: cc.Node[] = [];
        const TOTAl = 20;
        for (let k = 0; k < TOTAl; k++) {
            let pointNode = cc.instantiate(this.pointPrefab);
            const rig = pointNode.getComponent(cc.RigidBody);
            pointNode.x = (600 * k) / TOTAl - 300;
            pointNode.y = TOTAl * k;
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
            if (0 !== k && TOTAl - 1 != k) {
                pointNode.on(
                    cc.Node.EventType.TOUCH_END,
                    () => {
                        this.cutRope(pointNode);
                    },
                    this
                );
            } else {
                if (k == 0) {
                    e[0].x = -200;
                    e[0].y = 0;
                    e[0].getComponent(cc.RigidBody).type =
                        cc.RigidBodyType.Static;
                    e[0].addComponent(cc.DistanceJoint);
                } else {
                    e[e.length - 1].x = 200;
                    e[e.length - 1].y = 0;
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
