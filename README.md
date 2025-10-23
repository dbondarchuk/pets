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

Next.js allows us to have SSR for almost everything to speed up initial UI render.

### Add, Delete, Update, and Bulk delete

The application allows user to add new pets, pet vaccinations and and allergies, update existing records, and delete both pets and records.

User can also delete records in bulk.

## API

The application provides APIs to use for operations mentioned above. It's protected under same auth.

### Pet Management APIs

#### `GET /api/pets`

Retrieves paginated list of pets with filtering options.

- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `q`: Search query
  - `type`: Pet type filter (cat/dog/etc)
  - `ownerId`: Filter by owner (admin only)
- **Response**: Paginated pet list with metadata

#### `POST /api/pets`

Creates a new pet record.

- **Body**: Pet schema object
- **Response**: `{ petId: string }`

#### `GET /api/pets/[petId]`

Retrieves a specific pet by ID.

- **Response**: Pet object with full details

#### `PUT /api/pets/[petId]`

Updates an existing pet record.

- **Body**: Pet schema object
- **Response**: `{ petId: string }`

#### `DELETE /api/pets/[petId]`

Deletes a pet record.

- **Response**: `{ success: boolean }`

#### `POST /api/pets/delete`

Bulk delete multiple pets.

- **Body**: `{ petIds: string[] }`
- **Response**: `{ success: boolean }`

### Pet Allergies APIs

#### `GET /api/pets/[petId]/allergies`

Retrieves paginated list of allergies for a specific pet.

- **Query Parameters**:
  - `page`: Page number
  - `limit`: Items per page
  - `q`: Search query
  - `severity`: Filter by allergy severity
- **Response**: Paginated allergies list

#### `POST /api/pets/[petId]/allergies`

Creates a new allergy record for a pet.

- **Body**: Allergy entry schema
- **Response**: `{ success: boolean }`

#### `PUT /api/pets/[petId]/allergies/[allergyId]`

Updates an existing allergy record.

- **Body**: Allergy entry schema
- **Response**: `{ success: boolean }`

#### `DELETE /api/pets/[petId]/allergies/[allergyId]`

Deletes an allergy record.

- **Response**: `{ success: boolean }`

#### `POST /api/pets/[petId]/allergies/delete`

Bulk delete multiple allergies.

- **Body**: `{ allergyIds: string[] }`
- **Response**: `{ success: boolean }`

### Pet Vaccinations APIs

#### `GET /api/pets/[petId]/vaccination`

Retrieves paginated list of vaccinations for a specific pet.

- **Query Parameters**:
  - `page`: Page number
  - `limit`: Items per page
  - `q`: Search query
  - `start`: Start date filter
  - `end`: End date filter
- **Response**: Paginated vaccinations list

#### `POST /api/pets/[petId]/vaccination`

Creates a new vaccination record for a pet.

- **Body**: Vaccination schema
- **Response**: `{ success: boolean }`

#### `PUT /api/pets/[petId]/vaccination/[vaccinationId]`

Updates an existing vaccination record.

- **Body**: Vaccination schema
- **Response**: `{ success: boolean }`

#### `DELETE /api/pets/[petId]/vaccination/[vaccinationId]`

Deletes a vaccination record.

- **Response**: `{ success: boolean }`

#### `POST /api/pets/[petId]/vaccination/delete`

Bulk delete multiple vaccinations.

- **Body**: `{ vaccinationIds: string[] }`
- **Response**: `{ success: boolean }`

### User Management APIs

#### `GET /api/users`

Retrieves list of all users (admin only).

- **Response**: Array of user objects

### Data Generation APIs

#### `GET /api/faker`

Generates fake data for testing and development.

- **Query Parameters**:
  - `type`: Data type (`users` or `pets`, default: `pets`)
  - `count`: Number of records to generate (default: 10)
  - `userId`: Specific user ID for pet generation (comma-separated for multiple)
- **Response**: Generated data objects

## Pages and Routes

### Authentication Pages

#### `/` (Sign In Page)

- **Description**: User authentication page with multi-language support
- **Features**: Email/password login, language switching

### Dashboard Pages

#### `/dashboard`

- **Description**: Main dashboard redirects to pets listing
- **Access**: Authenticated users only

#### `/dashboard/pets`

- **Description**: Pet listing page with search, filtering, and pagination
- **Features**:
  - Data table with sorting and filtering
  - Bulk operations (delete selected)
  - Add new pet button
  - Admin view shows all pets, regular users see only their pets

#### `/dashboard/pets/new`

- **Description**: Create new pet form
- **Features**: Form for pet details. Admins can select owner for the pet

#### `/dashboard/pets/[id]`

- **Description**: Pet detail page (redirects to details tab)
- **Access**: Pet owner or admin only

#### `/dashboard/pets/[id]/[tab]`

- **Description**: Pet detail page with tabbed interface
- **Tabs**:
  - `details`: Pet basic information and details
  - `vaccinations`: Vaccination records management
  - `allergies`: Allergy records management
- **Features**:
  - Edit pet information
  - Add/edit/delete vaccinations
  - Add/edit/delete allergies
  - Bulk operations for records

## Database Schema

The application uses SQLite as the database with Sequelize ORM. The database consists of four main tables with the following structure:

### Users Table

Stores user account information and pet owners.

