# TrackBudget - Local Setup (Windows + PostgreSQL)

This project uses PostgreSQL with Entity Framework Core.

## 1) Install PostgreSQL on Windows

Option A (recommended): install from winget

```powershell
winget install -e --id PostgreSQL.PostgreSQL
```

Option B: install from the PostgreSQL installer website.

During installation, set and remember the postgres superuser password.

## 2) Create database

Open a terminal and run:

```powershell
psql -U postgres -h localhost -p 5432
```

Then create the app database:

```sql
CREATE DATABASE "your_project_db";
```

If needed, create a dedicated user and grant access:

```sql
CREATE USER trackbudget_user WITH PASSWORD 'change_me';
GRANT ALL PRIVILEGES ON DATABASE "trackbudgetdb" TO trackbudget_user;
```

## 3) Configure API connection string

Edit:

- TrackBudget.Api/appsettings.Development.json

Set the connection string under ConnectionStrings:DefaultConnection, for example:

```json
"Host=localhost;Port=5432;Database=trackbudgetdb;Username=postgres;Password=your_password"
```

## 4) Restore local EF tool (one-time)

From repository root (the folder that contains dotnet-tools.json):

```powershell
dotnet tool restore
```

## 5) Apply migrations

From repository root:

```powershell
dotnet tool run dotnet-ef database update --project TrackBudget/TrackBudget.Infrastructure/TrackBudget.Infrastructure.csproj --startup-project TrackBudget/TrackBudget.Api/Trackbudget.Api.csproj
```

## 6) Run API

From TrackBudget folder:

```powershell
dotnet run --project TrackBudget.Api/Trackbudget.Api.csproj
```

Health check:

- http://localhost:5144/health (port may differ by launch profile)

## Notes

- The API now runs pending EF migrations automatically on startup.
- If PostgreSQL is not running, start the PostgreSQL Windows service and try again.
- If psql is not recognized, reopen terminal after install or add PostgreSQL bin folder to PATH.
