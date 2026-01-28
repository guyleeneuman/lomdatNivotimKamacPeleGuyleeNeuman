// ======== Initialize Game Function ========
function initGame() {
  // 1️⃣ איפוס כל הנתונים ב-sessionStorage
  sessionStorage.clear();

  // 2️⃣ איפוס משתנים גלובליים אם קיימים
  if (typeof currentSection !== "undefined") currentSection = 1;
  if (typeof q5CurrentSection !== "undefined") q5CurrentSection = 0;
  if (typeof timeLeft !== "undefined") timeLeft = 0;
  if (typeof timeLeftQ2 !== "undefined") timeLeftQ2 = 0;
  if (typeof timeLeftQ3 !== "undefined") timeLeftQ3 = 0;
  if (typeof timeLeftQ4 !== "undefined") timeLeftQ4 = 0;
  if (typeof timeLeftQ5 !== "undefined") timeLeftQ5 = 0;
  if (typeof timeLeftQ6 !== "undefined") timeLeftQ6 = 0;
  if (typeof timeLeftQ7 !== "undefined") timeLeftQ7 = 0;

  // 3️⃣ איפוס גרירות קוביות (Q6, Q51, Q7)
  if (typeof resetAllCubes === "function") resetAllCubes();
  if (typeof resetCubePosition === "function") {
    const allCubes = document.querySelectorAll('[class^="cube"]');
    allCubes.forEach(cube => resetCubePosition(cube));
  }
  if (typeof resetCubes === "function") resetCubes();

  // 4️⃣ מעבר לדף ההתחלתי
  window.location.href = "startPage.html";
}

// ======== אופציונלי: קריאה לפונקציה בלחיצה על כפתור "אתחול" ========
const resetBtn = document.getElementById("resetGameBtn");
if (resetBtn) {
  resetBtn.addEventListener("click", initGame);
}



// =====  Start Page (name + personal number + army details) =====
const nameInput = document.querySelector('.nameInput');
const numInput = document.getElementById('numInput');
const submitButton = document.getElementById('submitButton');

const classInput = document.querySelector('.miniInput3');   // כיתה
const platoonInput = document.querySelector('.miniInput1'); // מחלקה
const companyInput = document.querySelector('.miniInput2'); // פלוגה

if (submitButton) {
  submitButton.addEventListener('click', function () {
    const fullName = nameInput.value.trim();
    const personalNum = numInput.value.trim();
    const userClass = classInput.value.trim();
    const platoon = platoonInput.value.trim();
    const company = companyInput.value.trim();

    if (!fullName || !personalNum || !userClass || !platoon || !company) {
      alert("אנא מלא את כל השדות לפני המעבר");
      return;
    }

    sessionStorage.setItem('fullName', fullName);
    sessionStorage.setItem('personalNum', personalNum);
    sessionStorage.setItem('userClass', userClass);
    sessionStorage.setItem('platoon', platoon);
    sessionStorage.setItem('company', company);

    window.location.href = "instructions.html";
  });
}

// ===== Instructions Text Rotation =====
const instructionsTexts = [
  "שלום לכולם אני דני ובדיוק כמוכם עברתי את מבחני הכניסה לקמכ.",
  "עכשיו תעברו סדרת שאלות בנושא ניווטים.",
  "לכל שאלה יהיה זמן מוקצב וניתן לראות את הזמן שנשאר בטיימר משמאל למעלה.",
  "שימו לב! איכות עדיפה על כמות.",
  "חשוב שיהיו תשובות נכונות גם אם לא מלאות.",
  "אני מאמין בכם, זוהי תחילת דרככם בביסל\"ח על מנת שתהיו מפקדי כיתות א-ל-ו-פ-י-ם.",
  "בהצלחה ממני, דני."
];

const textDiv = document.querySelector(".text");
const startButton = document.querySelector(".button");
const overButton = document.querySelector(".over");

if (textDiv && startButton && overButton) {
  let currentIndex = 0;
  let textInterval = null;

  const startTextRotation = () => {
    // איפוס מצב
    currentIndex = 0;
    textDiv.textContent = instructionsTexts[currentIndex];

    startButton.style.display = "none";
    overButton.style.display = "none";

    // לעצור interval קודם אם קיים
    if (textInterval) clearInterval(textInterval);

    textInterval = setInterval(() => {
      currentIndex++;

      if (currentIndex < instructionsTexts.length) {
        textDiv.textContent = instructionsTexts[currentIndex];
      } else {
        clearInterval(textInterval);
        textInterval = null;

        startButton.style.display = "block";
        overButton.style.display = "block";
      }
    }, 5000);
  };

  // הרצה ראשונית בטעינת הדף
  startTextRotation();

  // לחיצה על "חזרה על הכל"
  overButton.addEventListener("click", startTextRotation);
}



// =====  Question Timer Q1=====
const timerElement = document.getElementById("timerQ1");

if (timerElement) {
  let timeLeft = 60; 

  const timerInterval = setInterval(() => {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    timerElement.textContent = `${minutes}:${seconds}`;

    if (timeLeft === 0) {
      clearInterval(timerInterval);
      goToNextQuestion();
    }

    timeLeft--;
  }, 1000);
}

function goToNextQuestion() {
  window.location.href = "q2.html"; // השאלה הבאה
}

// ===== Q1 Answer Saving =====
const q1Radios = document.querySelectorAll('input[name="q1"]');

