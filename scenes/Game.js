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
    this.load.image("personaje", "../public/assets/Ninja.png")
  }

  create() {
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
  }

  update() {
 
  }
}
