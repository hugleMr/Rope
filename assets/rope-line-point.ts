// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

export default class RopeLinePoint {
    center: cc.Vec2;
    left: cc.Vec2;
    right: cc.Vec2;
    dis: number = 0;
    len: number = 0;
    repeatStart: boolean = false;
    repeatEnd: boolean = false;

    constructor(center: cc.Vec2, left: cc.Vec2, right: cc.Vec2) {
        this.center = center;
        this.left = left;
        this.right = right;
    }

    calculateDis(rope: RopeLinePoint) {
        if (rope) {
            this.dis += this.center.sub(rope.center).mag();
            this.len = rope.len + this.dis;
        }
    }
}
