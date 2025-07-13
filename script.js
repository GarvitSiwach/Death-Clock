window.onload = function () {
  const words = [
    "School time", "Office hours", "Workout timer", "Alarm rings",
    "But this...", "It whispers...", "Work harder", "Time's dying",
    "Never stops", "Death Clock", "Tick", "Hurry", "Focus", "Time’s up",
    "Faster", "Finish it", "Why wait?", "Run", "Too late", "Seconds",
    "Grind", "Push", "No mercy", "Fade", "Final"
  ];
  const container = document.getElementById('floating-container');

  function createFloatingText() {
    const span = document.createElement('span');
    span.className = 'float-text';
    span.textContent = words[Math.floor(Math.random() * words.length)];
    span.style.left = `${Math.random() * 90 + 2}%`;
    span.style.top = `${Math.random() * 90 + 5}%`;
    container.appendChild(span);
    setTimeout(() => span.remove(), 4000);
  }

  setInterval(createFloatingText, 1000);
};

let userName = ""; // Global variable

function showMain() {
  const nameInputEl = document.getElementById("username");
  const nameInput = nameInputEl.value.trim();

  if (nameInput === "") {
    alert("Please enter your name before proceeding.");
    nameInputEl.focus();
    return;
  }

  userName = nameInput;

  const button = document.querySelector(".get-started");
  const main = document.getElementById("main");

  button.classList.add("shrink");
  button.textContent = "";

  setTimeout(() => {
    document.getElementById("landing").style.display = "none";
    main.style.display = "flex";

    setTimeout(() => {
      main.classList.add("show");
    }, 50);
  }, 1800);
}

let countdownInterval = null;
let arcAnimationFrame = null;

function startCountdown() {
  const dobInput = document.getElementById('dob').value;
  const expectancy = parseInt(document.getElementById('expectancy').value);
  const button = document.getElementById('startBtn');

  if (countdownInterval !== null) {
    clearInterval(countdownInterval);
    cancelAnimationFrame(arcAnimationFrame);
    countdownInterval = null;
    arcAnimationFrame = null;
    button.textContent = "Start Clock";
    button.classList.remove("stop-active");
    return;
  }

  if (!dobInput || isNaN(expectancy)) {
    alert("Please enter both Date of Birth and Life Expectancy.");
    return;
  }

  const canvas = document.getElementById('arcClock');
  const ctx = canvas.getContext('2d');
  ctx.lineCap = 'round';

  const birthdate = new Date(dobInput);
  const deathDate = new Date(birthdate);
  deathDate.setFullYear(birthdate.getFullYear() + expectancy);

  function drawArcAnimated(targetPercent, radius, color, lineWidth, duration = 1000) {
    let startTime = null;

    function animateArc(currentTime) {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentPercent = targetPercent * progress;

      const start = -Math.PI / 2;
      const end = start + currentPercent * 2 * Math.PI;

      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, radius, start, end);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();

      if (progress < 1) {
        arcAnimationFrame = requestAnimationFrame(animateArc);
      }
    }

    arcAnimationFrame = requestAnimationFrame(animateArc);
  }

  function updateClock() {
    const now = new Date();
    const totalLife = deathDate - birthdate;
    const remainingLife = deathDate - now;

    const lifeUsed = now - birthdate;
    let percentUsed = (lifeUsed / totalLife) * 100;
    percentUsed = Math.min(100, Math.max(0, percentUsed));

    document.getElementById("lifeBarFill").style.height = `${percentUsed}%`;
    document.getElementById("lifePercent").textContent = `${percentUsed.toFixed(2)}% used`;

    if (remainingLife <= 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#f00';
      ctx.font = '28px monospace';
      ctx.fillText("⏳ Time's up.", 160, 250);
      clearInterval(countdownInterval);
      countdownInterval = null;
      cancelAnimationFrame(arcAnimationFrame);
      arcAnimationFrame = null;
      button.textContent = "Start Clock";
      button.classList.remove("stop-active");
      return;
    }

    const totalSeconds = Math.floor(remainingLife / 1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const totalDays = Math.floor(totalSeconds / (3600 * 24));
    const years = Math.floor(totalDays / 365);
    const daysLeftInYear = totalDays % 365;
    const months = Math.floor(daysLeftInYear / 30);
    const days = daysLeftInYear % 30;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById("timeLeftText").innerHTML = `
      <span>${years} Years</span><br>
      <span>${months} Months</span><br>
      <span>${days} Days</span><br>
      <span>${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}</span>`;

    drawArcAnimated(seconds / 60, 230, '#f00', 10);
    drawArcAnimated(minutes / 60, 200, '#ff4444', 10);
    drawArcAnimated(hours / 24, 170, '#ff7777', 10);
    drawArcAnimated(days / 30, 140, '#ff9999', 10);
    drawArcAnimated(months / 12, 110, '#ffcccc', 10);
    drawArcAnimated((expectancy - years) / expectancy, 80, '#fff', 10);
  }

  updateClock();
  countdownInterval = setInterval(updateClock, 1000);
  const msg = document.getElementById("personalMessage");
msg.textContent = `This is all the time you’ve got, ${userName}. Turn it into legacy.`;
  button.textContent = "Stop Clock";
  button.classList.add("stop-active");
}

const quotes = [
  "“Lost time is never found again.” – Benjamin Franklin",
  "“The key is in not spending time, but in investing it.” – Stephen Covey",
  "“Time is what we want most, but what we use worst.” – William Penn",
  "“You may delay, but time will not.” – Benjamin Franklin",
  "“The future depends on what you do today.” – Mahatma Gandhi",
  "“Don't count the days, make the days count.” – Muhammad Ali",
  "“Ordinary people think merely of spending time. Great people think of using it.” – Arthur Schopenhauer",
  "“Your time is limited, so don’t waste it living someone else’s life.” – Steve Jobs",
  "“It's not that we have little time, but more that we waste a good deal of it.” – Seneca",
  "“Success is the sum of small efforts, repeated day in and day out.” – Robert Collier"
];

function startQuoteFeed() {
  const quoteEl = document.getElementById("quoteText");

  function changeQuote() {
    const random = Math.floor(Math.random() * quotes.length);
    quoteEl.style.opacity = 0;
    setTimeout(() => {
      quoteEl.textContent = quotes[random];
      quoteEl.style.opacity = 0.8;
    }, 500);
  }

  setInterval(changeQuote, 7000);
}

setTimeout(startQuoteFeed, 2500);

document.addEventListener("DOMContentLoaded", function () {
  const nameInput = document.getElementById("username");
  let nameAlertShown = false;

  nameInput.addEventListener("input", function () {
    if (nameInput.value.trim() !== "") {
      nameAlertShown = false;
    }
  });
});
