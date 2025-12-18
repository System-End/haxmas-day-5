# Gift Tracker 🎁

A simple web app to keep track of gifts you need to give people. Built with Flask.

## Features

- Password protected
- Add gifts with recipient name and category
- Mark gifts as purchased or delivered
- Delete gifts when done
- Tracks stats (total, purchased, delivered)

## Setup

1. Clone this repo

2. Create a virtual environment:
```
python -m venv venv
source venv/bin/activate
```
On Windows use: `venv\Scripts\activate`

3. Install dependencies:
```
pip install -r requirements.txt
```

4. Create a `.env` file with your password:
```
APP_PASSWORD=your-secret-password
```

5. Run it:
```
python main.py
```

6. Go to http://127.0.0.1:5000

## Deploying to Railway

1. Push to GitHub
2. Connect repo to Railway
3. Add environment variable `APP_PASSWORD` in Railway settings
4. Set start command: `gunicorn main:app --bind 0.0.0.0:$PORT`
5. Generate a domain

## Deploying to PythonAnywhere

1. Clone repo in PythonAnywhere bash console
2. Create venv and install requirements
3. Create `.env` file with your password
4. Configure WSGI file to point to your app
5. Reload the web app
