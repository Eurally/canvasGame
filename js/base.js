/*
    角色数据
 */
var roles = [{
    name: "111",
    img: "role1.png",
    skill: function (_this) {
        // console.log(_this);
        //console.log(_this._arms._angle);
        _this._x += 200 * Math.cos(_this._arms._angle);
        _this._y += 200 * Math.sin(_this._arms._angle);

        // var skillImg = new Image();
        // skillImg.src = "img/skillImg/skill_1.png";
        // var frame = 0;
        // var timer = setInterval(function () {
        //     ctx.beginPath();
        //     ctx.drawImage(skillImg, frame * (skillImg.width / 5), 0, skillImg.width / 5, skillImg.height, _this._x, _this._y, skillImg.width / 5, skillImg.height)
        //     frame++;
        //     if (frame > 4) {
        //         clearInterval(timer);
        //     }
        // }, 20)

    }
}];
/*
    武器数据
 */
var guns = [{
    name: "M4A1",
    attack: 3,
    width: 40,
    height: 20,
    bullet: "M4A1_Bullet",
    velocityOfFire: 5
}];
/*
    子弹数据
 */
var bullets = [{
    name: "M4A1",
    width: 30,
    height: 10
}];

var keycode = 0;

/*
    角色
 */
function Role(index, arms) {
    var _this = this;
    this._index = index;    // 下标
    this._maxHealth = 16;   // 最大生命值
    this._health = 16;  // 当前生命值
    this._arms = arms;  // 当前武器
    this._x = 200;      // x
    this._y = 200;      // y
    this._width = 100;  // 宽
    this._height = 100; // 高
    this._speed = 5;    // 速度
    this._angle = 0;    // 角度
    this._bullets = [];     // 子弹数组
    this._dead = false; // 是否死亡
    this._autoAttackRange = 200;    // 自动攻击范围
    //this._angle = 0;
    //this._img = img;
    this._currentXFrame = 0;
    this._currentYFrame = 0;
    this._headCurrentXFrame = 0;
    this._headFrameCurrentXFrame = 0;
    this._armsFrame = 0;
    this._injuredFrame = 0;
    this._injuredLastFrame = 0;
    this._injuredCDCode = 120;
    this._restoreFrame = 0;
    this._restoreLastFrame = 0;
    this._restoreCDCode = 300;
    this._uiX = cvs.width / 2 - 300;
    this._uiY = cvs.height - 190;

    this.draw = function () {   // 绘制角色和武器
        ctx.save();

        ctx.beginPath();
        var img = new Image();
        img.src = "img/roleImg/" + roles[_this._index].img;

        ctx.drawImage(img, Math.floor(_this._currentXFrame) * (img.width / 4), Math.floor(_this._currentYFrame) * (img.height / 2), img.width / 4, img.height / 2, _this._x, _this._y, _this._width, _this._height);

        _this._currentXFrame = _this._currentXFrame + 0.1;
        if (_this._currentXFrame >= 4) {
            _this._currentXFrame = 0;
        }

        ctx.beginPath();
        ctx.translate(_this._x + _this._width / 2, _this._y + _this._height / 2);
        ctx.rotate(_this._arms._angle);
        var gunImg = new Image();
        gunImg.src = "img/gunImg/" + _this._arms._name + ".png";
        ctx.drawImage(gunImg, 0, _this._armsFrame * (gunImg.height / 2), gunImg.width, gunImg.height / 2, -10, -10, _this._arms._width, _this._arms._height);

        ctx.restore();
    };
    this.move = function () {   // 角色移动
        var dt = 1;
        //console.log(angle);

        if (_this._arms._angle > -Math.PI / 2 && _this._arms._angle < Math.PI / 2) {
            _this._currentYFrame = 0;
            _this._armsFrame = 0;
        } else {
            _this._currentYFrame = 1;
            _this._armsFrame = 1;
        }

        if (_this._angle > -Math.PI / 2 && _this._angle < Math.PI / 2) {
            _this._currentYFrame = 0;
            _this._armsFrame = 0;
        } else {
            _this._currentYFrame = 1;
            _this._armsFrame = 1;
        }

        _this._x += _this._speed * dt * Math.cos(_this._angle);
        _this._y += _this._speed * dt * Math.sin(_this._angle);
        //_this._arms._angle = angle;

    };
    this.update = function () {  // 更新
        _this.draw();

        // document.onkeydown = function (e) {
        //     keycode = e.keyCode;
        //     console.log(keycode);
        //
        // };
        //
        // if (keycode == 65) { // 左
        //     _this._currentYFrame = 1;
        //     _this._x -= _this._speed;
        // } else if (keycode == 68) { // 右
        //     _this._currentYFrame = 0;
        //     _this._x += _this._speed;
        // } else if (keycode == 87) { // 上
        //     _this._y -= _this._speed;
        // } else if (keycode == 83) {     //下
        //     _this._y += _this._speed;
        // } else {
        //
        // }
        // _this._bullets.forEach(function (t, index) {
        //     t.draw();
        //     t.update();
        //     t.updateStatus();
        //     if (t._dead) {
        //         _this._bullets.splice(index, 1)
        //     }
        // })
    };
    this.updateStruts = function () {       // 更新状态

        if (_this._health <= 0) {
            _this._dead = true;
        }

    };
    this.skill = function () {  // 技能
        roles[_this._index].skill(_this);

    };
    this.autoReply = function () {  // 自动回复
        if (_this._health < _this._maxHealth) {
            if (_this._restoreFrame >= _this._restoreLastFrame + _this._restoreCDCode) {
                _this._health++;
                console.log(_this._health);

                _this._restoreLastFrame = _this._restoreFrame;

            }

        }

    };
    this.drawUI = function () {     // 绘制UI
        ctx.beginPath();
        var ui = new Image();
        ui.src = "img/gameImg/ui_1.png";
        ctx.drawImage(ui, _this._uiX, _this._uiY, ui.width + 100, ui.height);

        ctx.beginPath();
        var head = new Image();
        head.src = "img/roleImg/" + roles[_this._index].img;
        ctx.drawImage(head, Math.floor(_this._headCurrentXFrame) * (head.width / 4), 0, head.width / 4, head.height / 2, _this._uiX + 25, _this._uiY + 30, _this._width, _this._height);
        //_this._headCurrentXFrame = _this._headCurrentXFrame + 0.1;
        _this._headCurrentXFrame += 0.1;
        if (_this._headCurrentXFrame >= 4) {
            _this._headCurrentXFrame = 0;
        }

        ctx.beginPath();
        var headFrame = new Image();
        headFrame.src = "img/gameImg/headFrame.png";
        ctx.drawImage(headFrame, Math.floor(_this._headFrameCurrentXFrame) * (headFrame.width / 8), 0, headFrame.width / 8, headFrame.height, _this._uiX + 30, _this._uiY + 30, headFrame.width / 8, headFrame.height);

        _this._headFrameCurrentXFrame += 0.5;
        if (_this._headFrameCurrentXFrame >= 8) {
            _this._headFrameCurrentXFrame = 0;
        }

        ctx.beginPath();
        var gun = new Image();
        gun.src = "img/gunImg/" + _this._arms._name + ".png";

        ctx.lineJoin = "round";
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";
        ctx.strokeRect(_this._uiX + 135, _this._uiY + 40, gun.width + 30, gun.height / 2 + 10);

        ctx.drawImage(gun, 0, 0, gun.width, gun.height / 2, _this._uiX + 150, _this._uiY + 45, gun.width, gun.height / 2);

        ctx.fillStyle = "white";
        ctx.font = " bold 16px Arial";
        ctx.fillText("伤害：" + _this._arms._attack, _this._uiX + 280, _this._uiY + 60);
        ctx.fillText("射速：" + _this._arms._CDCode, _this._uiX + 280, _this._uiY + 85);

        ctx.beginPath();
        var bloodTrough = new Image();
        bloodTrough.src = "img/gameImg/bloodTrough.png";
        ctx.drawImage(bloodTrough, _this._uiX + 40, _this._uiY + 125);

        ctx.beginPath();
        var btnX = new Image();
        btnX.src = "img/gameImg/x.png";
        ctx.drawImage(btnX, 50, _this._uiY + 30, 40, 40);

        ctx.fillStyle = "white";
        ctx.font = " bold 40px Arial";
        ctx.fillText("开火", 120, _this._uiY + 60);

        ctx.beginPath();
        var btnZ = new Image();
        btnZ.src = "img/gameImg/z.png";
        ctx.drawImage(btnZ, 50, _this._uiY + 110, 40, 40);

        ctx.fillStyle = "white";
        ctx.font = " bold 40px Arial";
        ctx.fillText("技能", 120, _this._uiY + 140);

    };
    this.showHealth = function () {     // 显示血量
        ctx.beginPath();
        var bloodStick = new Image();
        bloodStick.src = "img/gameImg/bloodStick.png";

        var mix = _this._health / _this._maxHealth;

        ctx.drawImage(bloodStick, _this._uiX + 45, _this._uiY + 130, bloodStick.width * mix, bloodStick.height);

        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.font = " bold 24px Arial";
        ctx.fillText(_this._health + " / " + _this._maxHealth, _this._uiX + 110, _this._uiY + 147);

    };

    // cvs.onmousemove = function (e) {
    //     var x = e.offsetX - _this._x;
    //     var y = e.offsetY - _this._y;
    //     _this._arms._angle = Math.atan2(y, x);
    // };

    document.onkeydown = function (e) {
        //console.log(e.keyCode);
        if (e.keyCode == 90) {
            _this.skill();
        }
    }
}