if (q1Radios.length > 0) {
  q1Radios.forEach(radio => {
    radio.addEventListener('change', () => {
      const selectedValue = radio.value;
      const correctAnswer = "3";

      const isCorrect = selectedValue === correctAnswer;

      // Save data
      sessionStorage.setItem('q1Answer', selectedValue);
      sessionStorage.setItem('q1IsCorrect', isCorrect);

      console.log("Q1 selected:", selectedValue);
      console.log("Is correct:", isCorrect);
    });
  });
}
function calcQ1Score() {
  const maxScore = 5;
  let score = 0;

  const isCorrect = sessionStorage.getItem("q1IsCorrect");

  // אם לא ענה או ענה לא נכון – 0 נקודות
  if (isCorrect === "true") {
    score = maxScore;
  }

  return {
    score,
    maxScore
  };
}


// ===== Q2 Answer Saving =====
const q2Answers = {
  answer1: ["360", "0"],   // שתי תשובות נכונות
  answer2: "מערב",
  answer3: "דרום",
  answer4: "180"
};

// בוחרים את השדות
const answer1Input = document.querySelector('.answer1Input');
const answer2Input = document.querySelector('.answer2Input');
const answer3Input = document.querySelector('.answer3Input');
const answer4Input = document.querySelector('.answer4Input');

if (answer1Input && answer2Input && answer3Input && answer4Input) {

  const saveQ2Answers = () => {
    const a1 = answer1Input.value.trim();
    const a2 = answer2Input.value.trim();
    const a3 = answer3Input.value.trim();
    const a4 = answer4Input.value.trim();

    const answersData = {
      answer1: {
        value: a1,
        isCorrect: q2Answers.answer1.includes(a1)
      },
      answer2: {
        value: a2,
        isCorrect: a2 === q2Answers.answer2
      },
      answer3: {
        value: a3,
        isCorrect: a3 === q2Answers.answer3
      },
      answer4: {
        value: a4,
        isCorrect: a4 === q2Answers.answer4
      }
    };

    sessionStorage.setItem('q2Answers', JSON.stringify(answersData));
  };

  [answer1Input, answer2Input, answer3Input, answer4Input].forEach(input => {
    input.addEventListener('blur', saveQ2Answers);
  });
}
function calcQ2Score() {
  const maxScore = 10; // סך הניקוד של השאלה
  const perSection = 2.5; // כל סעיף
  let score = 0;

  // נשלוף את הנתונים מה-sessionStorage
  const stored = sessionStorage.getItem("q2Answers");
  if (!stored) {
    // אם לא ענו בכלל → 0 נקודות
    return { score: 0, maxScore };
  }

  const answers = JSON.parse(stored);

  // סכימת נקודות לפי סעיפים
  if (answers.answer1 && answers.answer1.isCorrect) score += perSection;
  if (answers.answer2 && answers.answer2.isCorrect) score += perSection;
  if (answers.answer3 && answers.answer3.isCorrect) score += perSection;
  if (answers.answer4 && answers.answer4.isCorrect) score += perSection;

  return { score, maxScore };
}

// =====  Question Timer Q2 =====
const timerElementQ2 = document.getElementById("timerQ2");

if (timerElementQ2) {
  let timeLeftQ2 = 90; 

  const timerIntervalQ2 = setInterval(() => {
    let minutes = Math.floor(timeLeftQ2 / 60);
    let seconds = timeLeftQ2 % 60;

    // הוספת אפס מוביל
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    timerElementQ2.textContent = `${minutes}:${seconds}`;

    if (timeLeftQ2 === 0) {
      clearInterval(timerIntervalQ2);
      goToNextQuestionQ2();
    }

    timeLeftQ2--;
  }, 1000);
}

// פונקציה למעבר אוטומטי לעמוד הבא
function goToNextQuestionQ2() {
  // לפני המעבר אפשר לשמור את התשובות הפעם סופית
  if (typeof saveQ2Answers === "function") {
    saveQ2Answers();
  }

  window.location.href = "q3.html"; // העמוד הבא
}
// ===== Q3 Answer Saving =====
const q3Radios = document.querySelectorAll('input[name="q1"]'); // אם ב-q3 גם זה name="q1"

if (q3Radios.length > 0) {
  q3Radios.forEach(radio => {
    radio.addEventListener('change', () => {
      const selectedValue = radio.value;
      const correctAnswer = "1"; // תשובה נכונה

      const isCorrect = selectedValue === correctAnswer;

      // שמירה ב-sessionStorage תחת Q3
      sessionStorage.setItem('q3Answer', selectedValue);
      sessionStorage.setItem('q3IsCorrect', isCorrect);

      console.log("Q3 selected:", selectedValue);
      console.log("Is correct:", isCorrect);
    });
  });
}
function calcQ3Score() {
  const maxScore = 5; // סך הנקודות של שאלה 3
  let score = 0;

  const storedIsCorrect = sessionStorage.getItem("q3IsCorrect");

  if (storedIsCorrect === "true") {
    score = maxScore;
  } else {
    score = 0; // אם לא ענו או לא נכון
  }

  return { score, maxScore };
}


// =====  Question Timer Q3 =====
const timerElementQ3 = document.getElementById("timerQ3");

if (timerElementQ3) {
  let timeLeftQ3 = 60; 

  const timerIntervalQ3 = setInterval(() => {
    let minutes = Math.floor(timeLeftQ3 / 60);
    let seconds = timeLeftQ3 % 60;

    // הוספת אפס מוביל
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    timerElementQ3.textContent = `${minutes}:${seconds}`;

    if (timeLeftQ3 === 0) {
      clearInterval(timerIntervalQ3);
      goToNextQuestionQ3();
    }

    timeLeftQ3--;
  }, 1000);
}

