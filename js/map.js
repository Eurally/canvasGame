var cvs = document.getElementById("cvs");
var ctx = cvs.getContext("2d");
/*var maps = [    //24
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1

];*/

/*
    地图数据
 */
var mapInfo = [{
    name: "熔岩",
    long: 50,
    column: 24,
    row: 14,
    floor: ["floor_1_1.png", "floor_1_2.png", "floor_1_3.png", "floor_1_4.png"],
    //floor:"map_1.png",
    wall: "wall_1.png",
    obstacle: [{
        img: "obstacle_1_1.png",
        isBreak: false
    }]
}, {
    name: "森林",
    long: 50,
    column: 24,
    row: 14,
    floor: ["floor_2_1.png", "floor_2_2.png", "floor_2_3.png", "floor_2_4.png"],
    //floor:"map_1.png",
    wall: "wall_2.png",
    obstacle: [{
        img: "obstacle_2_1.png",
        isBreak: false
    }, {
        img: "obstacle_2_2.png",
        isBreak: false
    }]
}, {
    name: "建筑",
    long: 50,
    column: 24,
    row: 14,
    floor: ["floor_3_1.png", "floor_3_2.png", "floor_3_3.png", "floor_3_4.png", "floor_3_5.png"],
    //floor:"map_1.png",
    wall: "wall_3.png",
    obstacle: [{
        img: "obstacle_3_1.png",
        isBreak: false
    }]
}, {
    name: "冰雪",
    long: 50,
    column: 24,
    row: 14,
    floor: ["floor_4_1.png", "floor_4_2.png", "floor_4_3.png", "floor_4_4.png", "floor_4_5.png"],
    //floor:"map_1.png",
    wall: "wall_4.png",
    obstacle: [{
        img: "obstacle_4_1.png",
        isBreak: false
    }]
}];

/*
    地图
 */
function Map(mapIndex) {
    var _this = this;
    this._doNotBreakObstacle = [];  // 不可破坏障碍
    this._destructibleObstacles = [];   // 可破坏障碍
    this._mapIndex = mapIndex;  // 地图标号
    this._map = mapInfo[_this._mapIndex];   // 当前地图
    this._mapdata = [];     // 地图数据
    this.createMapdata = function () {  // 创建地图数据
        for (var i = 0; i < _this._map.row * _this._map.column; i++) {
            if (i < _this._map.column ||
                i % _this._map.column == 0 ||
                i % _this._map.column == _this._map.column - 1 ||
                i > (_this._map.row - 1) * _this._map.column) {
                _this._mapdata.push(1);
            } else {
                _this._mapdata.push(0);
            }
        }

    };

    this.createObstacle = function () {     // 随机创建障碍 2 为不可破坏障碍  3 为可破坏障碍
        var count = Math.floor(Math.random() * 10 + 10);
        //var count = 10;
        for (var i = 0; i < count; i++) {

            var index = Math.floor(Math.random() * _this._map.column * (_this._map.row - 2) + _this._map.column);
            if (index % _this._map.column != 0 &&
                index % _this._map.column != _this._map.column - 1) {
                var x = index % _this._map.column * _this._map.long;
                var y = Math.floor(index / _this._map.column) * _this._map.long;
                for (var j = 0; j < _this._map.obstacle.length; j++) {
                    var obstacle = new Image();
                    obstacle.src = "img/mapImg/" + _this._map.obstacle[j].img;

                    if (_this._map.obstacle[j].isBreak) {
                        _this._destructibleObstacles.push([obstacle, _this._map.long, x, y]);
                        _this._mapdata[index] = 3;
                    } else {
                        _this._doNotBreakObstacle.push([obstacle, _this._map.long, x, y]);
                        _this._mapdata[index] = 2;
                    }

                }

            }

        }
        console.log(_this._doNotBreakObstacle);
    };
    this.createMap = function () {      // 创建地图
        var floorIndex = 0;
        var obstacleIndex = 0;
        for (var i = 0; i < _this._mapdata.length; i++) {
            if (_this._mapdata[i] == 0) {   // 0 为可走区域
                ctx.beginPath();
                var index = Math.floor(Math.random() * _this._map.floor.length);
                //var index = 0;
                var floor = new Image();
                floor.src = "img/mapImg/" + _this._map.floor[floorIndex];
                /*index++;
                if(index>=_this._map.floor.length){
                    index = 0;
                }*/
                ctx.drawImage(floor, i % _this._map.column * _this._map.long, Math.floor(i / _this._map.column) * _this._map.long, _this._map.long, _this._map.long)
                floorIndex++;
                if (floorIndex >= _this._map.floor.length) {
                    floorIndex = 0;
                }
            } else if (_this._mapdata[i] == 1) {    // 1 为边墙
                ctx.beginPath();
                var wall = new Image();
                wall.src = "img/mapImg/" + _this._map.wall;
                ctx.drawImage(wall, i % _this._map.column * _this._map.long, Math.floor(i / _this._map.column) * _this._map.long, _this._map.long, _this._map.long)

            } else if (_this._mapdata[i] == 2) {    // 2 为不可破坏障碍

                ctx.beginPath();
                var obstacle = new Image();
                obstacle.src = "img/mapImg/" + _this._map.obstacle[obstacleIndex].img;
                obstacleIndex++;
                if (obstacleIndex >= _this._map.obstacle.length) {
                    obstacleIndex = 0;
                }
                ctx.drawImage(obstacle, i % _this._map.column * _this._map.long, Math.floor(i / _this._map.column) * _this._map.long, _this._map.long, _this._map.long)

            } else if (_this._mapdata[i] == 3) {    // 3 为可破坏障碍

                // ctx.beginPath();
                // var obstacle = new Image();
                // obstacle.src = "img/mapImg/" + _this._map.obstacle[obstacleIndex].img;
                // obstacleIndex++;
                // if (obstacleIndex >= _this._map.obstacle.length) {
                //     obstacleIndex = 0;
                // }
                // ctx.drawImage(obstacle, i % _this._map.column * _this._map.long, Math.floor(i / _this._map.column) * _this._map.long, _this._map.long, _this._map.long)

            }

        }

    }

}