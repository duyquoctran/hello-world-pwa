window.onload = function () {
  var oUi = new GameUi();
  var oCtrl = new GameCtrl(oUi);
  oUi.setCtrl(oCtrl);
  oCtrl.startGame();
};
var Tool = {
  getE: function (sName) {
    var sType = sName[0];
    sName = sName.split(sType)[1];
    switch (sType) {
      case "#":
        return document.getElementById(sName);
      case ".":
        var aResult = new Array();
        var aObj = document.getElementsByTagName("*");
        for (var i = aObj.length - 1; i >= 0; i--) {
          if (aObj[i].className && aObj[i].className.indexOf(sName) != -1) {
            aResult.push(aObj[i]);
          }
        }
        return aResult;
      default:
        return document.getElementsByTagName(sName);
    }
  },
};

function GameUi() {
  var oCtrl, aBlocks, sPlayerStyle, sAiStyle;

  var init = function () {
      aBlocks = Tool.getE(".block");
    },
    startGame = function () {
      clean();
      startScreen();
    },
    startScreen = function () {
      var oScreen = Tool.getE("#start_screen");
      (selectO = Tool.getE("#selectO")), (selectX = Tool.getE("#selectX"));
      oScreen.style["display"] = "block";
      selectX.onmouseover = function () {
        selectO.className = "";
        this.className = "current";
      };
      selectO.onmouseover = function () {
        selectX.className = "";
        this.className = "current";
      };
      selectX.onclick = function () {
        sPlayerStyle = "x";
        sAiStyle = "o";
        oScreen.style["display"] = "none";
        setupListener();
      };
      selectO.onclick = function () {
        sPlayerStyle = "o";
        sAiStyle = "x";
        oScreen.style["display"] = "none";
        oCtrl.nextStep();
        setupListener();
      };
    },
    setupListener = function () {
      for (var i = aBlocks.length - 1; i >= 0; i--) {
        (function (index) {
          aBlocks[index].onclick = function () {
            if (aBlocks[index].innerHTML != "") return;
            draw("player", index);
            oCtrl.setChessboard(index, -1);
            oCtrl.nextStep();
          };
        })(i);
      }
    },
    endGame = function () {
      endScreen();
    },
    endScreen = function () {
      var oScreen = Tool.getE("#end_screen");
      var oEndInfo = Tool.getE("#end_info");
      switch (oCtrl.getWinner()) {
        case "ai":
          oEndInfo.innerHTML = "LOST";
          break;
        case "player":
          oEndInfo.innerHTML = "WIN";
          break;
        case "no":
          oEndInfo.innerHTML = "ITE";
          break;
      }
      oScreen.style["display"] = "block";
      var btnRestart = Tool.getE("#btn_restart");
      btnRestart.onclick = function () {
        oScreen.style["display"] = "none";
        oCtrl.startGame();
      };
    },
    draw = function (role, index) {
      var obj = aBlocks[index];
      switch (role) {
        case "ai":
          obj.innerHTML = '<div class="' + sAiStyle + '"></div>';
          break;
        case "player":
          obj.innerHTML = '<div class="' + sPlayerStyle + '"></div>';
          break;
        default:
          break;
      }
    },
    clean = function () {
      for (var i = aBlocks.length - 1; i >= 0; i--) {
        aBlocks[i].innerHTML = "";
      }
    };
  init();

  return {
    setCtrl: function (_oCtrl) {
      oCtrl = _oCtrl;
    },
    startGame: function () {
      startGame();
    },
    endGame: function () {
      endGame();
    },
    draw: function (role, obj) {
      draw(role, obj);
    },
  };
}