// פונקציה למעבר אוטומטי לעמוד הבא
function goToNextQuestionQ3() {
  window.location.href = "q4.html"; // העמוד הבא
}
// =====  Question Timer Q4 =====
const timerElementQ4 = document.getElementById("timerQ4");

if (timerElementQ4) {
  let timeLeftQ4 = 60; 

  const timerIntervalQ4 = setInterval(() => {
    let minutes = Math.floor(timeLeftQ4 / 60);
    let seconds = timeLeftQ4 % 60;

    // הוספת אפס מוביל
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    timerElementQ4.textContent = `${minutes}:${seconds}`;

    if (timeLeftQ4 === 0) {
      clearInterval(timerIntervalQ4);
      goToNextQuestionQ4();
    }

    timeLeftQ4--;
  }, 1000);
}

// פונקציה למעבר אוטומטי לעמוד הבא
function goToNextQuestionQ4() {
  window.location.href = "q5.html"; // העמוד הבא
}
// ===== Q4 Answer Saving =====
const q4Radios = document.querySelectorAll('input[name="q1"]'); // אם ב-q4 גם name="q1"

if (q4Radios.length > 0) {
  q4Radios.forEach(radio => {
    radio.addEventListener('change', () => {
      const selectedValue = radio.value;
      const correctAnswer = "3"; // תשובה נכונה

      const isCorrect = selectedValue === correctAnswer;

      // שמירה ב-sessionStorage תחת Q4
      sessionStorage.setItem('q4Answer', selectedValue);
      sessionStorage.setItem('q4IsCorrect', isCorrect);

      console.log("Q4 selected:", selectedValue);
      console.log("Is correct:", isCorrect);
    });
  });
}
function calcQ4Score() {
  const maxScore = 5; // סך הנקודות של שאלה 4
  let score = 0;

  const storedIsCorrect = sessionStorage.getItem("q4IsCorrect");

  if (storedIsCorrect === "true") {
    score = maxScore;
  } else {
    score = 0; // אם לא ענו או ענו לא נכון
  }

  return { score, maxScore };
}


// =====  Question Timer Q5 =====
const timerElementQ5 = document.getElementById("timerQ5");

if (timerElementQ5) {
  let timeLeftQ5 = 420; 

  const timerIntervalQ5 = setInterval(() => {
    let minutes = Math.floor(timeLeftQ5 / 60);
    let seconds = timeLeftQ5 % 60;

    // הוספת אפס מוביל
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    timerElementQ5.textContent = `${minutes}:${seconds}`;

    if (timeLeftQ5 === 0) {
      clearInterval(timerIntervalQ5);
      goToNextQuestionQ5();
    }

    timeLeftQ5--;
  }, 1000);
}
// פונקציה למעבר אוטומטי לעמוד הבא
function goToNextQuestionQ5() {
  window.location.href = "q6.html"; // העמוד הבא
}

// =====  Question Timer Q6 =====
const timerElementQ6 = document.getElementById("timerQ6");

if (timerElementQ6) {
  let timeLeftQ6 = 150; 

  const timerIntervalQ6 = setInterval(() => {
    let minutes = Math.floor(timeLeftQ6 / 60);
    let seconds = timeLeftQ6 % 60;

    // הוספת אפס מוביל
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    timerElementQ6.textContent = `${minutes}:${seconds}`;

    if (timeLeftQ6 === 0) {
      clearInterval(timerIntervalQ6);
      goToNextQuestionQ6();
    }

    timeLeftQ6--;
  }, 1000);
}
// פונקציה למעבר אוטומטי לעמוד הבא
function goToNextQuestionQ6() {
  window.location.href = "q7.html"; // העמוד הבא
}

// =====  Question Timer Q7 =====
const timerElementQ7 = document.getElementById("timerQ7");

if (timerElementQ7) {
  let timeLeftQ7 = 300; 

  const timerIntervalQ7 = setInterval(() => {
    let minutes = Math.floor(timeLeftQ7 / 60);
    let seconds = timeLeftQ7% 60;

    // הוספת אפס מוביל
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    timerElementQ7.textContent = `${minutes}:${seconds}`;

    if (timeLeftQ7 === 0) {
      clearInterval(timerIntervalQ7);
      goToNextQuestionQ7();
    }

    timeLeftQ7--;
  }, 1000);
}
// פונקציה למעבר אוטומטי לעמוד הבא
function goToNextQuestionQ7() {
  window.location.href = "result.html"; // העמוד הבא
}

// ===== Q6 Drag & Drop Logic =====
const cubeTags = document.querySelectorAll('[class^="cubeTag"]');
const textBlobs = document.querySelectorAll('[class^="textBlob"]');

let draggedCube = null;

// שמירת מיקומים התחלתיים
const initialPositions = new Map();
cubeTags.forEach(cube => {
  initialPositions.set(cube, {
    left: cube.style.left,
    top: cube.style.top
  });
});

// מי יושב על איזה blob
const blobOccupancy = {};

// התחלת גרירה
cubeTags.forEach(cube => {
  const cubeNum = parseInt(cube.className.replace("cubeTag", ""));

  // cubeTag5 ו-cubeTag6 לא ניתנים לגרירה
  if (cubeNum === 5 || cubeNum === 6) return;

  cube.setAttribute("draggable", true);

  cube.addEventListener("dragstart", () => {
    draggedCube = cube;
  });
});

