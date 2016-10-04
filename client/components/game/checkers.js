// 全局的圆圈指令变量
let startAngle = 0;
let endAngle = 2 * Math.PI;
let anticlockwise = true;

export default class Checkers {
  constructor(canvas) {
    if (!canvas) return;

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // 销毁周期队列
    this._destoryQueue = [];

    // style and config
    this.config = {
      width: canvas.width,
      height: canvas.height,
      // 棋盘的圆形的半径，31 这个是调出来的，没有缘由
      radius: ~~(canvas.width / 31),
      // 默认的棋盘圆圈的边框颜色
      borderColor: '#ddd',
      // 默认的填充颜色
      backgroundColor: '#fff',
      // 被激活的棋子的边框颜色
      activeBorderColor: '#000'
    };

    // 棋盘的坐标
    this.pos = {
      // {
      //   x: 1,  // 跳棋坐标系x
      //   y: 5,  // 跳棋坐标系y
      //   _x: 0,  // 实际上的垂直坐标系的x
      //   _y: 60  // 实际上的垂直坐标系的y
      // }
    };

    // 数据结构，棋盘中被填棋子的坐标集合
    this.filled = {
      // '1-5': {
      //   ID: '1-5',
      //   palyerId: 'A'
      // }
    };

    // 初始化的棋盘的6个区域内的坐标限制
    this.players = {
      A: {
        color: 'rgba(255, 165, 0, 1)',
        area: { x: [5, 8], y: [1, 4] }
      },
      B: {
        color: 'rgba(0, 255, 0, 0.25)',
        area: { x: [10, 13], y: [5, 8] }
      },
      C: {
        color: '#f44336',
        area: { x: [14, 17], y: [10, 13] }
      },
      D: {
        color: '#5badf0',
        area: { x: [10, 13], y: [14, 17] }
      },
      E: {
        color: '#e91e63',
        area: { x: [5, 8], y: [10, 13] }
      },
      F: {
        color: '#ff9800',
        area: { x: [1, 4], y: [5, 8] }
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
    const spaceWidth = this.config.width / 14;
    const lineHeight = this.config.width / 15;
    const sapceX = spaceWidth / 2;
    const padding = 2 * this.config.radius;

    // 坐标系区域的限制
    const posRegions = [
      [5, 5], // x坐标为1，y的上限是5，下限是5
      [5, 6], // x坐标为2，y的上限是5，下限是6
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

    posRegions.forEach((regions, i) => {
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

        // 画棋盘
        this.strokeArc(_x, _y);
        // 记录位置
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

    for (let x = palyer.area.x[0]; x <= palyer.area.x[1]; x++) {
      for (let y = palyer.area.y[0]; y <= palyer.area.y[1]; y++) {

        let ID = this.getID(x, y);
        let newPos = this.pos[ID];
        if (!newPos) continue;

        let oldPos = null;
        let fillData = { ID, palyerId };
        // 记录
        this.setFill(newPos, oldPos, fillData);
      }
    }
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
      if (this.isLegalAction(piece)) {
        this.renderMove(piece);
      } else {
        this.clearActive();
      }
    } else {
      this.setActive(piece);
    }

    // callback
    if (!isOtherPlayer && typeof this.palyerMove === 'function') this.palyerMove(ev, piece);
  }

  // 设置激活，黑圈圈的高亮
  setActive(piece) {
    this.activePiece = piece;
    console.log(piece);
    // 绘制表示激活状态的小圆圈
    let nowPos = this.pos[piece.ID];
    this.strokeArc(nowPos._x, nowPos._y, this.config.activeBorderColor);
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

  // 描绘棋子移动
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
      if (len < this.config.radius) return res;
    }
  }

  // 检测当前落子是否符合规则
  isLegalAction(newPos, oldPos = this.activePiece) {

    // 判断当前的移动点piece是否是可以移动的
    // 如果目标位置被填充了肯定不能移动
    if (!newPos || this.isFilled(newPos)) return;

    let canMove = this.getPosByCanMove(oldPos);
    let len = canMove.length;
    console.log(canMove);
    if (len < 1) return;
    for (let i = 0; i < len; i++) {
      if (canMove[i].ID === newPos.ID) return true;
    }
  }

  getPosByCanMove(piece) {
    let res = [];
    // 常量得出方式见文档
    let directionVector = [{ x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }, { x: -1, y: 0 }];
    let mid, end = false;

    directionVector.forEach((vector) => {
      mid = null;
      end = false;
      for (let step = 1, x = piece.x, y = piece.y; x >= 1; step++) {
        if (x < 1 || x > 17) break;
        if (y < 1 || y > 17) break;
        x += vector.x;
        y += vector.y;
        let ID = this.getID(x, y);
        let target = this.pos[ID];
        if (!target || end) continue;
        validate.call(this, target, step);
      }
    });

    return res;

    function validate(target, step) {
      let isFilled = this.isFilled(target);
      let isStepOne = step === 1;

      // 第二个填充的棋子
      if (mid && isFilled) end = true;

      // 一步范围并且没填充
      if (isStepOne && !isFilled) return res.push(target);

      // 第一个填充的棋子做跳板
      if (isFilled && !mid) return (mid = target);
      // 判断这个点是不是第一个跳板的对折点
      if (mid && !isFilled && ((target.x + piece.x) === mid.x * 2) && ((target.y + piece.y) === mid.y * 2)) return res.push(target);
    }
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

  cleanArc(_x = 10, _y = 10, radius = this.config.radius) {
    // 先清除
    this.ctx.globalCompositeOperation = 'destination-out';
    this.fillArc(_x, _y, radius * 1.1);
    this.ctx.globalCompositeOperation = 'source-over';
    // 再描边
    this.strokeArc(_x, _y, this.config.borderColor, radius);
  }

  fillArc(_x = 10, _y = 10, color = this.config.backgroundColor, radius = this.config.radius) {
    this.ctx.beginPath();
    this.ctx.arc(_x, _y, radius, startAngle, endAngle, anticlockwise);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  strokeArc(_x, _y, color = this.config.borderColor, radius = this.config.radius) {
    this.ctx.beginPath();
    this.ctx.arc(_x, _y, radius, startAngle, endAngle, anticlockwise);
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
  }
}
