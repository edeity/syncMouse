const robot = require('robotjs');
const process = require('process');
const SYSTEM_TYPE = {
    MAC: 0,
    WIN: 1,
    LINUS: 2,
}
let system;
let screenSize;

const KEY_MAP = {
    1: 'esc', 2: '1', 3: '2', 4: '3', 5: '4', 6: '5', 7: '6', 8: '7', 9: '8', 10: '9', 11: '0', 12: '-', 13: '=', 14: 'backspace',
    15: 'tab', 16: 'q', 17: 'w', 18: 'e', 19: 'r', 20: 't', 21: 'y', 22: 'u', 23: 'i', 24: 'o', 25: 'p', 26: '[', 27: ']', 28: 'enter',
    29: 'control', 30: 'a', 31: 's', 32: 'd', 33: 'f', 34: 'g', 35: 'h', 36: 'j', 37: 'k', 38: 'l', 39: ';', 40: '\'', 41: 'enter',  42: 'shift', 43: '\\',
    44: 'z', 45: 'x', 46: 'c', 47: 'v', 48: 'b', 49: 'n', 50: 'm', 51: ',', 52: '.', 53: '/', 54: 'right_shift', 
    55: '', 56: 'alt', 57: 'space', 58: '', 
    59: 'f1', 60: 'f2', 61: 'f3', 62: 'f4', 63: 'f5', 64: 'f6', 65: 'f7', 66: 'f8', 67: 'f9', 68: 'f10', 69: 'f11', 70: 'f12',
    71: '7', 72: '8', 73: '9', 74: '-', 75: '4', 76: '5', 77: '6', 78: '+', 79: '1', 80: '2', 81: '3', 83: '.',
    3675: 'command', 3612: 'enter',  61007: 'end', 60999: 'home',
    57416: 'up', 57419: 'left', 57421: 'right', 57424: 'down', 
    61000: 'up', 61003: 'left', 61005: 'right', 61008: 'down', 
}

const MOUSE_MAP = {
    LEFT: 1,
    RIGHT: 2,
    MIDDLE: 3,
}

const MODIFY_KEY = {
    CONTRROL: 'control',
    COMMAND: 'command',
    ALT: 'alt',
    SHIFT: 'shift'
}

const MOUSE_KEY_NAME = {
    1: 'left',
    2: 'right',
    3: 'middle'
}

const ENTER_DIRECTION = {
    TOP: 0,
    RIGHT: 1,
    BOTTOM: 2,
    LEFT: 3,
}

// 和ENTER_DIRECTION的值刚好相反
const LEAVE_DIRECTION = {
    TOP: 2,
    RIGHT: 3,
    BOTTOM: 0,
    LEFT: 1,
}

const OFFSET = {
    LEAVE: 10, // 监听离开的距离
    SERVER_LEAVE: 0, // 服务端离开的距离
    ENTER: 30, // 进入时即偏移的距离
}

function getKeyModify(modify, remoteSystem) {
    let system = getSystem();
    let isDiffAndIncludMac = remoteSystem !== system && remoteSystem === SYSTEM_TYPE.MAC || system === SYSTEM_TYPE.MAC;
    if(modify.a) {
        return MODIFY_KEY.ALT
    } else if(modify.s) {
        return MODIFY_KEY.SHIFT
    } else if(modify.c) {
        return isDiffAndIncludMac ? MODIFY_KEY.COMMAND : MODIFY_KEY.CONTRROL;
    } else if(modify.m) {
        return isDiffAndIncludMac ? MODIFY_KEY.CONTRROL : MODIFY_KEY.COMMAND;
    } else {
        return undefined;
    }
}

function isCopy(code, modify) {
    if (code === 'c') {
        if (system === SYSTEM_TYPE.MAC) {
            return modify === 'command';
        } else {
            return modify === 'control'
        }
    } else {
        return false;
    }
}

function isKeyModify(modify) {
    // 29: control、3675: command
    return [29, 3675].indexOf(modify) !== -1;
}

function getMouseClick(button) {
    return MOUSE_KEY_NAME[button];
}

function isCtrlGlobalKey(key) {
    // 26: [、27:]
    return [26, 27].indexOf(key) !== -1;
}

function isReadyToGoOut(x, y) {
    let enterOffset = OFFSET.ENTER;
    let { screenWidth, screenHeight } = getLocalScreenSize();
    return x < enterOffset || x > screenWidth - enterOffset || y < enterOffset || y > screenHeight - enterOffset;
}

function getSystem() {
    if (system) {
        return system;
    } else {
        let platform = process.platform;
        if (platform === 'darwin') {
            system = SYSTEM_TYPE.MAC;
        } else if (platform=== 'win32' || platform === 'win64') {
            system = SYSTEM_TYPE.WIN;
        } else {
            // 未确定
            system = SYSTEM_TYPE.LINUS;
        }
        return system;
    }
}

function getLocalScreenSize() {
    if (screenSize) {
        return screenSize;
    } else {
        let screenSize = robot.getScreenSize();
        return {
            screenWidth: screenSize.width,
            screenHeight: screenSize.height,
        }
    }
}

exports = module.exports = {
    KEY_MAP,
    MOUSE_MAP,
    MOUSE_KEY_NAME,
    ENTER_DIRECTION,
    LEAVE_DIRECTION,
    OFFSET,
    SYSTEM_TYPE,
    isKeyModify,
    getMouseClick,
    getKeyModify,
    getMouseClick,
    isCtrlGlobalKey,
    getSystem,
    isCopy,
    isReadyToGoOut,
    getLocalScreenSize,
}