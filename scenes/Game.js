// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class Game extends Phaser.Scene {
  constructor() {
    super("main");
  }

  init() {
    
  }

  preload() {
    //cargar assets

    //importar cielo
    this.load.image("cielo", "../public/assets/Cielo.webp");
    //importar plataforma
    this.load.image("plataforma", "../public/assets/platform.png");
    //importar personaje
    this.load.image("personaje", "../public/assets/Ninja.png");

    //importar recolectables
    this.load.image("cuadrado", "../public/assets/cuadrado.png");
    this.load.image("triangulo", "../public/assets/triangulo.png");
    this.load.image("hectagono", "../public/assets/hectagono.png");
  }

  create() {
    var score = 0;
    var ScoreText;

    
    //crear elementos
    this.cielo = this.add.image(400, 300, "cielo");
    this.cielo.setScale(2);
    //crear grupo plataformas
    this.plataformas = this.physics.add.staticGroup();
    //agregar plataforma
    this.plataformas.create(450, 550, "plataforma").setScale(3).refreshBody();
    //crear personaje
    this.personaje = this.physics.add.sprite(400, 300, "personaje");
    this.personaje.setScale(0.1);
    this.personaje.setCollideWorldBounds(true);
    //this.personaje.setBounce(0.2);
    //agregar collision personaje y plataforma
    this.physics.add.collider(this.personaje, this.plataformas);
    //crear teclas (todas)
    this.cursor = this.input.keyboard.createCursorKeys();
    //puntaje
    ScoreText = this.add.text(16, 16, 'score: 0', { fontSize: '20px', fill: '#000'});
    //crear teclas una a la vez
    //this.w = this.input.keyboard.addKey(Phaser.Input.keyboard.KeyCodes.W);

    //crear grupo recolectables
    this.recolectables = this.physics.add.group();
    //this.physics.add.collider(this.personaje, this.recolectables);
    this.physics.add.collider(this.personaje, this.recolectables, this.destroyRec, null, this);

    this.time.addEvent({
      delay: 1000,
      callback: this.onSecond,
      callbackScope: this,
      loop: true,
    });

    
  }

  

  onSecond(){
    //random
    const tipos = ["cuadrado","triangulo","hectagono"];
    const tipo = Phaser.Math.RND.pick(tipos);
    //crear recolectable
    let recolectable = this.recolectables.create(Phaser.Math.Between(10, 790), 0, tipo).setScale(0.1);
    recolectable.setVelocity(0, 100);
    
    
  }



  update() {
    //MOVIMIENTO PJ
    if (this.cursor.left.isDown){
      this.personaje.setVelocityX(-160);
    } else if(this.cursor.right.isDown){
      this.personaje.setVelocityX(160);
    }else{
      this.personaje.setVelocityX(0);
    }
    //salto pj
    if(this.cursor.up.isDown && this.personaje.body.touching.down){
      this.personaje.setVelocityY(-330);
    }
    //RECOLECTAR OBJETOS
    

    
  }

  destroyRec(personaje, recolectables){
    //recolectables.destroy()
    recolectables.disableBody(true,true);

    //tipo de recolectable

    
  }
}
