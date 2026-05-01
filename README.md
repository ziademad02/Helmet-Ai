# Helmet AI Web Project

Simple web assignment for the Smart AR Safety Helmet and AI Health Assistant project.

The project uses HTML, Tailwind CDN, JavaScript, PHP, and MySQL. The main page is `index.html`, and the router loads the page fragments into the same layout.

## Main Files

| File | Purpose |
|---|---|
| `index.html` | Main layout, header, footer, chat widget, and script links |
| `home.html` | Home page sections, features, technology, team, and contact form |
| `login.html` | Login form |
| `register.html` | Registration form |
| `profile.html` | User profile view |
| `dashboard.html` | Helmet dashboard view |
| `css/style.css` | Shared custom styles |
| `js/router.js` | Hash router for loading page fragments |
| `api/*.php` | PHP backend files |
| `database.sql` | Database schema and sample data |

## API Files

| File | Purpose |
|---|---|
| `api/db.php` | Database connection |
| `api/login.php` | Login handler |
| `api/register.php` | Registration handler |
| `api/logout.php` | Logout handler |
| `api/session.php` | Current session status |
| `api/profile.php` | Profile JSON data |
| `api/dashboard.php` | Dashboard JSON data |
| `api/chat.php` | Chat API proxy |

## Sample Accounts

| Username | Password | Worker | Helmet |
|---|---|---|---|
| `ziad` | `ziad2024` | Ziad Emad | HLM-001 |
| `ashraf` | `ashraf2024` | Mohamed Ashraf | HLM-002 |
| `mostafa` | `admin123` | Mostafa Ahmed | HLM-003 |
| `sara` | `sara2024` | Sara Mohamed Eid | HLM-004 |

## Database

Run the SQL file once in MySQL:

```bash
"C:\xampp\mysql\bin\mysql.exe" -u root < database.sql
```

The database name is `smart_helmet_db`.

## Run Locally

1. Start MySQL in XAMPP.
2. Import `database.sql`.
3. Start Apache in XAMPP.
4. Open the project from the browser, for example:

```text
http://localhost/Helmet-Ai-master/
```

For the chat widget, set the `GROQ_API_KEY` environment variable before using `api/chat.php`.