function GameCtrl(_oUi) {
  var oUi, winner, aChessboard, aWinCondition;

  var init = function () {
      oUi = _oUi;
      (aChessboard = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
        (aWinCondition = [
          [0, 1, 2, 3],
          [4, 5, 6 ,7],
          [8, 9, 10, 11],
          [12, 13, 14, 15],
          [0, 5, 10, 15],
          [3, 6, 9, 12],
          [0, 4, 8, 12],
          [1, 5, 9, 13],
          [2, 6, 10, 14],
          [3, 7, 11, 15],
        ]);
    },
    checkOver = function () {
      for (var i = aWinCondition.length - 1; i >= 0; i--) {
        if (
          aChessboard[aWinCondition[i][0]] +
            aChessboard[aWinCondition[i][1]] +
            aChessboard[aWinCondition[i][2]] +
            aChessboard[aWinCondition[i][3]] ==
          4
        ) {
          winner = "ai";
          oUi.endGame();
          return true;
        }
        if (
          aChessboard[aWinCondition[i][0]] +
            aChessboard[aWinCondition[i][1]] +
            aChessboard[aWinCondition[i][2]] +
            aChessboard[aWinCondition[i][3]] ==
          -4
        ) {
          winner = "player";
          oUi.endGame();
          return true;
        }
      }
      var count = 0;
      for (var i = aWinCondition.length - 1; i >= 0; i--) {
        if (aChessboard[i] != 0) count++;
      }
      if (count == 10) {
        winner = "no";
        oUi.endGame();
        return true;
      }
      return false;
    },
    nextStep = function () {
      if (!checkOver()) {
        var nMax = null,
          nMaxSub,
          aChessboards = new Array();
        for (var i = 16; i >= 0; i--) {
          for (var i2 = 16; i2 >= 0; i2--) {
            if (aChessboard[i2] != 0) continue;
            aChessboard[i2] = 1;
            for (var k = aWinCondition.length - 1; k >= 0; k--) {
              if (
                aChessboard[aWinCondition[k][0]] +
                  aChessboard[aWinCondition[k][1]] +
                  aChessboard[aWinCondition[k][2]] +
                  aChessboard[aWinCondition[k][3]] ==
                4
              ) {
                console.log(i2);
                oUi.draw("ai", i2);
                checkOver();
                return;
              }
            }
            aChessboard[i2] = 0;
          }

          if (aChessboard[i] != 0) continue;
          aChessboard[i] = 1;

          var aTempCb = aChessboard.concat();
          var nMin = null;
          var aTempCbs = new Array();
          for (var j = 16; j >= 0; j--) {
            if (aTempCb[j] != 0) continue;
            aTempCb[j] = -1;
            for (var k = aWinCondition.length - 1; k >= 0; k--) {
              if (
                aTempCb[aWinCondition[k][0]] +
                  aTempCb[aWinCondition[k][1]] +
                  aTempCb[aWinCondition[k][2]] +
                  aTempCb[aWinCondition[k][3]] ==
                -4
              ) {
                aChessboard[j] = 1;
                aChessboard[i] = 0;
                oUi.draw("ai", j);
                checkOver();
                return;
              }
            }

            var nMax2 = 0,
              nMin2 = 0,
              aTempCbMax = aTempCb.concat(),
              aTempCbMin = aTempCb.concat();
            for (var l = 16; l >= 0; l--) {
              if (aTempCbMax[l] == 0) {
                aTempCbMax[l] = 1;
              }
              if (aTempCbMin[l] == 0) {
                aTempCbMin[l] = -1;
              }
            }
            for (var m = aWinCondition.length - 1; m >= 0; m--) {
              if (
                aTempCbMax[aWinCondition[m][0]] +
                  aTempCbMax[aWinCondition[m][1]] +
                  aTempCbMax[aWinCondition[m][2]] +
                  aTempCbMax[aWinCondition[m][3]] ==
                4
              ){
                nMax2++;
              }
              if (
                aTempCbMin[aWinCondition[m][0]] +
                  aTempCbMin[aWinCondition[m][1]] +
                  aTempCbMin[aWinCondition[m][2]] +
                  aTempCbMin[aWinCondition[m][3]] ==
                -4
              ) {
                nMin2++;
              }
            }
            var nDiff = nMax2 - nMin2;

            if (nMin == null) {
              nMin = nDiff;
            } else {
              nMin = nMin > nDiff ? nDiff : nMin;
            }
            aTempCb[j] = 0;
          }

          if (nMax == null) {
            nMax = nMin;
            nMaxSub = i;
          } else {
            if (nMax < nMin) {
              nMax = nMin;
              nMaxSub = i;
            }
          }
          aChessboard[i] = 0;
        }
        aChessboard[nMaxSub] = 1;
        oUi.draw("ai", nMaxSub);
        checkOver();
      } else {
      }
    };
  init();

  return {
    startGame: function () {
      aChessboard = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      oUi.startGame();
    },
    nextStep: function (nPlayerStep) {
      nextStep();
    },
    setChessboard: function (index, val) {
      aChessboard[index] = val;
    },
    getWinner: function () {
      return winner;
    },
  };
}
