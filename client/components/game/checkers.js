let startAngle = 0;
let endAngle = 2 * Math.PI;
let anticlockwise = true;

export default class Checkers {
  constructor(canvas) {
    if (!canvas) return;

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.width = canvas.width;
    this.height = canvas.height;

    this.init();

  }

  init() {

    // 棋盘的圆形的半径
    this.radius = 10;

    // 棋盘的坐标
    this.pos = {
      // {
      //   x: 1,  // 跳棋坐标系x
      //   y: 5,  // 跳棋坐标系y
      //   _x: 0,  // 实际上的垂直坐标系的x
      //   _y: 60  // 实际上的垂直坐标系的y
      // }
    };

    // 棋盘中被填棋子的坐标集合
    this.filled = {
      // ID: {
      //   ID: '1-5',
      //   palyerId: 'A',
      //   index: 0
      // }
    };

    // 坐标系区域的限制
    this.posRegions = [
      [5, 5], // y坐标为1，x的上限是5，下限是5
      [5, 6], // y坐标为2，x的上限是5，下限是6
      [5, 7],
      [5, 8],
      [1, 13],
      [2, 13],
      [3, 13],
      [4, 13],
      [5, 13],
      [5, 14],
      [5, 15],
      [5, 16],
      [5, 17],
      [10, 13],
      [11, 13],
      [12, 13],
      [13, 13]
    ];

    // 初始化的棋盘的6个区域内的坐标限制
    this.players = {
      A: {
        color: 'rgba(255, 165, 0, 1)',
        has: [
          [5, 1],
          [5, 2],
          [5, 3],
          [5, 4],
          [6, 2],
          [6, 3],
          [6, 4],
          [7, 3],
          [7, 4],
          [8, 4]
        ]
      },
      B: {
        color: 'rgba(0, 255, 0, 0.25)',
        has: [
          [10, 5],
          [11, 5],
          [12, 5],
          [13, 5],
          [11, 6],
          [12, 6],
          [13, 6],
          [12, 7],
          [13, 7],
          [13, 8]
        ]
      },
      C: {
        color: '#444',
        has: [
          [14, 10],
          [14, 11],
          [15, 11],
          [14, 12],
          [15, 12],
          [16, 12],
          [14, 13],
          [15, 13],
          [16, 13],
          [17, 13]
        ]
      },
      D: {
        color: '#444',
        has: [
          [10, 14],
          [11, 14],
          [12, 14],
          [13, 14],
          [11, 15],
          [12, 15],
          [13, 15],
          [12, 16],
          [13, 16],
          [13, 17]
        ]
      },
      E: {
        color: '#777',
        has: [
          [5, 10],
          [5, 11],
          [6, 11],
          [5, 12],
          [6, 12],
          [7, 12],
          [5, 13],
          [6, 13],
          [7, 13],
          [8, 13]
        ]
      },
      F: {
        color: '#000',
        has: [
          [1, 5],
          [2, 5],
          [3, 5],
          [4, 5],
          [2, 6],
          [3, 6],
          [4, 6],
          [3, 7],
          [4, 7],
          [4, 8]
        ]
      }
    };

    this.initBoard();
    this.initChess('A');
    this.initChess('D');

    this.initEvents();
  }

  initBoard() {

    const lineHeight = this.width / 14;
    const sapceX = lineHeight / 2;
    const padding = 20;

    this.posRegions.forEach((regions, i) => {
      let x = i + 1;
      let min = regions[0];
      let max = regions[1];
      for (let y = min; y <= max; y++) {
        // 需要修正一下 x 轴的距离
        let correct = 0;
        if (y < 5) correct = (5 - y) * sapceX;
        if (y > 5) correct = -(y - 5) * sapceX;
        let _x = i * lineHeight + correct + padding;
        let _y = y * lineHeight;
        this.strokeArc(_x, _y, this.radius);
        let ID = this.getID(x, y);
        this.pos[ID] = { x, y, _x, _y };
        // this.ctx.fillText(ID, _x - 15, _y + 5);
      }
    });
  }

  initChess(palyerId) {
    if (!this.players.hasOwnProperty(palyerId)) return;
    let palyer = this.players[palyerId];
    palyer.has.forEach((point, index) => {
      let ID = this.getID(...point);
      let pos = this.pos[ID];
      // 记录
      this.filled[ID] = { ID, palyerId, index };
      this.fillArc(pos._x, pos._y, this.radius * 1.2, palyer.color);
    });
  }

  // 点击事件
  initEvents() {
    this.canvas.addEventListener('click', (ev) => {
      let point = getPoint(ev);
      let chess = getChessByPoint(point);
      if (chess) return this.isLegalAction(chess);
      return this.clearSelect();
    }, false);

    const getPoint = (ev) => {
      if (ev.layerX || ev.layerX === 0) return {
        x: ev.layerX,
        y: ev.layerY
      };
      // Opera
      if (ev.offsetX || ev.offsetX === 0) return {
        x: ev.offsetX,
        y: ev.offsetY
      };
    };

    const getChessByPoint = (point) => {
      for (let i in this.pos) {
        let chess = this.pos[i];
        let a = ~~(point.x - chess._x);
        let b = ~~(point.y - chess._y);
        let len = Math.sqrt(a * a + b * b);
        if (len < this.radius) return chess;
      }
    };
  }

