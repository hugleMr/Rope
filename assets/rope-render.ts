// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import RopeLinePoint from "./rope-line-point";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RopeRender extends cc.Component {
    onLoad() {
        this.initRope();
    }

    updateRenderPonits() {
        var e = h(t, this.minPointDis, 0.1),
            o = this.createRopePointList(e);
        (this.ropePointList = o),
            this.updateGridSize(cc.size(3, this.ropePointList.length));
    }
    onEnable() {
        t.prototype.onEnable.call(this), this.updateSimulator();
    }
    updateGridSize(t) {
        (this._gridSize = t), this.updateAssembler();
    }
    updateAssembler() {
        this._assembler && this._assembler.updateComData(this),
            this._assembler && this._assembler.updateRenderData(this);
    }
    _resetAssembler() {
        var t = new c.default();
        (this._assembler = t), t.init(this);
    }
    _updateMaterial() {
        var t = this.getMaterial(0);
        t &&
            (t.define("CC_USE_MODEL", 1),
            this.ropeTexture && t.setProperty("texture", this.ropeTexture));
    }
    updateMaterial() {
        this.ropeTexture &&
            (this._updateMaterial(), (this._initedMaterial = !0));
    }
    getRopePointList() {
        return this.ropePointList;
    }
    initRope() {
        this.updateRenderPonits(this.ropeLinePoint);
    }
    createRopePointList(t) {
        for (var e = [], o = 0; o < t.length; o++) {
            var r = t[o] || cc.v2(0, 0),
                i = t[o - 1] || cc.v2(0, 0),
                n = t[o + 1] || cc.v2(0, 0);
            Math.atan2(n.y - i.y, n.x - i.y),
                o == t.length - 1 &&
                    (Math.atan2(r.y - i.y, r.x - i.x), (n = r));
            var c = n.sub(i),
                s = c.mag(),
                p = c.x / s,
                a = c.y / s,
                h = cc.v2(r.x + this.ropeWidth * a, r.y - this.ropeWidth * p),
                d = cc.v2(r.x - this.ropeWidth * a, r.y + this.ropeWidth * p),
                l = new u(r, h, d);
            l.calculateDis(e[e.length - 1]);
            var f = Math.floor(l.len / this.ropeTexture.height),
                y = e[e.length - 1]
                    ? Math.floor(e[e.length - 1].len / this.ropeTexture.height)
                    : 0;
            if ((e.push(l), f != y)) {
                l.repeatEnd = !0;
                var v = new u(r, h, d);
                v.calculateDis(e[e.length - 1]),
                    e.push(v),
                    (v.repeatStart = !0);
            }
        }
        return e;
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
        this._initedMaterial || this.updateMaterial(), this.setVertsDirty();
    }

    initRope() {}

    updateMaterial() {}

    //===========prop

    @property
    get gridSize() {
        return this._gridSize;
    }
    _gridSize: cc.Vec2 = null;

    @property
    get ropeRenderType() {
        return this.type;
    }
    type = 0;

    @property
    get ropeWidth() {
        return this._ropeWidth;
    }
    set ropeWidth(value: number) {
        this._ropeWidth = value;
        this.initRope();
    }
    _ropeWidth: number = 0;

    @property
    get minPointDis() {
        return this._minPointDis;
    }
    set minPointDis(value: number) {
        this._minPointDis = value;
        this.initRope();
    }
    _minPointDis: number = 0;

    @property
    get ropeTexture() {
        return this._ropeTexture;
    }
    set ropeTexture(texture: cc.Texture2D) {
        this._ropeTexture = texture;
        this.updateMaterial();
    }
    _ropeTexture: cc.Texture2D = null;

    @property
    get ropeLinePoint() {
        return this._ropeLinePoint;
    }
    set ropeLinePoint(point: RopeLinePoint) {
        this._ropeLinePoint = point;
        this.initRope();
    }
    _ropeLinePoint: RopeLinePoint = null;
}
