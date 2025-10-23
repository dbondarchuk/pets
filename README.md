# Novellia Pets

## Installation

### Prerequisites

Ensure you have the following installed on your system:

- `Node.js` (Recommended: Latest LTS version)
- `yarn`

### Install Dependencies

Using yarn:

`yarn install`

### Environment Variables

Copy a `.env.example` file in the root directory into `.env.local`

```
NEXTAUTH_URL=http://localhost:3000
AUTH_TRUST_HOST=http://localhost:3000
NEXTAUTH_SECRET=kjlkjflfd
DB_FILE=db.sqlite
```

### Running the Development Server

Start the development server with:

`yarn dev`

### Building for Production

To create an optimized production build:

`yarn build`

Run the production server:

`yarn start`

## Docker

The application can be run using Docker and Docker Compose for easy deployment and development.

### Prerequisites

Ensure you have the following installed on your system:

- `Docker`
- `Docker Compose`

### Building the Docker Image

To build the Docker image:

```bash
docker build -t pets:latest .
```

### Running with Docker Compose

The easiest way to run the application is using Docker Compose:

```bash
docker-compose up
```

This will:

- Build the Docker image (if not already built)
- Start the application container
- Mount the SQLite database file (`db.sqlite`) as a volume
- Expose the application on port 3000

## URL

The application will start on http://localhost:3000 URL

## Live Demo

A live demo of the application is available at: **[https://pets.bondarchuk.me/](https://pets.bondarchuk.me/)**

**Demo Credentials:**

- **Admin access**: `admin@example.com` / `password`
- **Regular users**: See the complete list in the [Auth section](#auth)

## Front-end

The front-end application is written using Next.js for simplifying API+frontend flow. It uses collection of ShadcnUI components + custom components to achieve better user experience.

### Auth

The application includes pet records dashboard, which is protected by simple credential auth.
Demo database includes a few users that can be used:

| 1                  | 2                            | 3               |
| ------------------ | ---------------------------- | --------------- |
| John Doe           | john@example.com             | password        |
| Miranda Franey     | Shawn77@gmail.com            | J8qz_EZ0XzSPJ4b |
| Amanda Spinka      | Imelda_Bartell92@hotmail.com | EmzuHLW9L5WPgVD |
| Emanuel Feeney DVM | Prince.Morar56@gmail.com     | Wlk5A4U3TBwr5mk |
| Ida Schulist       | Rachael39@gmail.com          | y_cKJTn3rIc4efw |
| Mr. Herbert Nader  | Emelie35@hotmail.com         | 5VAYqaBNcChjoGF |
| Rachel Feeney DDS  | Ila36@yahoo.com              | 57CY4lLldVg27UV |
| Emilio Tromp       | Kiarra31@hotmail.com         | OeT7nbJMCGsOtB5 |
| Aaron Mitchell     | Madie_Kris@gmail.com         | QcCB45g4WMKDXid |
| Alton Zemlak       | Graciela.Reichel8@gmail.com  | 4YKl3O1z2XLTZ_p |
| Chelsea Yost       | Eddie.Rippin@gmail.com       | cyvVBLG23HgsM8L |

You can also sign in as admin to view/modify pet records from all users using following credentials:

- email: admin@example.com
- password: password

### Multi-language support

The application can be viewed in English or Spanish by switching the language in dashboard or sign in page. Adding a new language requires minimum effort of translation and adding new language to the map.

### Server side rendering

Next.js allows us to have SSR for almost everything to speed up UX

### Add, Delete, Update Bulk delete

The application allows user to add new pets, pet vaccines and and allergies, update existing records, and delete both pets and records.

User can also delete records in bulk.

## API

The application provides APIs to use for operations mentioned above. It's protected under same auth.

## Seed data

There is an included seed database.

If you want use another one or add few new items, you can call API `http://localhost:3000/api/faker[?count={{count}}][&userId={{userId}}]` where `count` is amount of pets you want to generate and optional userId to generate the data for specific user.

You also can call `http://localhost:3000/api/faker?type=users[&count={{count}}]` to generate users.

Default `count` value is `10` for both APIs.