// מאפשרים זריקה על textBlob + החלפה חכמה
textBlobs.forEach(blob => {
  blob.addEventListener("dragover", e => e.preventDefault());

  blob.addEventListener("drop", () => {
    if (!draggedCube) return;

    const blobName = blob.className;

    // אם יש קובייה אחרת על ה־blob – מחזירים אותה למקום
    if (blobOccupancy[blobName] && blobOccupancy[blobName] !== draggedCube) {
      const prevCube = blobOccupancy[blobName];
      returnCubeToStart(prevCube);
      prevCube.dataset.attachedTo = "";
    }

    // אם הקובייה נשלפה מ־blob אחר – מנקים משם
    if (draggedCube.dataset.attachedTo) {
      blobOccupancy[draggedCube.dataset.attachedTo] = null;
    }

    // מצמידים למרכז ה־blob
    const blobRect = blob.getBoundingClientRect();
    draggedCube.style.left = blobRect.left + blobRect.width / 2 - draggedCube.offsetWidth / 2 + "px";
    draggedCube.style.top = blobRect.top + blobRect.height / 2 - draggedCube.offsetHeight / 2 + "px";

    draggedCube.dataset.attachedTo = blobName;
    blobOccupancy[blobName] = draggedCube;

    saveQ6State();
  });
});

// החזרת קובייה למקום המקורי
function returnCubeToStart(cube) {
  const cubeNum = parseInt(cube.className.replace("cubeTag", ""));
  
  // cubeTag5 ו-cubeTag6 נשארים במקומם
  if (cubeNum === 5 || cubeNum === 6) return;

  const pos = initialPositions.get(cube);
  cube.style.left = pos.left;
  cube.style.top = pos.top;
}

// ===== שמירת מצב Q6 =====
function saveQ6State() {
  const result = [];

  cubeTags.forEach(cube => {
    if (cube.dataset.attachedTo) {
      const cubeNum = parseInt(cube.className.replace("cubeTag", ""));
      const isCorrect = cubeNum >= 1 && cubeNum <= 8;

      result.push({
        cube: cube.className,
        attachedTo: cube.dataset.attachedTo,
        isCorrect: isCorrect
      });
    }
  });

  sessionStorage.setItem("q6Results", JSON.stringify(result));
  console.log("Q6 saved:", result);
}
// ===== חישוב ניקוד Q6 =====
function calcQ6Score() {
  const maxScore = 5; // סך הנקודות של Q6
  let score = 0;

  const results = JSON.parse(sessionStorage.getItem("q6Results")) || [];

  results.forEach(item => {
    const cubeNum = parseInt(item.cube.replace("cubeTag", ""));

    // קוביות 5 ו-6 לא נספרות
    if (cubeNum === 5 || cubeNum === 6) return;

    // אם הקובייה נמצאת על אחד ה־blobs הנכונים – נותנים נקודה
    const validBlobs = ["textBlob1", "textBlob2", "textBlob3", "textBlob4", "textBlob5"];
    if (validBlobs.includes(item.attachedTo)) {
      score += 1;
    }
  });

  return { score, maxScore };
}

// ===== Zoom In / Out =====
// ===== Zoom In / Out Q5 =====
const zoomBtn = document.getElementById("zoomBtn");
const zoomContainer = document.getElementById("zoomContainer");

let isZoomed = false;

if (zoomBtn && zoomContainer) {
  zoomBtn.addEventListener("click", () => {
    isZoomed = !isZoomed;
    zoomContainer.classList.toggle("zoomed");
  });
}

// ===== Drag Qoardinatot Q5(mouse + touch) =====
const qoardinatot = document.getElementById("qoardinatot");

let isDragging = false;
let startX, startY, imgX = 0, imgY = 0;

