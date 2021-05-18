const inquirer = require('inquirer');
const Enemy = require('./Enemy');
const Player = require('./Player');
const Boss = require('./Boss')



class Game {
constructor() {
    this.roundNumber = 0;
    this.isPlayerTurn = false;
    this.enemies = [];
    this.currentEnemy;
    this.player;
    this.currentBoss;
    this.boss = []
}



initializeGame() {
    this.enemies.push(new Enemy('goblin', 'sandwich'));
    this.enemies.push(new Enemy('orc', 'balloon animal'));
    this.enemies.push(new Enemy('skeleton', 'broom handle'));
    this.enemies.push(new Enemy('young dragon', 'empty salad bowl'));
    

    this.currentEnemy = this.enemies[0];
    

    inquirer
        .prompt({
            type: 'text',
            name: 'name',
            message: 'What is your name?'
        })

        .then(({ name }) => {
            this.player = new Player(name);


            this.startNewBattle()
        });

};

startBossFight() {

    this.boss.push(new Boss('Elder Litch', 'Staff of Really Cold Things!'));

   
    this.currentBoss = this.boss[0];

            this.startBossBattle()
        

};

startNewBattle() {
    if (this.player.agility > this.currentEnemy.agility) {
        this.isPlayerTurn = true;
    } else {
        this.isPlayerTurn = false;
    }
    console.log('Your stats are as follows:');
    console.table(this.player.getStats());
    console.log(this.currentEnemy.getDescription());
    this.battle();
};

startBossBattle() {
    if (this.player.agility > this.currentBoss.agility) {
        this.isPlayerTurn = true;
    } else {
        this.isPlayerTurn = false;
    }
    console.log('Your stats are as follows:');
    console.table(this.player.getStats());
    console.log(this.currentBoss.getBossDescription());
    this.bossBattle();
};

battle() {
    if (this.isPlayerTurn) {
        inquirer
            .prompt({
                type: 'list',
                message: 'What would you like to do?',
                name: 'action',
                choices: ['Attack', 'Use potion']
            })
            .then(({ action }) => {
                if (action === 'Use potion') {
                    if (!this.player.getInventory()) {
                        console.log("you don't have any potions!");
                        return this.checkEndOfBattle();
                    }
                    inquirer
                        .prompt({
                            type: 'list',
                            message: 'Which potion would you like to use?',
                            name: 'action',
                            choices: this.player.getInventory().map((item, index) => `${index + 1}: ${item.name}`)
                        })
                        .then(({ action }) => {
                            const potionDetails = action.split(': ');

                            this.player.usePotion(potionDetails[0] - 1);
                            console.log(`You used a ${potionDetails[1]} potion.`);

                            this.checkEndOfBattle();
                        });
                } else {
                    const damage = this.player.getAttackValue();
                    this.currentEnemy.reduceHealth(damage);

                    console.log(`You attacked the ${this.currentEnemy.name}`);
                    console.log(this.currentEnemy.getHealth());

                    this.checkEndOfBattle();
                }
            });
    }else {
        const damage = this.currentEnemy.getAttackValue();
        this.player.reduceHealth(damage);

        console.log(`The ${this.currentEnemy.name} has attacked you!`);
        console.log(this.player.getHealth());

        this.checkEndOfBattle();
    }
};

bossBattle() {
    if (this.isPlayerTurn) {
        inquirer
            .prompt({
                type: 'list',
                message: 'What would you like to do?',
                name: 'action',
                choices: ['Attack', 'Use potion']
            })
            .then(({ action }) => {
                if (action === 'Use potion') {
                    if (!this.player.getInventory()) {
                        console.log("you don't have any potions!");
                        return this.checkEndOfBossBattle();
                    }
                    inquirer
                        .prompt({
                            type: 'list',
                            message: 'Which potion would you like to use?',
                            name: 'action',
                            choices: this.player.getInventory().map((item, index) => `${index + 1}: ${item.name}`)
                        })
                        .then(({ action }) => {
                            const potionDetails = action.split(':');

                            this.player.usePotion(potionDetails[0] - 1);
                            console.log(`You used a ${potionDetails[1]} potion.`);

                            this.checkEndOfBossBattle();
                        });
                } else {
                    const damage = this.player.getAttackValue();
                    this.currentBoss.reduceHealth(damage);

                    console.log(`You attacked the ${this.currentBoss.name}`);
                    console.log(this.currentBoss.getHealth());

                    this.checkEndOfBossBattle();
                }
            });
    }else {
        const damage = this.currentBoss.getAttackValue();
        this.player.reduceHealth(damage);

        console.log(`The ${this.currentBoss.name} has attacked you!`);
        console.log(this.player.getHealth());

        this.checkEndOfBossBattle()
    }
};

checkEndOfBattle() {
    if (this.player.isAlive() && this.currentEnemy.isAlive()) {
        this.isPlayerTurn = !this.isPlayerTurn;
        this.battle();
      }else if (this.player.isAlive() && !this.currentEnemy.isAlive()) {
        console.log(`You've defeated the ${this.currentEnemy.name}`);
      
        this.player.addPotion(this.currentEnemy.potion);
        this.player.addPotion('health');
        console.log(`${this.player.name} found a ${this.currentEnemy.potion.name} potion`);
      
        this.roundNumber++;
      
        if (this.roundNumber < this.enemies.length) {
          this.currentEnemy = this.enemies[this.roundNumber];
          this.startNewBattle();
        } else {
            this.startBossFight();
        //   console.log('You win!');
         // console.table(this.player.getStats());
        }
      }else {
        console.log("You've been defeated!");
        console.table(this.player.getStats());
      }
}

checkEndOfBossBattle() {
    if (this.player.isAlive() && this.currentBoss.isAlive()) {
        this.isPlayerTurn = !this.isPlayerTurn;
        this.bossBattle();
      }else if (this.player.isAlive() && !this.currentBoss.isAlive()) {
        console.log(`You've defeated the ${this.currentBoss.name}`);
      
      
        if (this.roundNumber < this.boss.length) {
    
        
        } else {
            
          console.log('You have killed the BOSS!! Congratulations you have Won!!');
          console.table(this.player.getStats());
        }
      }else {
        console.log("You've been defeated!");
        console.table(this.player.getStats());
      }
}
};




module.exports = Game;