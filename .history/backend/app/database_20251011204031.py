import sqlite3
from datetime import datetime

def init_db():
    """Initialize SQLite database for feedback"""
    conn = sqlite3.connect('feedback.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            message TEXT NOT NULL,
            prediction BOOLEAN NOT NULL,
            user_feedback TEXT NOT NULL,
            correct_prediction BOOLEAN NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()
    print("Database initialized successfully")

def save_feedback(message: str, prediction: bool, user_feedback: str, correct_prediction: bool):
    """Save user feedback to database"""
    conn = sqlite3.connect('feedback.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO feedback (message, prediction, user_feedback, correct_prediction)
        VALUES (?, ?, ?, ?)
    ''', (message, prediction, user_feedback, correct_prediction))
    
    conn.commit()
    conn.close()
    print(f"Feedback saved for message: {message[:50]}...")

def get_feedback_stats():
    """Get feedback statistics"""
    conn = sqlite3.connect('feedback.db')
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM feedback")
    total = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM feedback WHERE correct_prediction = 1")
    correct = cursor.fetchone()[0]
    
    accuracy = correct / total if total > 0 else 0
    
    conn.close()
    
    return {
        'total_feedback': total,
        'correct_predictions': correct,
        'user_reported_accuracy': accuracy
    }