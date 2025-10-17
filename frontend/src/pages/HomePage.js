import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, CalendarDays } from 'lucide-react';
import SettingsMenu from '../components/SettingsMenu';
import moment from 'moment';

const dailyQuotes = [
  // Inspirational
  { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "Whether you think you can, or you think you can't—you're right.", author: "Henry Ford" },

  // Beautiful
  { text: "And in that moment, I swear we were infinite.", author: "Stephen Chbosky, The Perks of Being a Wallflower" },
  { text: "Whatever our souls are made of, his and mine are the same.", author: "Emily Brontë, Wuthering Heights" },
  { text: "We accept the love we think we deserve.", author: "Stephen Chbosky, The Perks of Being a Wallflower" },
  { text: "So we beat on, boats against the current, borne back ceaselessly into the past.", author: "F. Scott Fitzgerald, The Great Gatsby" },
  { text: "It does not do to dwell on dreams and forget to live.", author: "J.K. Rowling, Harry Potter and the Sorcerer's Stone" },

  // Funny
  { text: "I can resist everything except temptation.", author: "Oscar Wilde" },
  { text: "People say nothing is impossible, but I do nothing every day.", author: "A. A. Milne, Winnie-the-Pooh" },
  { text: "I am so clever that sometimes I don't understand a single word of what I am saying.", author: "Oscar Wilde" },
  { text: "Never put off till tomorrow what may be done day after tomorrow just as well.", author: "Mark Twain" },

  // Famous quotes from books
  { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien, The Fellowship of the Ring" },
  { text: "It is our choices, Harry, that show what we truly are, far more than our abilities.", author: "J.K. Rowling, Harry Potter and the Chamber of Secrets" },
  { text: "There is some good in this world, and it's worth fighting for.", author: "J.R.R. Tolkien, The Two Towers" },
  { text: "Real courage is when you know you're licked before you begin, but you begin anyway and see it through no matter what.", author: "Harper Lee, To Kill a Mockingbird" },
  { text: "Get busy living or get busy dying.", author: "Stephen King, Different Seasons" },
  { text: "It matters not what someone is born, but what they grow to be.", author: "J.K. Rowling, Harry Potter and the Goblet of Fire" },
  { text: "The fool doth think he is wise, but the wise man knows himself to be a fool.", author: "William Shakespeare, As You Like It" },

  // Motivational / productivity
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Do not wait; the time will never be 'just right.' Start where you stand.", author: "Napoleon Hill" },
  { text: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear, Atomic Habits" },
  { text: "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.", author: "Stephen King" },
  { text: "If you're going through hell, keep going.", author: "Winston Churchill" },

  // Poetic / reflective
  { text: "Two roads diverged in a wood, and I—I took the one less traveled by, and that has made all the difference.", author: "Robert Frost" },
  { text: "There is a crack in everything, that's how the light gets in.", author: "Leonard Cohen" },
  { text: "We are all in the gutter, but some of us are looking at the stars.", author: "Oscar Wilde" },
];

const HomePage = ({ user, handleLogout, isDark, onToggleTheme, onChangeEmail, onChangePassword }) => {
  const navigate = useNavigate();
  const [currentQuote, setCurrentQuote] = useState({ text: "", author: "" });

  useEffect(() => {
    const dayOfYear = moment().dayOfYear();
    const quoteIndex = dayOfYear % dailyQuotes.length;
    setCurrentQuote(dailyQuotes[quoteIndex]);
  }, []);

  return (
    <div className="home-page">
      <div className="sticker sticker-1"></div>
      <div className="sticker sticker-2"></div>
      <div className="sticker sticker-3"></div>
      <div className="sticker sticker-4"></div>

      <div className="home-content">
        <div className="main-info-column">
          <div className="home-header-section">
            {/* Greeting - Left Side (Large) */}
            <div className="greeting-text">
              <h1>Hello, {user?.username}!</h1>
              <p>What's up today?</p>
            </div>

            {/* Willow App Name - Center (Small) */}
            <div className="app-name">
              <h2>Willow</h2>
            </div>

            {/* Settings Menu - Right Side */}
            <SettingsMenu
              user={user}
              isDark={isDark}
              onToggleTheme={onToggleTheme}
              onLogout={handleLogout}
              onChangeEmail={onChangeEmail}
              onChangePassword={onChangePassword}
            />
          </div>

          <div className="home-action-grid">
            <div className="action-card" onClick={() => navigate('/tasks')}>
              <ClipboardCheck size={32} className="action-card-icon" />
              <span className="action-card-text">Daily Planner</span>
            </div>
            <div className="action-card" onClick={() => navigate('/calendar')}>
              <CalendarDays size={32} className="action-card-icon" />
              <span className="action-card-text">Monthly Calendar</span>
            </div>
          </div>
        </div>

        <div className="quote-column">
          <p className="quote-text">"{currentQuote.text}"</p>
          <p className="quote-author">— {currentQuote.author}</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;