// a carbon copy of the ship class since inheritance is weird in Javascript or rather
// don't currently have the time to watch and look at it.
class Supership extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue){
        super(scene, x, y, texture, frame,);
        scene.add.existing(this);
        this.points = pointValue;
        this.moveSpeed = 7
    }

    update(){
        this.x -= this.moveSpeed;

        if(this.x < -this.width){
            this.x = game.config.width;
        }
    }

    reset(){
        this.x = game.config.width + 50; 
        this.y = Phaser.Math.Between(borderUISize*5, game.config.height-(borderUISize*5));
        this.alpha = 1; 
    }
}