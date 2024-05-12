// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class RopeAssembler extends cc.Component {
    private verticesCount = 4;
    private indicesCount = 6;
    private floatsPerVert = 5;
    private colorOffset = 4;
    private renderData = null;
    // getBuffer() {
    //     return cc.renderer._handle.getBuffer("mesh", this.getVfmt());
    // }
    // init(e) {
    //     super.init(e);
    //     this.updateComData(e);
    // }
    // updateComData(t) {
    //     (this.verticesCount = t.gridSize.width * t.gridSize.height),
    //         (this.indicesCount =
    //             (t.gridSize.width - 1) * (t.gridSize.height - 1) * 6),
    //         (this.renderData = new cc.RenderData()),
    //         this.renderData.init(this);
    //     var e = this.renderData;
    //     e.createFlexData(
    //         0,
    //         this.verticesCount,
    //         this.indicesCount,
    //         this.getVfmt()
    //     );
    //     for (
    //         var o = t.gridSize.width,
    //             r = e.iDatas[0],
    //             i = r.length / 6,
    //             n = 0,
    //             c = 0,
    //             s = 0;
    //         c < i;
    //         c++
    //     ) {
    //         c % (t.gridSize.width - 1) == 0 && 0 != c && n++;
    //         var p = n;
    //         (r[s++] = p),
    //             (r[s++] = p + 1),
    //             (r[s++] = p + 1 + o),
    //             (r[s++] = p + 1 + o),
    //             (r[s++] = p + o),
    //             (r[s++] = p),
    //             n++;
    //     }
    // }
    // updateColor(t, e) {
    //     var o = this.renderData.uintVDatas[0];
    //     if (o) {
    //         e = null != e ? e : t.node.color._val;
    //         for (
    //             var r = this.floatsPerVert, i = this.colorOffset, n = o.length;
    //             i < n;
    //             i += r
    //         )
    //             o[i] = e;
    //     }
    // }
    // getDecimalPart(t) {
    //     return t - Math.floor(t);
    // }
    // updateRenderData(t) {
    //     if (t) {
    //         var e = t.getRopePointList();
    //         if (e.length < 2) return;
    //         t.gridSize.width, t.gridSize.height, t.node;
    //         for (
    //             var o = this.floatsPerVert,
    //                 r = this.renderData.vDatas[0],
    //                 i = 0,
    //                 c = 0;
    //             c < e.length;
    //             c++
    //         ) {
    //             var s = e[c],
    //                 p = 3 * c,
    //                 a = c / (e.length - 1);
    //             t.ropeRenderType != n.RopeRenderType.Stretch &&
    //                 ((a = (s.len / t.ropeTexture.height) % 1),
    //                 s.repeatEnd && (a = 1),
    //                 s.repeatStart && (a = 0)),
    //                 (r[(i = o * p)] = s.left.x),
    //                 (r[i + 1] = s.left.y),
    //                 (r[i + 2] = 0),
    //                 (r[i + 3] = a),
    //                 (i += o),
    //                 (r[(i = o * (p + 1))] = s.center.x),
    //                 (r[i + 1] = s.center.y),
    //                 (r[i + 2] = 0.5),
    //                 (r[i + 3] = a),
    //                 (i += o),
    //                 (r[(i = o * (p + 2))] = s.right.x),
    //                 (r[i + 1] = s.right.y),
    //                 (r[i + 2] = 1),
    //                 (r[i + 3] = a),
    //                 (i += o);
    //         }
    //         this.updateColor(t, null);
    //     }
    // }
    // fillBuffers() {
    //     var t = this.renderData,
    //         e = t.vDatas[0],
    //         o = t.iDatas[0],
    //         r = this.getBuffer(),
    //         i = r.request(this.verticesCount, this.indicesCount),
    //         n = i.byteOffset >> 2,
    //         c = r._vData;
    //     e.length + n > c.length
    //         ? c.set(e.subarray(0, c.length - n), n)
    //         : c.set(e, n);
    //     for (
    //         var s = r._iData,
    //             p = i.indiceOffset,
    //             a = i.vertexOffset,
    //             h = 0,
    //             u = o.length;
    //         h < u;
    //         h++
    //     )
    //         s[p++] = a + o[h];
    // }
}
