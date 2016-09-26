// 全局的圆圈指令变量
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

    // 销毁周期队列
    this._destoryQueue = [];

    // 棋盘的圆形的半径，31 这个是调出来的，没有缘由
    this.radius = ~~(this.width / 31);

    // 默认的棋盘圆圈的边框颜色
    this.borderColor = '#ddd';

    // 默认的填充颜色
    this.backgroundColor = '#fff';

    // 被激活的棋子的边框颜色
    this.activeBorderColor = '#000';

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
      // '1-5': {
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
        pieces: [
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
        pieces: [
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
        pieces: [
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
        color: '#5badf0',
        pieces: [
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
        pieces: [
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
        pieces: [
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

    this.init();
  }

  init() {

    this.drawBoard();

    this.initPlayer('A');
    this.initPlayer('D');

    this.initEvents();
  }

  // 初始化棋盘，一个巨大的六角形东西
  drawBoard() {
    const spaceWidth = this.width / 14;
    const lineHeight = this.width / 15;
    const sapceX = spaceWidth / 2;
    const padding = 2 * this.radius;

    this.posRegions.forEach((regions, i) => {
      let x = i + 1;
      let min = regions[0];
      let max = regions[1];
      for (let y = min; y <= max; y++) {
        // 需要修正一下 x 轴的实际坐标
        let correct = 0;
        if (y < 5) correct = (5 - y) * sapceX;
        if (y > 5) correct = -(y - 5) * sapceX;

        let _x = i * spaceWidth + correct + padding;
        let _y = y * lineHeight;
        this.strokeArc(_x, _y);
        let ID = this.getID(x, y);
        this.pos[ID] = { x, y, _x, _y, ID };
        // this.ctx.fillText(ID, _x - 15, _y + 5);
      }
    });
  }

  // 根据角色初始化玩家的棋子
  initPlayer(palyerId) {
    if (!this.players.hasOwnProperty(palyerId)) return;
    let palyer = this.players[palyerId];
    palyer.pieces.forEach((point, index) => {
      let ID = this.getID(...point);
      let oldPos = null;
      let newPos = this.pos[ID];
      let fillData = { ID, palyerId, index };
      // 记录
      this.setFill(newPos, oldPos, fillData);
    });
  }

  // 初始化事件监听
  initEvents() {
    let clickHandle = this.clickHandle.bind(this);
    this.canvas.addEventListener('click', clickHandle, false);
    this._destoryQueue.push(() => {
      this.canvas.removeEventListener('click', clickHandle, false);
    });
  }

  // 销毁方法
  destory(cb) {
    this._destoryQueue.map((v, i) => {
      if (typeof v === 'function') v();
    });
    if (typeof cb === 'function') cb();
  }

  // canvas 中的点击事件回调
  clickHandle(ev, piece) {

    let isOtherPlayer = false;
    if (piece) {
      isOtherPlayer = true;
      // 转化到本机的棋盘格局
      piece = this.pos[this.getID(piece)];
    } else {
      let point = this.getPointByEvent(ev);
      piece = this.getPieceByPoint(point);
    }

    // 如果没有获得真实可用的棋子则退出
    if (!piece) return;

    // 如果检测到的落子之前已经有一个已经选中的棋子，则进行走棋检测，不然进行激活棋子的检测
    if (this.activePiece) {
      if (this.isLegalAction(piece)) this.renderMove(piece);
    } else {
      this.setActive(piece);
    }

    // callback
    if (!isOtherPlayer && typeof this.palyerMove === 'function') this.palyerMove(ev, piece);
  }

  // 设置激活，黑圈圈的高亮
  setActive(piece) {
    this.activePiece = piece;
    // 绘制表示激活状态的小圆圈
    let nowPos = this.pos[piece.ID];
    this.strokeArc(nowPos._x, nowPos._y, this.activeBorderColor);
  }

  // 取消激活，取消黑圈圈的高亮
  clearActive() {
    if (this.activePiece) {
      // 先清理
      let oldPos = this.pos[this.activePiece.ID];
      this.cleanArc(oldPos._x, oldPos._y);
      // 如果之前是被填充的，继续填充一个颜色
      let check = this.isFilled(oldPos);
      if (check) this.fillArc(oldPos._x, oldPos._y, this.players[check.palyerId].color);
    }
    this.activePiece = null;
  }

  // 设置填充效果
  setFill(newPos, oldPos, fillData) {
    if (!fillData) {
      let oldID = this.getID(oldPos);
      let nowID = this.getID(newPos);
      fillData = Object.assign({}, this.filled[oldID], { ID: nowID });
    }
    this.filled[fillData.ID] = fillData;
    this.fillArc(newPos._x, newPos._y, this.players[fillData.palyerId].color);
  }

  // 取消填充效果
  clearFill(piece) {
    let oldPos = this.pos[piece.ID];
    delete this.filled[this.activePiece.ID];
    this.cleanArc(oldPos._x, oldPos._y);
  }

  renderMove(piece) {

    this.setFill(piece, this.activePiece);
    this.clearFill(this.activePiece);

    this.clearActive();
    this.setActive(piece);
  }

  // 通过event事件获得点击的坐标
  getPointByEvent(ev) {
    if (ev.layerX || ev.layerX === 0) return { x: ev.layerX, y: ev.layerY };
    // Opera
    if (ev.offsetX || ev.offsetX === 0) return { x: ev.offsetX, y: ev.offsetY };
  }

  // 通过某坐标找出其是否属于一个棋子／棋盘区域内
  getPieceByPoint(point) {
    for (let i in this.pos) {
      let res = this.pos[i];
      let a = ~~(point.x - res._x);
      let b = ~~(point.y - res._y);
      let len = Math.sqrt(a * a + b * b);
      if (len < this.radius) return res;
    }
  }

  // 检测当前落子是否符合规则
  isLegalAction(newPos, oldPos = this.activePiece) {

    // 判断当前的移动点piece是否是可以移动的
    // 如果目标位置被填充了肯定不能移动
    if (!newPos || this.isFilled(newPos)) return;

    let canMove = this.getPosByCanMove(oldPos);

    for (let i in canMove) {
      if (canMove[i].ID === newPos.ID) return true;
    }
  }

  getPosByCanMove(piece) {
    return this.getNear(piece);
  }

  // 获得当前棋子的周围棋子
  getNear(piece) {
    // if (!this.isLegalPosition(x, y)) return;
    const preX = piece.x - 1;
    const nextX = piece.x + 1;
    const preY = piece.y - 1;
    const nextY = piece.y + 1;
    let res = {
      topLeft: { x: preX, y: preY },
      right: { x: nextX, y: piece.y },
      bottomRight: { x: nextX, y: nextY },
      bottomLeft: { x: piece.x, y: nextY },
      left: { x: preX, y: piece.y },
      topRight: { x: piece.x, y: preY }
    };

    for (let i in res) {
      let ID = this.getID(res[i]);
      if (!this.pos[ID]) {
        delete res[i];
      } else {
        res[i] = this.pos[ID];
      }
    }
    return res;
  }

  // 检查当前坐标是否落子了
  isFilled(piece) {
    return this.filled[this.getID(piece)];
  }

  // 全局统一的ID样式
  getID(x, y) {
    if (Object.prototype.toString.call(x) === '[object Object]') return `${x.x}-${x.y}`;
    return `${x}-${y}`;
  }

  cleanArc(_x = 10, _y = 10, radius = this.radius) {
    // 先清除
    this.ctx.globalCompositeOperation = 'destination-out';
    this.fillArc(_x, _y, radius * 1.1);
    this.ctx.globalCompositeOperation = 'source-over';
    // 再描边
    this.strokeArc(_x, _y, this.borderColor, radius);
  }

  fillArc(_x = 10, _y = 10, color = this.backgroundColor, radius = this.radius) {
    this.ctx.beginPath();
    this.ctx.arc(_x, _y, radius, startAngle, endAngle, anticlockwise);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  strokeArc(_x, _y, color = this.borderColor, radius = this.radius) {
    this.ctx.beginPath();
    this.ctx.arc(_x, _y, radius, startAngle, endAngle, anticlockwise);
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
  }
}
