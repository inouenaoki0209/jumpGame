import bunny　from './design/top/B_2_title-bunny.png';
import {Container, Stage} from 'createjs-module';
export class TopPage extends Container{
    private bunny:createjs.Bitmap = new createjs.Bitmap(bunny);
    private _canvas: HTMLCanvasElement;
    private gameStage: Stage;

    public constructor(canvas: HTMLCanvasElement) {
        super();
        this._canvas = canvas;
        this.gameStage = new Stage(this._canvas);
        this.createImage(bunny,this.bunny)
    }

    private createImage(image: string,bitmap: createjs.Bitmap) {
        const img = new Image();
        img.src = image;
        img.onload = () => {
            bitmap= new createjs.Bitmap(img);
            this.gameStage.addChild(bitmap);
        };
    }
    public init(){
        this.stage.update()
    }
}