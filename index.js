console.log('Live reloading');

const startButton = document.getElementById('startButton');
const gameButtons = document.getElementsByClassName('square');
const level = document.getElementById('level');

class SimonSays {
    constructor(gameButtons, startButton, level) {
        this.display = { startButton, level }

        this.userStep = 0; // User secuence
        this.level = 0; // Actual game level
        this.totalLevels = 20; // Finishing game

        this.sequence = []; // Game secuence
        this.speed = 1000; // 1 second

        this.blockedButtons = true; // This is when the game is showing the secuense to follow player can't press buttons
        this.buttons = Array.from(gameButtons); // Array for save the game buttons information
        this.errorSound = new Audio('./sounds/errorSound.mp3');
        this.buttonSounds = [
            new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
            new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
            new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
            new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'),
        ]
        //Add the sounds for the game buttons
    }

    // ================= Methods ====================================

    // Initialize the Simon program
    init() {
        // With an onclick event execute the startGame method
        this.display.startButton.onclick = () => this.startGame();
    }

    // Starts the game loop
    startGame() {
        this.display.startButton.disabled = true; // disable the start game button
        this.userStep = 0; // Reset the user secuences to press

        this.updateLevel(0);  // Reset the levels
        this.sequence = this.createSequence(); // Creates the random secuence of the inputs
        this.showSequence(); // Shows the secuense to repat (1 button at start)

        this.buttons.forEach((element, i) => {  // To each button
            element.classList.remove('winner'); // If player plays again after win the game
            element.onclick = () => this.clickButton(i); // Gets the button value with a click
        });
    }

    // Updates the level and the buttons
    updateLevel(n) {
        this.level = n;
        this.display.level.textContent = `level: ${this.level + 1}`; // Change the content for the amount of level player have beat (starts at 0)
    }

    // This methot sets the randoms input secuence
    createSequence() {
        return Array.from({ length: this.totalLevels }, () => this.getRandomColor()); // Create an array with length of the total level of the game and returns each of the random colors 
    }

    // Gets the random color for the secuence to follow
    getRandomColor() {
        return Math.floor(Math.random() * 4); // Returns a number between 0 and 3 randomly
        // Math.random() returns a random number between 0 and 1
        // It multiplays to 4 the random values to get numbers before 4 (0 to 3)
        // The Math.floor() method rounds a number down to the nearest integer, without this the numbers would be floats
    }

    showSequence() {
        this.blockedButtons = true;  // blocks the buttons to player
        let sequenceNumber = 0; // Starts the secuense

        let t = setInterval(() => { // Interavl timer
            const button = this.buttons[this.sequence[sequenceNumber]];
            this.buttonSounds[this.sequence[sequenceNumber]].play(); //Call the button sounds to play in the sequence
            this.toggleButtonStyle(button);
            setTimeout(() => this.toggleButtonStyle(button), this.speed / 2);
            sequenceNumber++;

            if (sequenceNumber > this.level) { // Unlocks the buttons when the game finishes show the sequence
                this.blockedButtons = false;
                clearInterval(t); // Stops the inverval timer
            }
        }, this.speed);
    }

    toggleButtonStyle(button) {
        button.classList.toggle('active'); // Adds the class to the buttons and simulates that the button is pressed
    }

    gameLost() { //Function used to notify a mistake to the player
        this.errorSound.play(); //Play an error sound
        this.showSequence(); //Call the current sequence again
    }

    clickButton(value) {
        !this.blockedButtons && this.validateChosenColor(value); // if buttons arent blocked so validates the color secuence
    }

    validateChosenColor(value) {
        if (this.sequence[this.userStep] === value) { //if the user stept secuense matches with the game secuense button is true
            this.buttonSounds[value].play(); // Plays the sound to confirm that the button secuense is correct
            if (this.level === this.userStep) { // This is when the secuense is not over but he is still playing
                this.updateLevel(this.level + 1); // sums the level counter
                this.GameOver(); // Validates if the match is over
            }

            else {
                this.userStep++;
            }
        }
        else {  
            this.gameLost(); //Call a function for when the player presses a wrong button
        }
    }

    GameOver() {

        this.userStep = 0; // Reset the player step secuence
        this.showSequence(); // Show new secuence

    }

}

const simon = new SimonSays(gameButtons, startButton, level);
simon.init();