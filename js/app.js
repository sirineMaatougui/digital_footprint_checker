// app.js: Shared JavaScript file for all pages. Handles quiz form submission, validation, scoring, sessionStorage, and API calls. Heavily commented for line-by-line explanation in oral exam.

// Function to get personalized tips based on risk level
function getPersonalizedTips(level) {
    // Define tips arrays for each risk level
    const lowTips = [
        "Keep up the good work! Continue using strong passwords.",
        "Regularly review your privacy settings.",
        "Enable 2FA where possible."
    ];
    const mediumTips = [
        "Consider using a password manager.",
        "Limit sharing personal information online.",
        "Use VPNs on public Wi-Fi."
    ];
    const highTips = [
        "Immediately change passwords to unique ones.",
        "Turn off location sharing by default.",
        "Avoid clicking unknown links and use antivirus software.",
        "Make your social profiles private."
    ];
    // Return tips based on level
    if (level === 'Low') return lowTips;
    if (level === 'Medium') return mediumTips;
    return highTips; // High
}

// Function to calculate risk level from percentage
function getRiskLevel(percent) {
    if (percent <= 33) return 'Low';
    if (percent <= 66) return 'Medium';
    return 'High';
}

// Function to get explanation text based on risk level
function getExplanation(level) {
    const explanations = {
        Low: "Your digital footprint is relatively secure. Minor improvements can enhance your privacy.",
        Medium: "You have moderate risks. Focus on key areas like passwords and sharing habits.",
        High: "Your digital footprint poses significant risks. Take immediate steps to protect your data."
    };
    return explanations[level];
}

// Function to handle quiz form submission
function handleQuizSubmit(event) {
    // Prevent the default form submission behavior (page refresh)
    event.preventDefault();
    
    // Get the form element
    const form = event.target;
    // Collect all radio button groups (questions)
    const questions = form.querySelectorAll('input[type="radio"]:checked');
    // Check if all 8 questions are answered (each question has a name like q1, q2, etc.)
    const answeredQuestions = new Set();
    questions.forEach(q => answeredQuestions.add(q.name));
    if (answeredQuestions.size !== 8) {
        // Show error message if not all answered
        document.getElementById('error-message').style.display = 'block';
        return;
    }
    // Hide error message if validation passes
    document.getElementById('error-message').style.display = 'none';
    
    // Calculate total score: sum of selected values (each is a string, convert to number)
    let totalScore = 0;
    questions.forEach(q => totalScore += parseInt(q.value));
    // Max score is 24 (8 questions * 3 max points each)
    const maxScore = 24;
    // Calculate percentage and round it
    const percentScore = Math.round((totalScore / maxScore) * 100);
    // Determine risk level
    const riskLevel = getRiskLevel(percentScore);
    // Get explanation
    const explanation = getExplanation(riskLevel);
    // Get personalized tips
    const tips = getPersonalizedTips(riskLevel);
    
    // Store results in sessionStorage as JSON
    const results = {
        score: percentScore,
        level: riskLevel,
        explanation: explanation,
        tips: tips
    };
    sessionStorage.setItem('quizResults', JSON.stringify(results));
    
    // Redirect to results page
    window.location.href = 'result.html';
}

// Function to load results on result.html
function loadResults() {
    // Check if results exist in sessionStorage
    const results = sessionStorage.getItem('quizResults');
    if (!results) {
        // Show no data message
        document.getElementById('no-data').style.display = 'block';
        return;
    }
    // Parse JSON results
    const data = JSON.parse(results);
    // Update DOM elements
    document.getElementById('score').textContent = data.score;
    document.getElementById('level').textContent = data.level;
    document.getElementById('explanation').textContent = data.explanation;
    // Update progress bar: set width to percentage
    document.getElementById('progress-fill').style.width = data.score + '%';
    // Update tips list
    const tipsList = document.getElementById('tips-list');
    tipsList.innerHTML = ''; // Clear loading text
    data.tips.forEach(tip => {
        const li = document.createElement('li');
        li.textContent = tip;
        tipsList.appendChild(li);
    });
}

// Async function to fetch IP geolocation data
async function fetchGeolocation() {
    try {
        // Make API call using fetch and await
        const response = await fetch('http://ip-api.com/json/');
        // Check if response is ok
        if (!response.ok) throw new Error('API request failed');
        // Parse JSON response
        const data = await response.json();
        // Update DOM elements with API data
        document.getElementById('ip').textContent = data.query || 'N/A';
        document.getElementById('country').textContent = data.country || 'N/A';
        document.getElementById('city').textContent = data.city || 'N/A';
        document.getElementById('isp').textContent = data.isp || 'N/A';
    } catch (error) {
        // On error, show friendly message
        document.getElementById('api-error').style.display = 'block';
        console.error('Geolocation API error:', error);
    }
}

// Main initialization function, runs when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check current page by looking for specific elements
    if (document.getElementById('quiz-form')) {
        // On quiz.html: Add submit event listener to form
        document.getElementById('quiz-form').addEventListener('submit', handleQuizSubmit);
    }
    if (document.getElementById('score')) {
        // On result.html: Load results and fetch API
        loadResults();
        fetchGeolocation();
    }
    // Other pages (index, tips, about) don't need specific JS, so no action here
});