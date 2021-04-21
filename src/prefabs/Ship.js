class Ship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue){
        super(scene, x, y, texture, frame,);
        scene.add.existing(this);
        this.points = pointValue;
        this.moveSpeed = game.settings.spaceshipSpeed;
    }

    update(){
        this.x -= this.moveSpeed;

        if(this.x < -this.width){
            this.x = game.config.width;
        }
    }

    reset(){
        this.x = game.config.width + 50;
        // game.config.height-borderUISize-borderPadding = is where the rocket starts
        // so try making a variable within the range 
        this.y = Phaser.Math.Between(borderUISize*5, game.config.height-(borderUISize*5));
        this.alpha = 1; 
    }
}