/*
    遥感
 */
function RemoteSensing() {
    var _this = this;
    this._r = 60;       // 遥感半径
    this._angle = 0;    // 角度
    this._basalX = cvs.width - 400;     // x位置
    this._basalY = cvs.height - 100;    // y位置
    this._move = false;         // 是否移动
    this.draw = function () {   // 绘制遥感
        ctx.save();

        ctx.beginPath();
        ctx.strokeStyle = "aqua";
        ctx.arc(this._basalX, this._basalY, _this._r, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.translate(this._basalX, this._basalY);
        ctx.rotate(_this._angle);
        ctx.strokeStyle = "red";
        ctx.arc(_this._r, 0, 10, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
    };

    cvs.onmousemove = function (e) {    // 鼠标移动
        if (Math.abs(e.offsetY - _this._basalY) < _this._r && Math.abs(_this._r && e.offsetX - _this._basalX) < _this._r) {
            _this._move = false;
        } else {
            _this._move = true;
        }
        _this._angle = Math.atan2(e.offsetY - _this._basalY, e.offsetX - _this._basalX);
    };

}

/*
    武器
 */
function Arms(name, attack, width, height, bulletTypeIndex, velocityOfFire) {
    var _this = this;
    this._name = name;
    this._attack = attack;  // 攻击力
    this._width = width;    // 宽
    this._height = height;  // 高
    this._angle = 0;    // 角度
    this._bulletType = bulletTypeIndex;  // 子弹类型

    this._frame = 0;
    this._lastFrame = 0;
    this._CDCode = velocityOfFire;
}

/*
    子弹
 */
function Bullet(name, angle, x, y, speed, width, height) {
    var _this = this;
    this._name = name;  // 子弹名称
    this._dead = false;     // 是否死亡
    this._width = width;    // 宽
    this._height = height;  // 高
    this._x = x;        // x位置
    this._y = y;        // y 位置
    this._speed = speed;    // 速度
    this._angle = angle;    // 角度

    this.draw = function () {   // 绘制子弹
        ctx.save();
        ctx.beginPath();
        ctx.translate(_this._x, _this._y);
        ctx.rotate(_this._angle);
        var bulletImg = new Image();
        bulletImg.src = "img/bulletImg/" + _this._name + "_Bullet.png";
        ctx.drawImage(bulletImg, 0, 0, _this._width, _this._height);
        ctx.restore();
    };
    this.update = function () { // 更新
        var dt = 1;
        _this._x += _this._speed * dt * Math.cos(_this._angle);
        _this._y += _this._speed * dt * Math.sin(_this._angle);
    };

}

/*
    敌人
 */
function Enemy(mapIndex) {
    var _this = this;
    this._mapIndex = mapIndex;  // 当前地图下标
    this._health = Math.floor(Math.random() * 16 + 8);  // 敌人生命值
    this._dead = false;     // 是否死亡
    this._x = 0;    // x 位置
    this._y = 0;    // y 位置
    this._angle = Math.random() * Math.PI * 2 - Math.PI;    // 角度
    this._speed = 2;        // 速度
    this._attack = Math.floor(Math.random() * 2 + 1);   // 攻击力
    this._width = 50;   // 宽
    this._height = 50;  // 高
    this._autoAttackRange = 350; // 自动追踪范围
    this._currentXFrame = Math.floor(Math.random() * 12);
    this._currentYFrame = Math.floor(Math.random() * 8);
    this._xFrame = Math.floor(_this._currentXFrame / 3) * 3;
    this._yFrame = Math.floor(_this._currentYFrame / 4) * 4;
    this._imgIndex = Math.floor(Math.random() * 3 + 1);
    this.draw = function () {   // 绘制敌人
        ctx.beginPath();
        var img = new Image();
        img.src = "img/enemyImg/enemies_" + _this._imgIndex + ".png";
        ctx.drawImage(img, Math.floor(_this._xFrame) * (img.width / 12), _this._yFrame * (img.height / 8), img.width / 12, img.height / 8, _this._x, _this._y, _this._width, _this._height);

        _this._xFrame = _this._xFrame + 0.1;
        if (_this._xFrame >= Math.floor(_this._currentXFrame / 3) * 3 + 3) {
            _this._xFrame = Math.floor(_this._currentXFrame / 3) * 3;
        }
    };
    this.update = function () { // 更新敌人位置
        var dt = 1;
        if (_this._angle > -Math.PI / 2 && _this._angle < Math.PI / 2) {
            _this._yFrame = Math.floor(_this._currentYFrame / 4) * 4 + 2;
        } else {
            _this._yFrame = Math.floor(_this._currentYFrame / 4) * 4 + 1;
        }
        //console.log(_this._angle);
        //console.log(_this._angle);
        _this._x += _this._speed * dt * Math.cos(_this._angle);
        _this._y += _this._speed * dt * Math.sin(_this._angle);

        //console.log(_this._x);
        //console.log(_this._y);
    };
    this.updateStatus = function () {   // 状态判定
        if (_this._health <= 0) {
            _this._dead = true;
        }
    }

}