const quotes = [
    { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Imagination is more important than knowledge.", author: "Albert Einstein" },
    { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
    { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
    { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
    { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Will Durant" },
    { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
    { text: "You can't use up creativity. The more you use, the more you have.", author: "Maya Angelou" }
];

// Render Random Quote in Hero
const randomIndex = Math.floor(Math.random() * quotes.length);
document.getElementById('quote-text').innerText = `"${quotes[randomIndex].text}"`;
document.getElementById('quote-author').innerText = `- ${quotes[randomIndex].author}`;

// Render All Quotes List
const listElement = document.getElementById('all-quotes-list');
quotes.forEach(q => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>"${q.text}"</strong> - ${q.author}`;
    listElement.appendChild(li);
});