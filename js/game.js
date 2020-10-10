var game = new Game();

function drawCover() {
    ctx.beginPath();
    var cover = new Image();
    cover.src = "img/gameImg/cover.png";
    ctx.drawImage(cover, 0, 0, cvs.width, cvs.height);

    if (!game._gameStart) {
        requestAnimationFrame(drawCover);
    }
}

function gameStart() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    //location.reload();
    game._gameStart = true;
    game._map.createMapdata();
    game._map.createObstacle();
    game.createEnemies(game._enemyCount);
    game.update();
}

function Game() {
    var _this = this;
    this._gunIndex = 0;     // 武器下标
    this._roleIndex = 0;    // 角色下标
    this._role = new Role(_this._roleIndex, new Arms(guns[_this._gunIndex].name, guns[_this._gunIndex].attack, guns[_this._gunIndex].width, guns[_this._gunIndex].height, _this._gunIndex, guns[_this._gunIndex].velocityOfFire));  // 当前角色
    this._remoteSensing = new RemoteSensing();  // 遥感
    this._mapIndex = Math.floor(Math.random() * 4); // 地图下标
    this._map = new Map(_this._mapIndex);   // 当前地图
    this._enemies = [];     // 敌人数组
    this._enemyCount = 1;   // 敌人数量
    this._newArmsAngle = 0; // 新的武器角度
    this._nextRound = false;    // 下一回合
    this._rounds = 1;   // 当前回合数
    this._time = 0;     // 时间
    this._gameStart = false;    // 游戏是否开始
    this._gameOverTime = 0;     // 游戏结束时间
    this._attackGrowthRate = 0; // 敌人攻击增长幅度
    this._speedGrowthRate = 0;  // 敌人速度增长幅度
    this.createEnemies = function (enemyCount) {    // 创建敌人
        for (var i = 0; i < enemyCount; i++) {
            var enemy = new Enemy(_this._mapIndex);

            enemy._x = Math.floor(Math.random() * (_this._map._map.column * _this._map._map.long));
            enemy._y = Math.floor(Math.random() * (_this._map._map.row * _this._map._map.long));

            if (Math.sqrt(Math.pow(enemy._x - _this._role._x, 2) + Math.pow(enemy._y - _this._role._y, 2)) <= _this._role._autoAttackRange) {
                enemy._x = Math.floor(Math.random() * (mapInfo[_this._mapIndex].column * mapInfo[_this._mapIndex].long));
                enemy._y = Math.floor(Math.random() * (mapInfo[_this._mapIndex].row * mapInfo[_this._mapIndex].long));
            }

            _this._enemies.push(enemy);
        }

    };
    this.update = function () {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        _this._map.createMap();

        _this._time++;
        if (_this._time <= 90) {
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.font = " bold 50px Arial";
            ctx.fillText("第  " + _this._rounds + "  轮", (_this._map._map.column * _this._map._map.long) / 2 - 70, (_this._map._map.row * _this._map._map.long) / 2);

        }

        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.font = " bold 32px Arial";
        ctx.fillText("第  " + _this._rounds + "  轮", (_this._map._map.column * _this._map._map.long) + 20, 50);

        _this.roleDetermine();
        _this.bulletsDetermine();
        _this.enemiesDetermine();
        _this.gameOverDetermine();
        _this.nextLevelDetermine();

        requestAnimationFrame(_this.update);

    };

    this.roleDetermine = function () { // 角色判定

        _this._remoteSensing.draw();
        _this._role.drawUI();

        _this._role._injuredFrame++;
        _this._role._arms._frame++;
        _this._role._restoreFrame++;

        _this._role.update();
        _this._role.updateStruts();
        _this._role.autoReply();
        _this._role.showHealth();

        //cvs.onmousedown = function () {
        if (_this._remoteSensing._move) {
            // 边框判定
            if (_this._role._x > _this._map._map.long * (_this._map._map.column - 1) - _this._role._width + 30) {
                _this._role._x = _this._map._map.long * (_this._map._map.column - 1) - _this._role._width + 29;
            }
            if (_this._role._x < _this._map._map.long - 30) {
                _this._role._x = _this._map._map.long - 29
            }
            if (_this._role._y > (_this._map._map.row - 1) * _this._map._map.long - _this._role._height + 30) {
                _this._role._y = (_this._map._map.row - 1) * _this._map._map.long - _this._role._height + 29
            }
            if (_this._role._y < _this._map._map.long - 10) {
                _this._role._y = _this._map._map.long - 9
            }

            _this._map._doNotBreakObstacle.forEach(function (t) {
                //console.log(Math.PI / 180 * 315);
                //console.log();
                if (_this._role._x < t[2] && _this._role._x - t[2] >= -_this._role._width + 30 && Math.abs(_this._role._y - t[3]) <= t[1] && (_this._role._angle > Math.PI / 180 * -45 && _this._role._angle <= Math.PI / 180 * 45)) {
                    _this._role._x = t[2] - _this._role._width + 29;
                } else if (_this._role._x > t[2] && _this._role._x - t[2] <= t[1] - 30 && Math.abs(_this._role._y - t[3]) <= t[1] && (_this._role._angle > Math.PI / 180 * 135 && _this._role._angle <= Math.PI || _this._role._angle >= -Math.PI && _this._role._angle <= Math.PI / 180 * -135)) {
                    _this._role._x = t[2] + t[1] - 29;
                } else if (_this._role._y < t[3] && _this._role._y - t[3] >= -_this._role._height + 30 && Math.abs(_this._role._x - t[2]) <= t[1] && (_this._role._angle > Math.PI / 180 * 45 && _this._role._angle <= Math.PI / 180 * 135)) {
                    _this._role._y = t[3] - _this._role._height + 29;
                } else if (_this._role._y > t[3] && _this._role._y - t[3] <= +t[1] - 10 && Math.abs(_this._role._x - t[2]) <= t[1] && (_this._role._angle > Math.PI / 180 * -135 && _this._role._angle <= Math.PI / 180 * -45)) {
                    _this._role._y = t[3] + t[1] - 9;
                }

            });

            _this._role._angle = _this._remoteSensing._angle;

            if (_this._newArmsAngle == 0) {
                _this._role._arms._angle = _this._remoteSensing._angle;
            }

            _this._role.move();
            //console.log(_this._remoteSensing._angle);
        }
        //};
    };
    this.bulletsDetermine = function () { // 子弹碰撞判定

        _this._role._bullets.forEach(function (t, i) {

            t.draw();
            t.update();

            _this._enemies.forEach(function (t2) {

                if (t._x > t2._x - t._width / 2 && t._x < t2._x + t2._width + t._width / 2 && t._y > t2._y - t._width / 2 && t._y < t2._y + t2._height + t._width / 2) {
                    _this._role._bullets.splice(i, 1);
                    t2._health -= _this._role._arms._attack;
                    ctx.beginPath();
                    ctx.fillStyle = "red";
                    ctx.font = " bold 24px Arial";
                    ctx.fillText("-" + _this._role._arms._attack, t2._x + 10, t2._y + 10);
                }
            });

            _this._map._doNotBreakObstacle.forEach(function (n) {

                if (t._x > n[2] - t._width / 2 && t._x < n[2] + n[1] + t._width / 2 && t._y > n[3] - t._width / 2 && t._y < n[3] + n[1] + t._width / 2) {
                    _this._role._bullets.splice(i, 1);
                }

            });

            if (t._x > _this._map._map.long * (_this._map._map.column - 1) - t._width / 2 ||
                t._x < _this._map._map.long + t._width / 2 ||
                t._y > (_this._map._map.row - 1) * _this._map._map.long - t._width / 2 ||
                t._y < _this._map._map.long + t._width / 2
            ) {
                _this._role._bullets.splice(i, 1);
            }

        });
    };
    this.enemiesDetermine = function () { // 敌人判定

        _this._enemies.forEach(function (t, i) {
            t.draw();
            //console.log(t._angle);
            //t._angle = Math.atan2(_this._role._y - t._y, _this._role._x - t._x);
            t.update();
            t.updateStatus();

            if (t._dead) {
                _this._enemies.splice(i, 1)
            }

            if (t._x > _this._map._map.long * (_this._map._map.column - 1) - t._width) {
                t._x = _this._map._map.long * (_this._map._map.column - 1) - t._width;
                t._angle = Math.random() * Math.PI * 2 - Math.PI;
            }
            if (t._x < _this._map._map.long) {
                t._x = _this._map._map.long;
                t._angle = Math.random() * Math.PI * 2 - Math.PI;
            }
            if (t._y > (_this._map._map.row - 1) * _this._map._map.long - t._height) {
                t._y = (_this._map._map.row - 1) * _this._map._map.long - t._height;
                t._angle = Math.random() * Math.PI * 2 - Math.PI;
            }
            if (t._y < _this._map._map.long) {
                t._y = _this._map._map.long;
                t._angle = Math.random() * Math.PI * 2 - Math.PI;
            }

            _this._map._doNotBreakObstacle.forEach(function (n) {
                if (t._x < n[2] && t._x - n[2] >= -t._width + 30 && Math.abs(t._y - n[3]) <= n[1] && (t._angle > Math.PI / 180 * -45 && t._angle <= Math.PI / 180 * 45)) {
                    t._x = n[2] - t._width;
                    t._angle = Math.random() * Math.PI * 2 - Math.PI;
                } else if (t._x > n[2] && t._x - n[2] <= n[1] - 30 && Math.abs(t._y - n[3]) <= n[1] && (t._angle > Math.PI / 180 * 135 && t._angle <= Math.PI || t._angle >= -Math.PI && t._angle <= Math.PI / 180 * -135)) {
                    t._x = n[2] + n[1];
                    t._angle = Math.random() * Math.PI * 2 - Math.PI;
                } else if (t._y < n[3] && t._y - n[3] >= -t._height + 30 && Math.abs(t._x - n[2]) <= n[1] && (t._angle > Math.PI / 180 * 45 && t._angle <= Math.PI / 180 * 135)) {
                    t._y = n[3] - t._height;
                    t._angle = Math.random() * Math.PI * 2 - Math.PI;
                } else if (t._y > n[3] && t._y - n[3] <= n[1] - 10 && Math.abs(t._x - n[2]) <= n[1] && (t._angle > Math.PI / 180 * -135 && t._angle <= Math.PI / 180 * -45)) {
                    t._y = n[3] + n[1];
                    t._angle = Math.random() * Math.PI * 2 - Math.PI;
                }

            });

            if (Math.sqrt(Math.pow((t._x + t._width / 2) - (_this._role._x + _this._role._width / 2), 2) + Math.pow((t._y + t._height / 2) - (_this._role._y + _this._role._height / 2), 2)) <= t._autoAttackRange) {
                t._angle = Math.atan2((_this._role._y + _this._role._height / 2) - (t._y + t._height / 2), (_this._role._x + _this._role._width / 2) - (t._x + t._width / 2));
            }

            if (Math.abs((t._x + t._width / 2) - (_this._role._x + _this._role._width / 2)) <= _this._role._width / 2 - 20 &&
                Math.abs((t._y + t._height / 2) - (_this._role._y + _this._role._height / 2)) <= _this._role._height / 2 - 20) {

                if (!_this._role._dead) {
                    if (_this._role._injuredFrame >= _this._role._injuredLastFrame + _this._role._injuredCDCode) {
                        _this._role._health -= t._attack;
                        console.log(_this._role._health);
                        ctx.beginPath();
                        ctx.fillStyle = "red";
                        ctx.font = " bold 24px Arial";
                        ctx.fillText("-" + t._attack, _this._role._x + 10, _this._role._y + 10);

                        _this._role._injuredLastFrame = _this._role._injuredFrame;

                    }
                }

            }

        });
    };
    this.gameOverDetermine = function () { // 玩家死亡判定
        if (_this._role._dead) {
            ctx.beginPath();
            var gameOver = new Image();
            gameOver.src = "img/gameImg/gameOver.bmp";
            ctx.drawImage(gameOver, 0, 0, cvs.width, cvs.height);
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.font = " bold 50px Arial";
            ctx.fillText("你存活了  " + (_this._rounds - 1) + "  轮", (_this._map._map.column * _this._map._map.long) / 2 - 80, (_this._map._map.row * _this._map._map.long) / 2 + 300);
            _this._gameStart = false;
            _this._gameOverTime++;
            if (_this._gameOverTime >= 120) {
                location.reload();
                _this._gameOverTime = 0;
            }
        }

    };
    this.nextLevelDetermine = function () { // 下一关判定

        if (_this._enemies.length == 0) {
            _this._enemyCount += 2;
            _this._attackGrowthRate += 0.2;
            _this._speedGrowthRate += 0.2;
            console.log(_this._attackGrowthRate);
            console.log(_this._speedGrowthRate);
            _this._mapIndex = Math.floor(Math.random() * 4);
            //_this._gunIndex = Math.floor(Math.random() * 5);
            _this._rounds++;
            _this._time = 0;
            _this._map = new Map(_this._mapIndex);
            //			_this._map._mapdata = [];
            //			_this._map._destructibleObstacles = [];
            //			_this._map._doNotBreakObstacle = [];
            //
            _this._map.createMapdata();
            _this._map.createObstacle();
            _this.createEnemies(_this._enemyCount);
            _this._enemies.forEach(function (t) {
                t._attack += Math.floor(_this._attackGrowthRate);
                t._speed += _this._speedGrowthRate;

            });
        }
    };

    document.onkeypress = function (e) {
        console.log(e.keyCode);

        if (e.keyCode == 120) {
            //cvs.onclick = function () {
            if (_this._role._arms._frame >= _this._role._arms._lastFrame + _this._role._arms._CDCode) {
                var x = _this._role._x + _this._role._width / 2 + (_this._role._arms._width - 10) * Math.cos(_this._role._arms._angle);
                var y = _this._role._y + _this._role._height / 2 + (_this._role._arms._width - 10) * Math.sin(_this._role._arms._angle);
                if (_this._role._arms._angle > -Math.PI / 2 && _this._role._arms._angle < Math.PI / 2) {
                    y -= 7
                } else {
                    y += 1
                }

                var min = _this._role._autoAttackRange;
                var minX = 0;
                var minY = 0;

                _this._enemies.forEach(function (t) {
                    if (Math.sqrt(Math.pow(t._x - _this._role._x, 2) + Math.pow(t._y - _this._role._y, 2)) <= _this._role._autoAttackRange) {
                        min = Math.sqrt(Math.pow(t._x - _this._role._x, 2) + Math.pow(t._y - _this._role._y, 2));
                        minX = t._x;
                        minY = t._y;
                    }

                });

                // 判断是否在自动攻击范围内 是的话自动调整武器的角度
                if (min == _this._role._autoAttackRange) {
                    _this._newArmsAngle = 0;
                    _this._role._arms._angle = _this._remoteSensing._angle;
                    _this._role._bullets.push(new Bullet(bullets[_this._role._arms._bulletType].name, _this._role._arms._angle, x, y, 20, bullets[_this._role._arms._bulletType].width, bullets[_this._role._arms._bulletType].height));

                } else {

                    _this._newArmsAngle = Math.atan2(minY - _this._role._y, minX - _this._role._x);
                    _this._role._arms._angle = _this._newArmsAngle;
                    _this._role._bullets.push(new Bullet(bullets[_this._role._arms._bulletType].name, _this._newArmsAngle, x, y, 20, bullets[_this._role._arms._bulletType].width, bullets[_this._role._arms._bulletType].height));

                }

                _this._role._arms._lastFrame = _this._role._arms._frame;
                //console.log(_this._bullets);
            }
        }

    };
}