import bunny from './design/top/B_2_title-bunny.png';
import cell from './design/top/C_2_title-scaffolding.png';

export class TopPage extends createjs.Container {
    private STAGE_VOLUME = 5;

    public async init(): Promise<void> {
        const bunnyBmp = await this.loadBitmap(bunny);
        this.addChild(bunnyBmp); // ← Stageではなく自分自身に addChild

        const cells = await Promise.all(
            Array.from({ length: this.STAGE_VOLUME }, () => this.loadBitmap(cell))
        );
        cells.forEach((bmp, i) => {
            bmp.x = i * 64;
            bmp.y = 100;
            this.addChild(bmp);
        });
    }

    private loadBitmap(url: string): Promise<createjs.Bitmap> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(new createjs.Bitmap(img));
            img.onerror = reject;
            img.src = url;
        });
    }
}