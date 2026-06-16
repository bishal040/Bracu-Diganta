const fs = require('fs');
const path = './src/data/team.json';
const team = require(path);

const links = [
  "https://i.ibb.co.com/8DKLyHWS/Whats-App-Image-2026-06-17-at-01-47-35-1.jpg",
  "https://i.ibb.co.com/WvJvYjYj/Whats-App-Image-2026-06-17-at-01-47-35-2.jpg",
  "https://i.ibb.co.com/prbVZ8sb/Whats-App-Image-2026-06-17-at-01-47-35.jpg",
  "https://i.ibb.co.com/KxThc0hN/Whats-App-Image-2026-06-17-at-01-47-36-1.jpg",
  "https://i.ibb.co.com/bj7QSj2S/Whats-App-Image-2026-06-17-at-01-47-36-2.jpg",
  "https://i.ibb.co.com/Gvr6YZ01/Whats-App-Image-2026-06-17-at-01-47-36.jpg",
  "https://i.ibb.co.com/ynNs3gYr/Whats-App-Image-2026-06-17-at-01-47-37-1.jpg",
  "https://i.ibb.co.com/7d2MTKMm/Whats-App-Image-2026-06-17-at-01-47-37-2.jpg",
  "https://i.ibb.co.com/Kcbt4Y4t/Whats-App-Image-2026-06-17-at-01-47-37.jpg",
  "https://i.ibb.co.com/JWZfrVXM/Whats-App-Image-2026-06-17-at-01-47-38-1.jpg",
  "https://i.ibb.co.com/TD2hyM5k/Whats-App-Image-2026-06-17-at-01-47-38-2.jpg",
  "https://i.ibb.co.com/qLyLQJ0Z/Whats-App-Image-2026-06-17-at-01-47-38.jpg",
  "https://i.ibb.co.com/rKPR3N1h/Whats-App-Image-2026-06-17-at-01-47-39-1.jpg",
  "https://i.ibb.co.com/C5PX8GNn/Whats-App-Image-2026-06-17-at-01-47-39-2.jpg",
  "https://i.ibb.co.com/HD2KZ9Ns/Whats-App-Image-2026-06-17-at-01-47-40-1.jpg",
  "https://i.ibb.co.com/n8PjhYjt/Whats-App-Image-2026-06-17-at-01-47-40.jpg",
  "https://i.ibb.co.com/9k2RzPY7/Whats-App-Image-2026-06-17-at-01-47-41-1.jpg",
  "https://i.ibb.co.com/LzP2f9TQ/Whats-App-Image-2026-06-17-at-01-47-41-2.jpg",
  "https://i.ibb.co.com/HDBTyNRt/Whats-App-Image-2026-06-17-at-01-47-41.jpg",
  "https://i.ibb.co.com/Ndzxfmbc/Whats-App-Image-2026-06-17-at-01-47-42-1.jpg",
  "https://i.ibb.co.com/9QjdGvd/Whats-App-Image-2026-06-17-at-01-47-42-2.jpg",
  "https://i.ibb.co.com/DfM7GPL5/Whats-App-Image-2026-06-17-at-01-47-43-1.jpg",
  "https://i.ibb.co.com/jk1DyJtQ/Whats-App-Image-2026-06-17-at-01-47-43-2.jpg",
  "https://i.ibb.co.com/wh0nz9mJ/Whats-App-Image-2026-06-17-at-01-47-44-2.jpg",
  "https://i.ibb.co.com/qYfTDFjq/Whats-App-Image-2026-06-17-at-01-47-45.jpg",
  "https://i.ibb.co.com/bVWCrBB/Whats-App-Image-2026-06-17-at-01-47-46.jpg",
  "https://i.ibb.co.com/zW1YgbmM/Whats-App-Image-2026-06-17-at-01-47-47-2.jpg",
  "https://i.ibb.co.com/0156Xkd/Whats-App-Image-2026-06-17-at-01-47-47.jpg",
  "https://i.ibb.co.com/S4dZ9grx/Whats-App-Image-2026-06-17-at-01-47-48-1.jpg",
  "https://i.ibb.co.com/W42n1dsP/Whats-App-Image-2026-06-17-at-01-47-48-2.jpg",
  "https://i.ibb.co.com/35WZ6czz/Whats-App-Image-2026-06-17-at-01-47-49-1.jpg",
  "https://i.ibb.co.com/20dfZ4gZ/Whats-App-Image-2026-06-17-at-01-47-49.jpg",
  "https://i.ibb.co.com/k2t4Jp36/Whats-App-Image-2026-06-17-at-01-47-50-2.jpg",
  "https://i.ibb.co.com/fYzBb6VQ/Whats-App-Image-2026-06-17-at-01-47-50.jpg",
  "https://i.ibb.co.com/7NpXkRxq/Whats-App-Image-2026-06-17-at-01-47-51.jpg",
  "https://i.ibb.co.com/20jJtBRY/Whats-App-Image-2026-06-17-at-01-47-52-1.jpg",
  "https://i.ibb.co.com/SXWFygdT/Whats-App-Image-2026-06-17-at-01-47-52.jpg",
  "https://i.ibb.co.com/Txyrz8CK/Whats-App-Image-2026-06-17-at-01-47-53-1.jpg",
  "https://i.ibb.co.com/xnXnV6t/Whats-App-Image-2026-06-17-at-01-47-53-2.jpg"
];

let i = 0;
team.forEach(year => {
  ['supervisors', 'advisors', 'teamLeads', 'subTeamLeads', 'teamMembers'].forEach(category => {
    if (year[category]) {
      year[category].forEach(member => {
        if (i < links.length) {
          member.image = links[i];
          i++;
        } else {
          member.image = links[links.length - 1]; // fallback to last if we run out
        }
      });
    }
  });
});

fs.writeFileSync(path, JSON.stringify(team, null, 2));
console.log('Updated', i, 'images');
