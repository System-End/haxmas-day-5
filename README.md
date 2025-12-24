this is a simple gift tracker made with flask
 # Features
 
 - Password protected
 - add gifts with the recipient name and category of the gift
 - mark gifts when purchased or deleivered
 - delete them when done
 - track delivered, purchased, etc
 
 # Setup

Clone the Repo
``` 
git clone git@github.com:System-End/haxmas-day-5.git
```

2. Create a virtual enviroment
```
python -m venv venv
source venv/bin/activate
```
# or if on fish
```
source venv/vin/activate.fish
```
On Windows use: `venv\Scripts\activate`

3. Install dependencies
```
pip install -r requirements.txt
```

4. Create a `.env` file with your password:
```
APP_PASSWORD=your-password
```

5. Run it
```
python main.py
```

## Deploying to Railway

1. Connect repo to Railway
2. Add environment variable `APP_PASSWORD` in project settings
3. Generate a domain