if (qoardinatot) {
  qoardinatot.style.position = "absolute";

  const startDrag = (x, y) => {
    isDragging = true;
    startX = x - imgX;
    startY = y - imgY;
  };

  const moveDrag = (x, y) => {
    if (!isDragging) return;
    imgX = x - startX;
    imgY = y - startY;
    qoardinatot.style.left = imgX + "px";
    qoardinatot.style.top = imgY + "px";
  };

  const stopDrag = () => {
    isDragging = false;
  };

  // עכבר
  qoardinatot.addEventListener("mousedown", e => {
    startDrag(e.clientX, e.clientY);
  });

  document.addEventListener("mousemove", e => {
    moveDrag(e.clientX, e.clientY);
  });

  document.addEventListener("mouseup", stopDrag);

  // מגע (מובייל)
  qoardinatot.addEventListener("touchstart", e => {
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  });

  document.addEventListener("touchmove", e => {
    const touch = e.touches[0];
    moveDrag(touch.clientX, touch.clientY);
  });

  document.addEventListener("touchend", stopDrag);
}
// ===== Main Q5 & Q51 Logic =====
document.addEventListener("DOMContentLoaded", () => {

 // =======================
  // ======== Q5 ==========
  // =======================
  const q5TazaImg = document.querySelector(".taza");
  const q5AnswerInputs = [
    document.querySelector(".answerAInput"),
    document.querySelector(".answerBInput"),
    document.querySelector(".answerCInput")
  ];
  const q5NextBtn = document.querySelector(".nextQ5");
  const timerElementQ5 = document.getElementById("timerQ5");

  // ===== סעיפים Q5 =====
  const q5Sections = [
    {
      taza: "assets/elements/taza1.png",
      answers: [
        { min: 230, max: 240 },
        { min: 340, max: 390 },
        { special: [ { first3: "694", min:48, max:68 }, { first3:"442", min:61, max:81 } ] }
      ]
    },
    {
      taza: "assets/elements/taza2.png",
      answers: [
        { min: 100, max: 110 },
        { min: 700, max: 750 },
        { special: [ { first3: "694", min:28, max:48 }, { first3:"441", min:52, max:72 } ] }
      ]
    },
    {
      taza: "assets/elements/taza3.png",
      answers: [
        { min: 80, max: 90 },
        { min: 2100, max: 2300 },
        { special: [ { first3: "695", min:29, max:49 }, { first3:"442", min:2, max:22 } ] }
      ]
    },
    {
      taza: "assets/elements/taza4.png",
      answers: [
        { min: 280, max: 290 },
        { min: 550, max: 600 },
        { special: [ { first3: "692", min:45, max:65 }, { first3:"441", min:2, max:22 } ] }
      ]
    }
  ];

  let q5CurrentSection = 0;

  // ===== שמירת תשובות =====
  function saveQ5Answers() {
    const answersData = {};
    const section = q5Sections[q5CurrentSection];

    q5AnswerInputs.forEach((input, i) => {
      const value = input.value.trim();
      let isCorrect = false;
      const check = section.answers[i];

      if (check.special) {
        for (const sp of check.special) {
          if (value.startsWith(sp.first3)) {
            const num = parseInt(value.slice(3),10);
            if (!isNaN(num) && num >= sp.min && num <= sp.max) isCorrect = true;
          }
        }
      } else {
        const num = parseInt(value,10);
        if (!isNaN(num) && num >= check.min && num <= check.max) isCorrect = true;
      }

      answersData[`answer${i+1}`] = { value, isCorrect };
    });

    sessionStorage.setItem(`q5AnswersSection${q5CurrentSection+1}`, JSON.stringify(answersData));
  }

  q5AnswerInputs.forEach(input => input.addEventListener("input", saveQ5Answers));

  // ===== טעינת סעיף =====
  function loadQ5Section(index) {
    const section = q5Sections[index];
    if (q5TazaImg) q5TazaImg.src = section.taza;
    q5AnswerInputs.forEach(input => input.value = "");
  }

  loadQ5Section(q5CurrentSection);

  // ===== כפתור הבא =====
  if (q5NextBtn) {
    q5NextBtn.addEventListener("click", () => {
      saveQ5Answers();
      q5CurrentSection++;
      if (q5CurrentSection < q5Sections.length) {
        loadQ5Section(q5CurrentSection);
      } else {
        window.location.href = "q51.html"; // מעבר ל-Q51
      }
    
    });
  }

  // ===== טיימר Q5 =====
  if (timerElementQ5) {
    let timeLeft = 300; // 5 דקות
    const timerInterval = setInterval(() => {
      let m = Math.floor(timeLeft/60).toString().padStart(2,"0");
      let s = (timeLeft%60).toString().padStart(2,"0");
      timerElementQ5.textContent = `${m}:${s}`;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        window.location.href = "q51.html";
      }
      timeLeft--;
    },1000);
  }
})
// ===== חישוב ניקוד Q5 =====
function calcQ5Score() {
  const pointsPerAnswer = 2;
  const totalSections = 4; // 4 סעיפים
  const answersPerSection = 3; // 3 תשובות בכל סעיף
  const maxScore = totalSections * answersPerSection * pointsPerAnswer;

  let score = 0;

  for (let sectionIndex = 0; sectionIndex < totalSections; sectionIndex++) {
    const sectionData = JSON.parse(sessionStorage.getItem(`q5AnswersSection${sectionIndex + 1}`)) || {};
    for (let i = 1; i <= answersPerSection; i++) {
      const ans = sectionData[`answer${i}`];
      if (ans && ans.isCorrect) {
        score += pointsPerAnswer;
      }
    }
  }

  return { score, maxScore };
}
// פונקציה למעבר אוטומטי לעמוד הבא
function goToNextQuestionQ51() {
  window.location.href = "q6.html"; // העמוד הבא
} 
// =======================
// ======== Q51 =========
// =======================

