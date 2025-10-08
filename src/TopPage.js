"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopPage = void 0;
const B_2_title_bunny_png_1 = __importDefault(require("../design/top/B_2_title-bunny.png"));
const createjs_module_1 = require("createjs-module");
class TopPage extends createjs_module_1.Container {
    bunny = new createjs.Bitmap(B_2_title_bunny_png_1.default);
    _canvas;
    gameStage;
    constructor(canvas) {
        super();
        this._canvas = canvas;
        this.gameStage = new createjs_module_1.Stage(this._canvas);
        this.createImage(B_2_title_bunny_png_1.default, this.bunny);
    }
    createImage(image, bitmap) {
        const img = new Image();
        img.src = image;
        img.onload = () => {
            bitmap = new createjs.Bitmap(img);
            this.gameStage.addChild(bitmap);
        };
    }
    init() {
        this.stage.update();
    }
}
exports.TopPage = TopPage;