| Column     | Type   | Constraints                            | Description                  |
| ---------- | ------ | -------------------------------------- | ---------------------------- |
| `id`       | UUID   | Primary Key, Not Null, Default: UUIDV4 | Unique user identifier       |
| `name`     | STRING | Not Null                               | User's full name             |
| `email`    | STRING | Not Null                               | User's email address         |
| `password` | STRING | Not Null                               | User's password (plain text) |
| `phone`    | STRING | Not Null                               | User's phone number          |
| `address`  | STRING | Not Null                               | User's address               |

### Pets Table

Stores pet information and basic details.

| Column         | Type    | Constraints                                   | Description                                    |
| -------------- | ------- | --------------------------------------------- | ---------------------------------------------- |
| `id`           | UUID    | Primary Key, Not Null, Default: UUIDV4        | Unique pet identifier                          |
| `name`         | STRING  | Not Null                                      | Pet's name                                     |
| `gender`       | ENUM    | Not Null, Values: ['male', 'female', 'other'] | Pet's gender                                   |
| `type`         | STRING  | Not Null                                      | Pet type (cat, dog, bird, rabbit)              |
| `breed`        | STRING  | Nullable                                      | Pet's breed                                    |
| `dateOfBirth`  | DATE    | Not Null                                      | Pet's birth date                               |
| `ownerId`      | INTEGER | Not Null, Foreign Key → Users.id              | Reference to pet owner                         |
| `insurance`    | JSON    | Nullable                                      | Insurance information (provider, policyNumber) |
| `veterinarian` | STRING  | Nullable                                      | Veterinarian contact information               |

### Vaccinations Table

Stores vaccination records for each pet.

| Column    | Type   | Constraints                            | Description                        |
| --------- | ------ | -------------------------------------- | ---------------------------------- |
| `id`      | UUID   | Primary Key, Not Null, Default: UUIDV4 | Unique vaccination identifier      |
| `date`    | DATE   | Not Null                               | Vaccination date                   |
| `vaccine` | STRING | Not Null                               | Vaccine name/type                  |
| `note`    | STRING | Not Null                               | Additional notes about vaccination |
| `petId`   | UUID   | Not Null, Foreign Key → Pets.id        | Reference to pet                   |

### Allergies Table

Stores allergy information for each pet.

| Column     | Type   | Constraints                            | Description                        |
| ---------- | ------ | -------------------------------------- | ---------------------------------- |
| `id`       | UUID   | Primary Key, Not Null, Default: UUIDV4 | Unique allergy identifier          |
| `allergy`  | STRING | Not Null                               | Allergen name/substance            |
| `severity` | STRING | Not Null                               | Severity level (low, medium, high) |
| `reaction` | STRING | Not Null                               | Description of allergic reaction   |
| `note`     | STRING | Nullable                               | Additional notes about allergy     |
| `petId`    | UUID   | Not Null, Foreign Key → Pets.id        | Reference to pet                   |

### Relationships

The database uses the following relationships:

- **Users → Pets**: One-to-Many (One user can have multiple pets)
- **Pets → Vaccinations**: One-to-Many (One pet can have multiple vaccinations)
- **Pets → Allergies**: One-to-Many (One pet can have multiple allergies)

All relationships use CASCADE delete/update constraints, meaning:

- When a user is deleted, all their pets are deleted
- When a pet is deleted, all its vaccinations and allergies are deleted

### Why SQL

This apporach will allow us to add a new list of records quite easily.

Another viable solution is to use NoSQL database like MongoDB, and store all pet records under the pet (or separate collection) as we don't know how stable our data structure will be during the MVP stage

## Seed data

There is an included seed database.

If you want use another one or add few new items, you can call API `http://localhost:3000/api/faker[?count={{count}}][&userId={{userId}}]` where `count` is amount of pets you want to generate and optional userId to generate the data for specific user.

You also can call `http://localhost:3000/api/faker?type=users[&count={{count}}]` to generate users.

Default `count` value is `10` for both APIs.

## Future real implementation improvements

### Authentication & Security

- **OAuth Integration**: Add Google, Facebook, or GitHub login options
- **Password Hashing**: Implement proper password hashing (bcrypt) instead of plain text storage
- **Role-Based Access Control**: Implement granular permissions beyond admin/user roles

### Database & Performance

- **Database Migration**: Move from SQLite to PostgreSQL or MySQL for production
- **Database Migrations**: Implement proper migration system for schema changes
- **Caching**: Add Redis caching for frequently accessed data
- **Database Indexing**: Optimize queries with proper indexing
- **Connection Pooling**: Implement database connection pooling for better performance

### Features & Functionality

- **Pet Photos**: Add image upload and management for pet photos
- **Medical Records**: Expand beyond vaccinations/allergies to include medical history, treatments, medications
- **Export**: Data export functionality (PDF reports, CSV backup)
- **Search Enhancement**: Full-text search across all pet data

### User Experience

- **Advanced Filtering**: More sophisticated filtering and sorting options

### Technical Improvements

- **Microservices**: Break down into microservices architecture
- **API Versioning**: Implement proper API versioning strategy
- **Rate Limiting**: Add API rate limiting and throttling
- **Monitoring**: Implement application monitoring (logs, metrics, alerts)
- **Testing**: Comprehensive test coverage (unit, integration, e2e)
