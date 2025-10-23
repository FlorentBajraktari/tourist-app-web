# Tourist App

This project provides a minimal Django REST backend paired with a React Native (Expo) frontend to explore hotels, restaurants, and events in a city.

## Project layout

```
backend/             # Django project (tourist_project) and "places" app
frontend/            # React Native app powered by Expo
requirements.txt     # Django backend dependencies
package.json         # Frontend dependencies (managed via npm / yarn)
```

## Backend quickstart

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r ..\requirements.txt
python manage.py migrate
python manage.py loaddata places/fixtures/seed_places.json
```
```

Interactive Swagger docs are exposed at `http://127.0.0.1:8000/api/docs/` and the raw OpenAPI schema at `/api/schema/`.

## Running backend tests

```powershell
cd backend
.venv\Scripts\Activate.ps1
python manage.py test
```

## Frontend quickstart

The frontend is bootstrapped with Expo to make local testing easy.

```powershell
cd frontend
npm install
npm start
```

The Expo client now ships with:

- Bottom-tab navigation (Discover list & interactive map views)
- Offline-aware caching with pull-to-refresh
- Search, filtering chips, and detail modals for each place
- A map view with tappable markers that open full details
- Modern gradient styling, stats dashboard, and polished detail sheets built with React Native Paper + Expo Linear Gradient
- Persistent Favorites hub with highlight suggestions, per-type stats, and a quick clear action
- Discover quick actions to jump directly into favorites, cities, or the map

With the Expo dev server running, you can preview the app in an emulator or on a physical device using the Expo Go client.

You can validate the Expo setup at any time with:

```powershell
npm --prefix frontend exec expo-doctor
```

## Environment variables

The Django backend reads the following environment variables (all optional) to override defaults:

- `DJANGO_SECRET_KEY`
- `DJANGO_DEBUG` (defaults to `true`)
- `DJANGO_ALLOWED_HOSTS` (comma separated)
- `DJANGO_DB_ENGINE`, `DJANGO_DB_NAME`, `DJANGO_DB_USER`, `DJANGO_DB_PASSWORD`, `DJANGO_DB_HOST`, `DJANGO_DB_PORT`
- `DJANGO_CORS_ALLOW_ALL`

## API examples

### List hotels

```http
GET /api/hotels/
```

### Filter by search term

```http
GET /api/restaurants/?search=grill
```

### Order events by date

```http
GET /api/events/?ordering=date
```

## License

This repository is provided as-is for demonstration purposes.
