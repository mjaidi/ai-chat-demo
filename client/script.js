import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

const loader = (element) => {
  element.textContent = '';
  loadInterval = setInterval(() => {
    element.textContent += '.';
    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300);
}

const typeText = (text, element) => {
  let i = 0;
  const interval = setInterval(() => {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i ++
    } else {
      clearInterval(interval);
    }
  }, 20);
}

const generateUniqueId = () => {
  const timestamp = Date.now()
  const randomNumber = Math.random()
  const hexa = randomNumber.toString(16)
  return `id-${timestamp}-${hexa}`
}

const chatStripe = (isAi, value, uniqueId) => {
  return (
    `<div class="wrapper ${isAi ? 'ai' : ''}">
      <div class="chat">
        <div class="profile"><img src="${isAi ? bot : user}"/></div>
        <div class="message" id="${uniqueId}">${value}</div>
      </div>
    </div>`
  )
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
  form.reset();

  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, ' ', uniqueId);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv);

  const response = await fetch('http://localhost:5000', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: data.get('prompt') })
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if (response.ok) {
    const { bot } = await response.json();
    const parsedData = bot.trim();
    typeText(parsedData, messageDiv);
  } else {
    const { error } = await response.json();
    messageDiv.innerHTML = 'Something went wrong';
    alert(error);
  }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => { if (e.keyCode === 13) handleSubmit(e) })