document.addEventListener("DOMContentLoaded", () => {
  const cubes = document.querySelectorAll(".cube1, .cube2, .cube3, .cube4, .cube5, .cube6, .cube7, .cube8, .cube9");
  const textBlob7 = document.querySelector(".textBlob7");
  const textBlob8 = document.querySelector(".textBlob8");
  const tazaImg = document.querySelector(".taza");
  const nextQ = document.querySelector(".nextQ");

  const correctAnswersBlob7 = ["cube1", "cube3", "cube5"];
  const correctAnswersBlob8 = ["cube2", "cube4", "cube6"];

  let draggedCube = null;
  let offsetX = 0;
  let offsetY = 0;
  let currentSection = 1;

  // מיקום התחלתי של כל קוביה
  const initialPositions = {};
  cubes.forEach(cube => {
    const rect = cube.getBoundingClientRect();
    initialPositions[cube.className] = { left: rect.left, top: rect.top };
    cube.style.position = "absolute";
  });

  function resetAllCubes() {
    cubes.forEach(cube => {
      const pos = initialPositions[cube.className];
      cube.style.left = pos.left + "px";
      cube.style.top = pos.top + "px";
      cube.style.cursor = "grab";
      cube.style.zIndex = 2000;
    });
    textBlob7.textContent = "";
    textBlob8.textContent = "";
  }

  function isOverlapping(cube, blob) {
    const cubeRect = cube.getBoundingClientRect();
    const blobRect = blob.getBoundingClientRect();
    return !(
      cubeRect.right < blobRect.left ||
      cubeRect.left > blobRect.right ||
      cubeRect.bottom < blobRect.top ||
      cubeRect.top > blobRect.bottom
    );
  }

  function handleDrop(cube, blob) {
    const cubeClass = cube.classList[0];
    // מציג את הקוביה על ה-blob
    blob.textContent = cube.textContent;

    // מרכז את הקוביה ב-blob
    const blobRect = blob.getBoundingClientRect();
    const cubeRect = cube.getBoundingClientRect();
    cube.style.left = blobRect.left + (blobRect.width - cubeRect.width)/2 + "px";
    cube.style.top = blobRect.top + (blobRect.height - cubeRect.height)/2 + "px";
    cube.style.cursor = "default";
    cube.style.zIndex = 5000;

    // שומר נכונה/לא נכונה ב-sessionStorage
    let isCorrect = false;
    if ((blob === textBlob7 && correctAnswersBlob7.includes(cubeClass)) ||
        (blob === textBlob8 && correctAnswersBlob8.includes(cubeClass))) {
      isCorrect = true;
    }
    sessionStorage.setItem(blob.className, JSON.stringify({ answer: cube.textContent, correct: isCorrect }));
  }

  function resetCubePosition(cube) {
    const pos = initialPositions[cube.className];
    cube.style.left = pos.left + "px";
    cube.style.top = pos.top + "px";
    cube.style.cursor = "grab";
    cube.style.zIndex = 2000;
  }

  function changeTaza(sectionNumber) {
    tazaImg.src = `assets/elements/taza${sectionNumber}.png`;
  }

  // ====== אירועי גרירה ======
  cubes.forEach(cube => {
    const startDrag = (e) => {
      e.preventDefault();
      draggedCube = cube;
      const rect = cube.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      offsetX = clientX - rect.left;
      offsetY = clientY - rect.top;
      cube.style.zIndex = 10000;
    };

    cube.addEventListener("mousedown", startDrag);
    cube.addEventListener("touchstart", startDrag);

    const onDrag = (e) => {
      if (!draggedCube) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      draggedCube.style.left = (clientX - offsetX) + "px";
      draggedCube.style.top = (clientY - offsetY) + "px";
    };

    document.addEventListener("mousemove", onDrag);
    document.addEventListener("touchmove", onDrag, { passive: false });

    const endDrag = () => {
      if (!draggedCube) return;

      if (isOverlapping(draggedCube, textBlob7)) {
        handleDrop(draggedCube, textBlob7);
      } else if (isOverlapping(draggedCube, textBlob8)) {
        handleDrop(draggedCube, textBlob8);
      } else {
        resetCubePosition(draggedCube);
      }

      draggedCube = null;
    };

    document.addEventListener("mouseup", endDrag);
    document.addEventListener("touchend", endDrag);
  });

  // ====== nextQ ======
  if (nextQ) {
    nextQ.addEventListener("click", () => {
      // אם זה הסעיף האחרון (סעיף 4) – שינוי תמונת הכפתור והעברה ל-q6
      if (currentSection === 4) {
        nextQ.src = "assets/buttons/toNextQ.png";
        window.location.href = "q6.html";
        return;
      }

      currentSection++;
      changeTaza(currentSection);
      resetAllCubes();
    });
  }

  // ====== טעינת תשובות מה-sessionStorage ======
  function loadAnswers() {
    const blobs = [textBlob7, textBlob8];
    blobs.forEach(blob => {
      const data = sessionStorage.getItem(blob.className);
      if (data) {
        const parsed = JSON.parse(data);
        blob.textContent = parsed.answer;
      }
    });
  }

  // =====  Question Timer Q51 =====
const timerElementQ51 = document.getElementById("timerQ51");

if (timerElementQ51) {
  let timeLeftQ51 = 120; 

  const timerIntervalQ51 = setInterval(() => {
    let minutes = Math.floor(timeLeftQ51 / 60);
    let seconds = timeLeftQ51% 60;

    // הוספת אפס מוביל
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    timerElementQ51.textContent = `${minutes}:${seconds}`;

    if (timeLeftQ51 === 0) {
      clearInterval(timerIntervalQ51);
      goToNextQuestionQ51();
    }

    timeLeftQ51--;
  }, 1000);
}
// 

  loadAnswers();
  changeTaza(currentSection);
});
// ===== חישוב ניקוד Q51 =====
function calcQ51Score() {
  const pointsPerCorrectDrag = 2;
  const totalSections = 4; // 4 סעיפים
  const maxScore = totalSections * pointsPerCorrectDrag * 2; // 2 גרירות נכונות לכל סעיף

  let score = 0;

  // גרירות על textBlob7
  const blob7Data = JSON.parse(sessionStorage.getItem("textBlob7")) || {};
  if (blob7Data.correct) score += pointsPerCorrectDrag;

  // גרירות על textBlob8
  const blob8Data = JSON.parse(sessionStorage.getItem("textBlob8")) || {};
  if (blob8Data.correct) score += pointsPerCorrectDrag;

  return { score, maxScore };
}
// =======================
// ======== Q7 =========
// =======================

