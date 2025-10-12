# Phishing Detection MVP

A full-stack machine learning application for detecting phishing URLs and messages, featuring a Chrome extension and web demo.

## 🚀 Features

- **Machine Learning**: Random Forest, Logistic Regression, and XGBoost models
- **REST API**: FastAPI backend with real-time predictions
- **Chrome Extension**: Browser integration for quick URL checking
- **Web Demo**: React-based web interface
- **Feedback System**: User feedback collection for model improvement

## 📁 Project Structure
phishing-detection-mvp/
├── ml/ # Machine learning training and models
├── backend/ # FastAPI backend server
├── frontend/ # Chrome extension and web demo
├── scripts/ # Setup and build scripts
└── README.md

## 🛠️ Installation

### Prerequisites

- Python 3.8+
- Node.js 16+
- Windows, Mac, or Linux

### Quick Start

1. **Clone and initialize**:
   ```bash
   # PowerShell (Windows)
   .\scripts\init.ps1

   # Bash (Mac/Linux)
   chmod +x scripts/init.sh
   ./scripts/init.sh