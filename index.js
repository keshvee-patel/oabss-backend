const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// 5 Questions as per PDF
const questions = [
  "How often do you feel a strong urge to urinate immediately?",
  "How many times do you typically urinate during the day?",
  "How often do you wake up at night to urinate?",
  "Do you experience sudden urges that result in urine leakage?",
  "How much does this affect your daily life (work, social activities, sleep)?"
];

// Calculate total score and give recommendation
function calculateOABSS(responses) {
  const score = responses.reduce((sum, val) => sum + val, 0);
  let severity = '';
  let recommendation = '';

  if (score <= 5) {
    severity = 'No significant symptoms';
    recommendation = 'No medical action required.';
  } else if (score <= 10) {
    severity = 'Mild symptoms';
    recommendation = 'Monitor and suggest lifestyle adjustments.';
  } else if (score <= 15) {
    severity = 'Moderate symptoms';
    recommendation = 'Recommend medical consultation.';
  } else {
    severity = 'Severe symptoms';
    recommendation = 'Strongly recommend urology referral.';
  }

  return { score, severity, recommendation };
}

// POST endpoint to receive city + answers
app.post('/submit', (req, res) => {
  const { city, responses } = req.body;

  if (!city || !Array.isArray(responses) || responses.length !== 5) {
    return res.status(400).json({ error: 'Please provide city and 5 responses (0-4).' });
  }

  const result = calculateOABSS(responses);
  return res.json({
    city,
    questions,
    responses,
    ...result
  });
});

app.listen(PORT, () => {
  console.log(`✅ OABSS backend running at http://localhost:${PORT}`);
});
