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
  event.preventDefault();

  const form = event.target;

  // Get all selected answers
  const answers = form.querySelectorAll('input[type="radio"]:checked');

  // must have 8 selected answers
  if (answers.length !== 8) {
    document.getElementById('error-message').style.display = 'block';
    return;
  }
  document.getElementById('error-message').style.display = 'none';

  // Calculate total score
  let totalScore = 0;
  for (let i = 0; i < answers.length; i++) {
    totalScore = totalScore + parseInt(answers[i].value);
  }

  const maxScore = 24;
  const percentScore = Math.round((totalScore / maxScore) * 100);

  const riskLevel = getRiskLevel(percentScore);
  const explanation = getExplanation(riskLevel);
  const tips = getPersonalizedTips(riskLevel);

  const results = {
    score: percentScore,
    level: riskLevel,
    explanation: explanation,
    tips: tips
  };

  sessionStorage.setItem('quizResults', JSON.stringify(results));
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
    const navToggleButtons = document.querySelectorAll('.nav-toggle');
    navToggleButtons.forEach(button => {
        const header = button.closest('header');
        const menuId = button.getAttribute('aria-controls');
        const menu = menuId ? document.getElementById(menuId) : null;
        if (!header || !menu) {
            return;
        }
        button.addEventListener('click', () => {
            const isOpen = header.classList.toggle('nav-open');
            button.setAttribute('aria-expanded', isOpen);
        });
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (header.classList.contains('nav-open')) {
                    header.classList.remove('nav-open');
                    button.setAttribute('aria-expanded', 'false');
                }
            });
        });
    });

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
