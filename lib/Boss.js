const Potion = require('./Potion');
const Character = require('./Character');

class Boss extends Character{
  constructor(name, weapon) {

    super(name, weapon);

    this.name = name;
    this.weapon = weapon;
    this.potion = new Potion();

    this.health = Math.floor(Math.random() * 10 + 250);
    this.strength = Math.floor(Math.random() * 5 + 12);
    this.agility = Math.floor(Math.random() * 5 + 12);
  }



  getBossDescription() {
    return `A ${this.name} holding the ${this.weapon} has appeared!`;
  }
};


module.exports = Boss;
