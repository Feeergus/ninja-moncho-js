// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class Game extends Phaser.Scene {
  constructor() {
    super("main");
  }

  init() {
    //puntaje
    this.score = 0;
    this.shapes = {
      triangulo: {points: 10, count: 0},
      cuadrado: {points: 20, count: 0},
      hectagono: {points: 30, count: 0}
    }
    //temporizador
    this.gameOver = false;
    this.timer = 30;
    //var timerText;
    
    
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
    //ScoreText = this.add.text(16, 100, 'score: 0', { fontSize: '20px', fill: '#000'});
    //crear teclas una a la vez
    //this.w = this.input.keyboard.addKey(Phaser.Input.keyboard.KeyCodes.W);

    //crear grupo recolectables
    this.recolectables = this.physics.add.group();
    //this.physics.add.collider(this.personaje, this.recolectables);
    this.physics.add.collider(this.personaje, this.recolectables, this.destroyRec, null, this);
    
    this.physics.add.collider(this.recolectables, this.plataformas, this.EnRebote, null, this);
    this.time.addEvent({
      delay: 1000,
      callback: this.onSecond,
      callbackScope: this,
      loop: true,
    });
    //reinicio
    this.r = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R );
    //TEMPORIZADOR
    this.time.addEvent({
      delay: 1000,
      callback: this.handleTimer,
      callbackScope: this,
      loop: true,
    });

    this.timerText = this.add.text(16, 16, `tiempo restante: ${this.timer}`, { fontSize: "20px", fill: "#000" });
   
    this.ScoreText = this.add.text(16, 
      60,
      `score: ${this.score} 
       T: ${this.shapes["triangulo"].count} 
       C: ${this.shapes["cuadrado"].count} 
       H: ${this.shapes["hectagono"].count}` 
      )
  }

  

  onSecond(){
    if(this.gameOver){
      return
    }
    //random
    const tipos = ["cuadrado","triangulo","hectagono"];
    const tipo = Phaser.Math.RND.pick(tipos);
    //crear recolectable
    let recolectable = this.recolectables.create(Phaser.Math.Between(10, 790), 0, tipo).setScale(0.1);
    recolectable.setVelocity(0, 100);

    const bounce = Phaser.Math.FloatBetween(0.4, 0.8);
    recolectable.setBounce(bounce);

    recolectable.setData("points", this.shapes[tipo].points);
    recolectable.setData("tipo", tipo);
  }



  update() {
    if (this.gameOver && this.r.isDown){
      this.scene.restart();
    }
    //game over
    if (this.gameOver){
      this.physics.pause();
      this.timerText.setText("Game Over");
      return;
    }
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
    

    

    
  }

  //RECOLECTAR OBJETOS
  destroyRec(personaje, recolectables){
    //tipo de recolectable y puntos
    const nombreFig = recolectables.getData("tipo");
    const points = recolectables.getData("points");
    this.score += points;
    //cantidad Recolectables
    this.shapes[nombreFig].count += 1;
    //console.log(nombreFig, points, this.score);
    //console.table(this.shapes);
    //recolectables.destroy()
    recolectables.destroy(true,true);

    //sumar al score
    this.ScoreText.setText(
      `score: ${this.score} 
       T: ${this.shapes["triangulo"].count} 
       C: ${this.shapes["cuadrado"].count} 
       H: ${this.shapes["hectagono"].count}` 
      )
    
    //console.log("recolectado ", recolectable.texture.key);
    
    this.checkWin();
  }

  checkWin(){
    //constante ganar
    const cumplePuntos = this.score >= 100;
    const cumpleFiguras = this.shapes["triangulo"].count >= 2 &&
     this.shapes["cuadrado"].count >= 2 &&
      this.shapes["hectagono"].count >= 2;
  
    if(cumplePuntos && cumpleFiguras){
      //console.log("Ganaste");
      this.scene.start("end", {
        score: this.score,
        gameOver: this.gameOver,
      });
    }
  }

  handleTimer(){
    this.timer -= 1;
    this.timerText.setText(`tiempo restante: ${this.timer}`);
    if(this.timer === 0){
      this.gameOver = true;
      this.scene.start("end", {
        score: this.score,
        gameOver: this.gameOver,
      });
    }
  }

  EnRebote(recolectable, plataforma){
    let points = recolectable.getData("points");
    points -= 5;
    recolectable.setData("points", points);
    if (points <= 0) {
      recolectable.destroy();
    }
  }

}
