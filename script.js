class PomodoroTimer {
    constructor() {
        this.WORK_TIME = 25 * 60; // 25 minutes
        this.BREAK_TIME = 5 * 60;  // 5 minutes
        this.timeLeft = this.WORK_TIME;
        this.timerId = null;
        this.isRunning = false;
        this.isWorkMode = true;
        this.completedPomodoros = 0;
        this.originalTitle = document.title;

        // DOM elements
        this.timeDisplay = document.getElementById('timeDisplay');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.modeDisplay = document.getElementById('modeDisplay');
        this.statsDisplay = document.getElementById('statsDisplay');
        this.modeToggleBtn = document.getElementById('modeToggleBtn');
        this.endSessionBtn = document.getElementById('endSessionBtn');

        // Bind event listeners
        this.startBtn.addEventListener('click', () => this.toggleTimer());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.modeToggleBtn.addEventListener('click', () => this.toggleMode());
        this.endSessionBtn.addEventListener('click', () => this.endSession());

        this.updateDisplay();
        this.updateModeDisplay();
    }

    toggleTimer() {
        if (this.isRunning) {
            this.pause();
            this.startBtn.textContent = 'Start';
        } else {
            this.start();
            this.startBtn.textContent = 'Pause';
        }
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.timerId = setInterval(() => this.tick(), 1000);
        }
    }

    pause() {
        this.isRunning = false;
        clearInterval(this.timerId);
    }

    reset() {
        this.pause();
        this.isWorkMode = true;
        this.timeLeft = this.WORK_TIME;
        this.updateDisplay();
        this.updateModeDisplay();
        this.startBtn.textContent = 'Start';
        document.title = this.originalTitle;
    }

    toggleMode() {
        if (this.isRunning) {
            if (!confirm('Timer is running. Are you sure you want to switch modes?')) {
                return;
            }
            this.pause();
        }
        this.isWorkMode = !this.isWorkMode;
        this.timeLeft = this.isWorkMode ? this.WORK_TIME : this.BREAK_TIME;
        this.updateDisplay();
        this.updateModeDisplay();
        this.modeToggleBtn.textContent = this.isWorkMode ? 'Switch to Break' : 'Switch to Work';
        this.startBtn.textContent = 'Start';
    }

    endSession() {
        if (this.isRunning && !confirm('Timer is still running. End session anyway?')) {
            return;
        }

        if (this.isWorkMode) {
            const timeSpent = this.WORK_TIME - this.timeLeft;
            const minutesSpent = Math.floor(timeSpent / 60);
            if (minutesSpent >= 5) { // Only count if at least 5 minutes were spent
                this.completedPomodoros++;
                this.updateStats();
            }
        }

        this.pause();
        this.timeLeft = this.isWorkMode ? this.WORK_TIME : this.BREAK_TIME;
        this.updateDisplay();
        this.startBtn.textContent = 'Start';
    }

    tick() {
        if (this.timeLeft > 0) {
            this.timeLeft--;
            this.updateDisplay();
        } else {
            this.pause();
            if (this.isWorkMode) {
                this.completedPomodoros++;
                this.updateStats();
                alert('Work session completed! Time for a break!');
            } else {
                alert('Break time is over! Ready to work?');
            }
            this.switchMode();
            this.startBtn.textContent = 'Start';
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.timeDisplay.textContent = timeString;
        
        // Update browser tab title
        const modePrefix = this.isWorkMode ? '🎯' : '☕';
        document.title = `${modePrefix} ${timeString} - Pomodoro`;
    }

    updateModeDisplay() {
        this.modeDisplay.textContent = this.isWorkMode ? 'Work Mode' : 'Break Mode';
        this.modeDisplay.className = 'mode-indicator ' + (this.isWorkMode ? 'work-mode' : 'break-mode');
        this.modeToggleBtn.textContent = this.isWorkMode ? 'Switch to Break' : 'Switch to Work';
    }

    updateStats() {
        this.statsDisplay.textContent = `Completed Pomodoros: ${this.completedPomodoros}`;
    }

    switchMode() {
        if (this.isWorkMode) {
            this.isWorkMode = false;
            this.timeLeft = this.BREAK_TIME;
        } else {
            this.isWorkMode = true;
            this.timeLeft = this.WORK_TIME;
        }
        this.updateModeDisplay();
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
}); 