  removeEvent() {
    console.log('remove', this.canvas);
    for(var i in this.canvas) console.log(i);
    // this.canvas.removeEventListener('click');
  }

  setSelect(check) {
    this.select = check;
    // 绘制表示激活状态的小圆圈
    let nowPos = this.pos[check.ID];
    this.strokeArc(nowPos._x, nowPos._y, this.radius * 1.1);
  }

  clearSelect() {
    if (this.select) {
      // 先清理
      let oldPos = this.pos[this.select.ID];
      this.cleanArc(oldPos._x, oldPos._y, this.radius);
      // 如果之前是被填充的，继续填充一个颜色
      let check = this.isFilled(oldPos);
      if (check) this.fillArc(oldPos._x, oldPos._y, this.radius, this.players[check.palyerId].color);
    }
    this.select = null;
  }

  // 获得当前棋子的周围棋子
  getJoint(x, y) {
    if (!this.isLegalPosition(x, y)) return;
    const preX = x - 1;
    const nextX = x + 1;
    const preY = y - 1;
    const nextY = y + 1;
    return {
      topLeft: { x: preX, y: preY },
      right: { x: nextX, y: y },
      bottomRight: { x: nextX, y: nextY },
      bottomLeft: { x: x, y: nextY },
      left: { x: preX, y: y },
      topRight: { x: x, y: preY }
    };
  }

  // 检测当前落子是否符合规则
  isLegalAction(chess) {
    const noFilledByPath = (oldPos, newPos) => {
      let steps = {
        x: newPos.x - oldPos.x,
        y: newPos.y - oldPos.y
      };
      let midPos = {
        x: oldPos.x + steps.x / 2,
        y: oldPos.y + steps.y / 2
      };
      if (this.isFilled(midPos)) return false;

      let maxInXY = Math.max(Math.abs(steps.x), Math.abs(steps.y));
      if (maxInXY <= 2) return true;
      // 递归
      return noFilledByPath(oldPos, midPos) && noFilledByPath(midPos, newPos);
    };

    const isLegalMove = (oldPos, newPos) => {
      let steps = {
        x: newPos.x - oldPos.x,
        y: newPos.y - oldPos.y
      };

      // 先检查移动的倾斜角度, tan 值只能为 0 或者 1, 详情看文档
      let deg = ~~(steps.y / steps.x);
      if (deg !== 0 && deg !== 1) return false;

      // 只移动一步，目标没有被填充 => 正确
      let maxInXY = Math.max(Math.abs(steps.x), Math.abs(steps.y));
      if (maxInXY === 1) return !this.isFilled(newPos);

      let midPos = {
        x: oldPos.x + steps.x / 2,
        y: oldPos.y + steps.y / 2
      };
      // 中间棋子没有被填充 => 当然错误
      if (!this.isFilled(midPos)) return false;
      if (maxInXY <= 2) return true;

      // 这儿需要递归的查找当前经过的每一个位置的填充状况
      return noFilledByPath(oldPos, midPos) && noFilledByPath(midPos, newPos);
    };

    // 主逻辑
    let check = this.isFilled(chess);
    // 得到触发的坐标是否被填了棋子，如果是则设置激活选中
    if (check) {
      // 不然则清空选择
      if (this.select) this.clearSelect();
      return this.setSelect(check);
    }

    if (!this.select) return;

    // 判断移动是否合法移动
    let oldPos = this.pos[this.select.ID];
    if (!isLegalMove(oldPos, chess)) return this.clearSelect();

    // 先清除棋盘坐标的填棋子状态
    delete this.filled[this.select.ID];
    this.cleanArc(oldPos._x, oldPos._y, this.radius);

    // 设置当前棋子的新的棋盘坐标
    let nowID = this.getID(chess);
    this.filled[nowID] = Object.assign({}, this.select, { ID: nowID });

    // 假设已经不可以连续跳了
    let selectChess = this.pos[nowID];
    this.fillArc(chess._x, chess._y, this.radius, this.players[this.select.palyerId].color);
    this.clearSelect();
  }

  // 检查当前的棋子坐标是否在棋盘内
  isLegalPosition(x, y) {
    if (x < 1 || x > 17) return false;
    const index = x - 1;
    console.log(x, index);
    if (y < this.posRegions[index][0] || y > this.posRegions[index][1]) return false;
    return true;
  }

  // 检查当前坐标是否落子了
  isFilled(chess) {
    return this.filled[this.getID(chess)];
  }

  cleanArc(_x = 10, _y = 10, radius = 10) {
    // 先清除
    this.ctx.globalCompositeOperation = 'destination-out';
    this.fillArc(_x, _y, radius * 1.2);
    this.ctx.globalCompositeOperation = 'source-over';
    // 再描边
    this.strokeArc(_x, _y, radius);
  }

  fillArc(_x = 10, _y = 10, radius = 10, color = 'rgb(255, 255, 255)') {
    this.ctx.beginPath();
    this.ctx.arc(_x, _y, radius, startAngle, endAngle, anticlockwise);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  strokeArc(_x, _y, radius = 10) {
    this.ctx.beginPath();
    this.ctx.arc(_x, _y, radius, startAngle, endAngle, anticlockwise);
    this.ctx.stroke();
  }

  // 全局统一的ID样式
  getID(x, y) {
    if (Object.prototype.toString.call(x) === '[object Object]') return `${x.x}-${x.y}`;
    return `${x}-${y}`;
  }
}