(() => {
  // 🚨 אם אנחנו לא בעמוד Q7 – יוצאים
  if (!document.getElementById("timerQ7")) return;
  // ---------- CONFIG ----------
  const totalSteps = 10;

  const correctAnswers = {
    c1: "cubeT1",
    c2: "cubeT2",
    c3: "cubeT3",
    c4: "cubeT4",
    c5: "cubeT5",
    c6: "cubeT6",
    c7: "cubeT7",
    c8: "cubeT2",
    c9: "cubeT8",
    c10: "cubeT2"
  };

  let currentStep = 1;
  let draggedCube = null;
  let lastDroppedCubeId = null;

  // ---------- ELEMENTS ----------
  const cubes = document.querySelectorAll("[class^='cubeT']");
  const circles = document.querySelectorAll(".circle-outline");
  const nextBtn = document.querySelector(".nextQ7");

  // Save original positions for reset
  const originalPositions = {};
  cubes.forEach(cube => {
    originalPositions[cube.classList[0]] = {
      top: cube.style.top,
      left: cube.style.left
    };
  });

// ---------- DRAG LOGIC פשוט לשינוי בחירה ----------
cubes.forEach(cube => {
  cube.draggable = true;

  cube.addEventListener("dragstart", () => {
    draggedCube = cube;

    // מחזירים את הקובייה למקום המקורי בכל גרירה חדשה
    const key = draggedCube.classList[0];
    draggedCube.style.left = originalPositions[key].left;
    draggedCube.style.top = originalPositions[key].top;
    draggedCube.style.zIndex = 10000;
  });
});

circles.forEach(circle => {
  circle.addEventListener("dragover", e => e.preventDefault());

  circle.addEventListener("drop", () => {
    if (!draggedCube) return;

    const rect = circle.getBoundingClientRect();
    draggedCube.style.position = "absolute";
    draggedCube.style.left = rect.left + "px";
    draggedCube.style.top = rect.top + "px";

    // נשמור את הבחירה האחרונה
    lastDroppedCubeId = draggedCube.classList[0];
  });
});

  // ---------- STEP LOGIC ----------
 function highlightCurrentCircle() {
  circles.forEach(circle => {
    circle.style.display = "none";     // מסתירים את כולם
    circle.style.borderColor = "#FFEBCD";
    circle.style.background = "transparent"; // נשאר חלול
  });

  const activeCircle = document.getElementById(`c${currentStep}`);
  if (activeCircle) {
    activeCircle.style.display = "block"; // מציגים רק את הרלוונטי
  }
}

  function resetCubes() {
    cubes.forEach(cube => {
      const key = cube.classList[0];
      cube.style.top = originalPositions[key].top;
      cube.style.left = originalPositions[key].left;
    });

    lastDroppedCubeId = null;
  }

  function saveStepResult() {
    const circleId = `c${currentStep}`;
    const correctCube = correctAnswers[circleId];

    const isCorrect = lastDroppedCubeId === correctCube;

    sessionStorage.setItem(
      `Q7_step_${currentStep}`,
      JSON.stringify({
        circle: circleId,
        chosen: lastDroppedCubeId,
        correct: isCorrect
      })
    );
  }
// ---------- NEXT BUTTON SAFE ----------
const cleanNextBtn = nextBtn.cloneNode(true);
nextBtn.parentNode.replaceChild(cleanNextBtn, nextBtn);

  // ---------- NEXT BUTTON ----------
cleanNextBtn.addEventListener("click", () => {
  saveStepResult();

  if (currentStep === totalSteps) {
    window.location.href = "result.html";
    return;
  }

  if (currentStep === totalSteps - 1) {
    cleanNextBtn.src = "assets/buttons/checkWrongBtn.png";
  }

  currentStep++;
  resetCubes();
  highlightCurrentCircle();
});


  // ---------- INIT ----------
  highlightCurrentCircle();

})();
// ===== חישוב ניקוד Q7 =====
function calcQ7Score() {
  const pointsPerCorrectDrag = 3;
  const totalSteps = 10;
  let score = 0;

  for (let step = 1; step <= totalSteps; step++) {
    const stepData = JSON.parse(sessionStorage.getItem(`Q7_step_${step}`));
    if (stepData && stepData.correct) {
      score += pointsPerCorrectDrag;
    }
  }

  const maxScore = pointsPerCorrectDrag * totalSteps;
  return { score, maxScore };
}

// ===== Results Page – Show Personal Info =====
const personalInfoDiv = document.querySelector('.personalInfo');

if (personalInfoDiv) {
  const fullName = sessionStorage.getItem('fullName');
  const personalNum = sessionStorage.getItem('personalNum');
  const userClass = sessionStorage.getItem('userClass');
  const platoon = sessionStorage.getItem('platoon');
  const company = sessionStorage.getItem('company');

  if (fullName && personalNum && userClass && platoon && company) {
    personalInfoDiv.innerHTML = `
      <div>${fullName}</div>
      <div>מס' אישי: ${personalNum}</div>
      <div>כיתה: ${userClass}</div>
      <div>מחלקה: ${platoon}</div>
      <div>פלוגה: ${company}</div>
    `;
  } else {
    personalInfoDiv.textContent = "פרטים אישיים לא זמינים";
  }
}
// ===== Results Page – Show Scores =====
const scoreDiv = document.querySelector('.scoreInfo');

