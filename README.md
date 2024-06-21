# Project Setup

Follow these steps to set up and run the project:

## Installation

1. Clone the repository to your local machine.
2. Navigate to the project directory.

```bash
cd project-directory
```

3. Install the necessary dependencies:

```bash
npm install
```

## Database Seeding

Before running the project, create and seed the database with initial data:

```bash
npm run seed
```

## Running the Project

Start the development server:

```bash
npm run dev
```

## Environment Variables

Make sure to create a `.env` file in the root directory of the project with the following variables:

```
JWT_SECRET
PORT
TEST_USER_EMAIL
TEST_USER_PASSWORD
TEST_CONTACT_ID
TEST_USER_ID
```

Make sure to replace the placeholder values with the actual values as needed.
