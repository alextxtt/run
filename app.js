// ===== FIREBASE SETUP =====
// Replace with your config from Firebase Console > Project Settings
const firebaseConfig = {
    apiKey: "AIzaSyAiiAe62RDdlPH30aMAD6oa-TenhcCMMvk",
    authDomain: "runbant.firebaseapp.com",
    projectId: "runbant",
    storageBucket: "runbant.firebasestorage.app",
    messagingSenderId: "451903372082",
    appId: "1:451903372082:web:2662ed4f55329aa84d352b",
    measurementId: "G-RTB7E3MMGS"
  };
  
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ===== DOM ELEMENTS =====
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');

// ===== CHAT FUNCTIONS =====
// Send message to Firestore
function sendMessage() {
  const message = messageInput.value.trim();
  if (message) {
    // Add to Firestore
    db.collection('messages').add({
      text: message,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      user: generateRandomRunnerName(),
      speed: getRandomSpeed() // Simulated metric
    });
    messageInput.value = '';
  }
}

// Send quick message (for treadmill buttons)
function sendQuickMessage(msg) {
  messageInput.value = msg;
  sendMessage();
}

// Generate fun runner names
function generateRandomRunnerName() {
  const adjectives = ["Speedy", "Marathon", "Trail", "Sprint", "Endurance"];
  const nouns = ["Cheetah", "Runner", "Jogger", "Gazelle", "Warrior"];
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${
           nouns[Math.floor(Math.random() * nouns.length)]}${
           Math.floor(Math.random() * 100)}`;
}

// Simulate treadmill metrics
function getRandomSpeed() {
  return (Math.random() * 5 + 3).toFixed(1); // 3-8 mph
}

// ===== REAL-TIME LISTENER =====
db.collection('messages')
  .orderBy('timestamp')
  .onSnapshot(snapshot => {
    messagesDiv.innerHTML = '';
    snapshot.forEach(doc => {
      const msg = doc.data();
      const messageElement = document.createElement('div');
      messageElement.className = 'message';
      messageElement.innerHTML = `
        <span class="user">${msg.user} (${msg.speed} mph):</span>
        <span>${msg.text}</span>
      `;
      messagesDiv.appendChild(messageElement);
    });
    // Auto-scroll to bottom
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });

// ===== TREADMILL UX HELPERS =====
// Enter key sends message
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// Voice input button (optional)
function startVoiceInput() {
  if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.onresult = (event) => {
      messageInput.value = event.results[0][0].transcript;
      sendMessage();
    };
    recognition.start();
  } else {
    alert("Voice input not supported on this browser");
  }
}