if (scoreDiv) {
  // ===== פונקציות חישוב – אם לא קיימות כבר ניתן להוסיף כאן או לייבא מהJS הקודם =====
  function calcQ1Score() {
    const selected = sessionStorage.getItem('q1Answer');
    const isCorrect = sessionStorage.getItem('q1IsCorrect') === "true";
    return { score: isCorrect ? 5 : 0, maxScore: 5 };
  }

  function calcQ2Score() {
    const data = JSON.parse(sessionStorage.getItem('q2Answers')) || {};
    let score = 0;
    const pointsPerAnswer = 2.5;
    Object.keys(data).forEach(key => {
      if (data[key].isCorrect) score += pointsPerAnswer;
    });
    return { score, maxScore: 10 };
  }

  function calcQ3Score() {
    const isCorrect = sessionStorage.getItem('q3IsCorrect') === "true";
    return { score: isCorrect ? 5 : 0, maxScore: 5 };
  }

  function calcQ4Score() {
    const isCorrect = sessionStorage.getItem('q4IsCorrect') === "true";
    return { score: isCorrect ? 5 : 0, maxScore: 5 };
  }

  function calcQ5Score() {
    let score = 0;
    let maxScore = 32 + 8; // חלק 1 + חלק 2
    // ===== חלק 1 =====
    for (let i = 1; i <= 4; i++) {
      const sectionData = JSON.parse(sessionStorage.getItem(`q5AnswersSection${i}`)) || {};
      Object.values(sectionData).forEach(ans => {
        if (ans.isCorrect) score += 2;
      });
    }
    // ===== חלק 2 =====
    const blobs = ['textBlob7','textBlob8'];
    blobs.forEach(blob => {
      const data = JSON.parse(sessionStorage.getItem(blob));
      if (data && data.correct) score += 2;
    });
    return { score, maxScore };
  }

  function calcQ6Score() {
    const results = JSON.parse(sessionStorage.getItem("q6Results")) || [];
    let score = 0;
    const validBlobs = ["textBlob1","textBlob2","textBlob3","textBlob4","textBlob5"];
    results.forEach(item => {
      const cubeNum = parseInt(item.cube.replace("cubeTag",""));
      if (cubeNum === 5 || cubeNum === 6) return;
      if (validBlobs.includes(item.attachedTo)) score += 1;
    });
    return { score, maxScore: 5 };
  }

  function calcQ7Score() {
    let score = 0;
    const pointsPerCorrect = 3;
    for (let i = 1; i <= 10; i++) {
      const stepData = JSON.parse(sessionStorage.getItem(`Q7_step_${i}`));
      if (stepData && stepData.correct) score += pointsPerCorrect;
    }
    return { score, maxScore: 30 };
  }

  // ===== חיבור כל השאלות =====
  const allScores = [
    calcQ1Score(),
    calcQ2Score(),
    calcQ3Score(),
    calcQ4Score(),
    calcQ5Score(),
    calcQ6Score(),
    calcQ7Score()
  ];

  const totalScore = allScores.reduce((acc, val) => acc + val.score, 0);
  const totalMaxScore = allScores.reduce((acc, val) => acc + val.maxScore, 0);


  // ===== הצגה – רק מספר כולל =====
  scoreDiv.textContent = totalScore;
}
// ===== Results Page – Show Scores Per Question (resultInfo.html) =====

// ===== פונקציות חישוב נקודות לכל שאלה =====
function calcQ1Score() {
  const isCorrect = sessionStorage.getItem('q1IsCorrect') === "true";
  return { score: isCorrect ? 5 : 0, maxScore: 5 };
}

function calcQ2Score() {
  const data = JSON.parse(sessionStorage.getItem('q2Answers')) || {};
  let score = 0;
  const pointsPerAnswer = 2.5;
  Object.values(data).forEach(ans => {
    if (ans.isCorrect) score += pointsPerAnswer;
  });
  return { score, maxScore: 10 };
}

function calcQ3Score() {
  const isCorrect = sessionStorage.getItem('q3IsCorrect') === "true";
  return { score: isCorrect ? 5 : 0, maxScore: 5 };
}

function calcQ4Score() {
  const isCorrect = sessionStorage.getItem('q4IsCorrect') === "true";
  return { score: isCorrect ? 5 : 0, maxScore: 5 };
}

function calcQ5Score() {
  let score = 0;
  const maxScore = 40; // 32 חלק 1 + 8 חלק 2

  // חלק 1
  for (let i = 1; i <= 4; i++) {
    const sectionData = JSON.parse(sessionStorage.getItem(`q5AnswersSection${i}`)) || {};
    Object.values(sectionData).forEach(ans => {
      if (ans.isCorrect) score += 2;
    });
  }

  // חלק 2
  ['textBlob7','textBlob8'].forEach(blob => {
    const data = JSON.parse(sessionStorage.getItem(blob));
    if (data && data.correct) score += 2;
  });

  return { score, maxScore };
}

function calcQ6Score() {
  const results = JSON.parse(sessionStorage.getItem("q6Results")) || [];
  let score = 0;
  const validBlobs = ["textBlob1","textBlob2","textBlob3","textBlob4","textBlob5"];
  results.forEach(item => {
    const cubeNum = parseInt(item.cube.replace("cubeTag",""));
    if (cubeNum === 5 || cubeNum === 6) return;
    if (validBlobs.includes(item.attachedTo)) score += 1;
  });
  return { score, maxScore: 5 };
}

function calcQ7Score() {
  let score = 0;
  const pointsPerCorrect = 3;
  for (let i = 1; i <= 10; i++) {
    const stepData = JSON.parse(sessionStorage.getItem(`Q7_step_${i}`));
    if (stepData && stepData.correct) score += pointsPerCorrect;
  }
  return { score, maxScore: 30 };
}

// ===== חיבור כל השאלות =====
const allScores = [
  calcQ1Score(),
  calcQ2Score(),
  calcQ3Score(),
  calcQ4Score(),
  calcQ5Score(),
  calcQ6Score(),
  calcQ7Score()
];

// ===== הצגת הניקוד ב־div המתאים =====
allScores.forEach((q, idx) => {
  const div = document.querySelector(`.q${idx + 1}`);
  if (div) div.textContent = `${q.score} / ${q.maxScore}`;
});

// ===== אם רוצים להציג סך הכל במקום אחר =====
const totalScore = allScores.reduce((acc, q) => acc + q.score, 0);
const totalMaxScore = allScores.reduce((acc, q) => acc + q.maxScore, 0);
// לדוגמה, אם יש div עם class="totalScore":
// const totalDiv = document.querySelector('.totalScore');
// if(totalDiv) totalDiv.textContent = `${totalScore} / ${totalMaxScore}`;
