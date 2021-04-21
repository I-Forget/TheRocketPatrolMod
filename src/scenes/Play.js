//console.log('accessing Play.js');
// figured out how to get play scene to show up was missing transition from menu to play scene.
class Play extends Phaser.Scene {

    constructor() {
        super("playScene");
        //console.log('is the play scene being created');
    }

    preload() {
        this.load.image('rocket', 'assets/rocket.png');
        this.load.image('spaceship', 'assets/spaceship.png');
        this.load.image('starfield', 'assets/starfield.png');
        this.load.spritesheet('explosion', 'assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9}); 
        this.load.audio('sfx_select', 'assets/blip_select12.wav');
        this.load.audio('sfx_explosion', 'assets/explosion38.wav');
        this.load.audio('sfx_rocket', 'assets/rocket_shot.wav');
    }

    create() {
        //this.add.text(20,20, "Start playing now!!!"); it's not showing for me :/
        //star field stuff.
        this.starfield = this.add.tileSprite(0,0,640,480, 'starfield').setOrigin(0,0);
        
        this.p1Rocket = new Rocket(this, 
            game.config.width/2, 
            game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0); //was missing the origin in order for it to show up.Smith didn't have it but it showed up?? 

        this.ship1 = new Ship(
            this,
            game.config.width + borderUISize*6,
            borderUISize*4,
            'spaceship',
            0,
            30  
        ).setOrigin(0,0);

        this.ship2 = new Ship(
            this,
            game.config.width + borderUISize*3,
            borderUISize*8 + borderPadding*3,
            'spaceship',
            0,
            20 
        ).setOrigin(0,0);

        this.ship3 = new Ship(
            this,
            game.config.width,
            borderUISize*6 + borderPadding*4,
            'spaceship',
            0,
            10 
        ).setOrigin(0,0);
        
        this.ship4 = new Ship(
            this, 
            game.config.width + borderUISize *7,
            borderUISize*5 + borderPadding*2,
            'spaceship',
            0,
            60
        ).setOrigin(0,0);

        this.ship4.moveSpeed = game.settings.spaceshipSpeed*2;
            // Green rectangle thing
        this.add.rectangle(
            0, 
            borderUISize + borderPadding,
            game.config.width,
            borderUISize * 2,
            0x00FF00,
            ).setOrigin(0,0);

        //white borders when they appear lol
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
    
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    
        //animattion config time 
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}), 
            frameRate:30
        });
        
        this.p1Score = 0; // score initialization part 

        let scoreConfig = {
            fontFamily: 'Courier',
            fontsize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize +borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
    
        this.gameOver = false;

        scoreConfig.fixedWidth = 0;
        this.timeVariable = game.settings.gameTimer;

        this.clock = this.time.delayedCall(this.timeVariable, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 +64, 'Press (R) to Restart', scoreConfig).setOrigin(0.5);
            this.gameOver = true; 
        }, null, this);

        let timeConfig = {
            fontFamily: 'Courier',
            fontsize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }        
        this.timeRight = this.add.text(borderUISize* 15 + borderPadding*2, borderUISize + borderPadding*2, this.timeVariable, timeConfig);
        timeConfig.fixedWidth = 0;
    
        let fireConfig = {
            fontFamily: 'Courier',
            fontsize: '34px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 120 
        }
        this.fireCenter = this.add.text(borderUISize*8 + borderPadding*2, borderUISize + borderPadding*2, "R E A D Y!", fireConfig);
    
    }

    update() {
        
        this.starfield.tilePositionX -= 4;
        if(!this.gameOver){
            this.timeRight.setText(Math.floor(this.timeVariable-this.clock.getElapsed()));
            this.checkFire(this.p1Rocket);
            this.p1Rocket.update();
            this.ship1.update();
            this.ship2.update();
            this.ship3.update();
            this.ship4.update();
            this.checkCollision(this.p1Rocket, this.ship1);
            this.checkCollision(this.p1Rocket, this.ship2);
            this.checkCollision(this.p1Rocket, this.ship3);
            this.checkCollision(this.p1Rocket, this.ship4);
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)){
            this.scene.restart();
        }
    }

    checkFire(rocket){
        if(rocket.isFiring){
            this.fireCenter.text = "F I R E!";
        }else{
            this.fireCenter.text = "R E A D Y!";
        }
    }

    checkCollision(rocket, ship){
        if( rocket.x + rocket.width > ship.x &&
            rocket.x < ship.x + ship.width &&
            rocket.y + rocket.height > ship.y &&
            rocket.y < ship.y + ship.height){
                rocket.reset();
                this.shipExplode(ship); //since this prefix is being passed in through the update I just need to use the variable I believe edit 1: need the this to make the animation work rip
        }
    }

    shipExplode(ship) {
        ship.alpha = 0; // invisible ship is now on the explode
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0,0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            ship.reset(); // ship reset is now on the explode since it resets the position and makes itself visible
            boom.destroy();
        })
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion');
    }    
}