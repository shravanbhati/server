const quizData = window.quizData; 

if (!window.quizData) {
    console.error("Quiz data not loaded.");
} else {
    // Proceed with loading quiz
    const quizData = window.quizData;
    loadQuiz(); // Start quiz loading
}

const quiz=document.getElementById("quiz");
const countQuestion=document.getElementById("count-question");
const totalNumberofQuestion=document.getElementById("total-num-que");
const questionNumber=document.getElementById("question-number");
const questionTitle=document.getElementById("question");
const answerLabel=document.querySelectorAll(".answer-label");
const nextQuestionbtn=document.getElementById("next-question-btn");
const allInputs=document.querySelectorAll("input[type='radio']");
const submiteQuiz=document.getElementById("submite");
const resultEl=document.getElementById("result");
const scoreEl=document.getElementById("score");

let currentQtn=0;
let answerd=0;

const loadQuiz=()=>{
    countQuestion.innerHTML=`${currentQtn +1}`;
    totalNumberofQuestion.innerHTML=quizData.length;
    questionNumber.innerHTML=`${currentQtn+1}`;
    questionTitle.innerHTML=quizData[currentQtn].question;
    answerLabel[0].innerHTML=quizData[currentQtn].a;
    answerLabel[1].innerHTML=quizData[currentQtn].b;
    answerLabel[2].innerHTML=quizData[currentQtn].c;
    answerLabel[3].innerHTML=quizData[currentQtn].d;

    reset();

    if(currentQtn == quizData.length-1){
        nextQuestionbtn.style.display="none";
        submiteQuiz.style.display="block";
    }  
}

const reset =()=>{
    allInputs.forEach((allInputs)=>{
        allInputs.checked=false;
    })
}

let userAnswers = []; 

nextQuestionbtn.addEventListener("click",()=>{
    let answer=getSelected();
    if(answer){

        userAnswers.push({
            question: quizData[currentQtn].question,
            correctAnswer: quizData[currentQtn].correct,
            userAnswer: answer
        }); //NEW

        if(answer===quizData[currentQtn].correct){
            answerd++;
        }
        currentQtn++;
        if(currentQtn<quizData.length){
            loadQuiz();
        }
    }
});

submiteQuiz.addEventListener("click",()=>{
    let answer=getSelected();
    if (answer) {
        if (currentQtn < quizData.length) {
            userAnswers.push({
                question: quizData[currentQtn].question,
                correctAnswer: quizData[currentQtn].correct,
                userAnswer: answer
            });

            if (answer === quizData[currentQtn].correct) {
                answerd++;
            }
        }

        quiz.style.display = "none";
        resultEl.style.display = "block";
        scoreEl.innerHTML = `You scored ${answerd} out of ${quizData.length}!`;

        showCircleGraph();
        showQuizSummary();
    } 


})

const getSelected=()=>{
let answer;
allInputs.forEach((allInputs)=>{
    if(allInputs.checked){
        answer=allInputs.value;
    }
});
return answer;
}

const showCircleGraph = () => {
    const totalQuestions = quizData.length;
    const percentage = Math.round((answerd / totalQuestions) * 100);
    const circleBar = document.getElementById("circle-bar");
    const percentageText = document.getElementById("progress-percentage");

    circleBar.style.setProperty("--percentage", `${percentage}`);


    let currentPercentage = 0;
    const countInterval = setInterval(() => {
        percentageText.innerText = `${currentPercentage}%`;
        if (currentPercentage >= percentage) {
            clearInterval(countInterval);
        } else {
            currentPercentage++;
        }
    }, 10); 

    circleBar.classList.add("fillAnimation");
};

const showQuizSummary = () => {
    const summaryContainer = document.getElementById("quiz-summary");
    const summaryContent = document.getElementById("summary-content");

    // Clear any previous summary content
    summaryContent.innerHTML = "";

    // Loop through userAnswers and display each question, correct answer, and user answer
    userAnswers.forEach((item, index) => {
        const questionItem = document.createElement("div");
        questionItem.classList.add("question-item");


        const correctAnswerText = quizData[index][item.correctAnswer]; // Text for correct answer
        const userAnswerText = quizData[index][item.userAnswer];       // Text for user's answer

        // Apply conditional styling based on answer correctness
        const userAnswerClass = item.userAnswer === item.correctAnswer ? "correct-answer" : "incorrect-answer";
        
        // Set the HTML for this question item with conditional styling and detailed answer data
        questionItem.innerHTML = `
            <p style="color: black;">Q${index + 1}: ${item.question}</p>
            <p style="color: green;">Correct Answer: <span class="correct-answer">${item.correctAnswer} - ${correctAnswerText}</span></p>
            <p style="color: ${item.userAnswer === item.correctAnswer ? 'green' : 'red'};">
                Your Answer: <span class="${userAnswerClass}">${item.userAnswer} - ${userAnswerText}</span>
            </p>
        `;

        
        // Append this question item to the summary container
        summaryContent.appendChild(questionItem);
    });

    // Display the summary section
    summaryContainer.style.display = "block";
};

loadQuiz();
