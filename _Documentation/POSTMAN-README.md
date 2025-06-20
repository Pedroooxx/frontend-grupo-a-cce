# CCE-AS66A API Postman Collection

This repository contains a comprehensive Postman collection for testing and integrating with the CCE-AS66A backend API. This collection covers all available endpoints and provides examples of typical usage scenarios.

## Files Included

- `postman-collection.json` - The main Postman collection file that can be imported into Postman
- `API-DOCUMENTATION.md` - Detailed documentation about using the API and integration guidelines
- `TEST-GUIDE.md` - Suggested test sequences and expected outcomes for API testing

## Quick Start

### Importing the Collection

1. Download and install [Postman](https://www.postman.com/downloads/) if you haven't already
2. Open Postman
3. Click on "File" > "Import" or press Ctrl+O (Cmd+O on Mac)
4. Select the `postman-collection.json` file from this repo
5. The collection will be imported with all endpoints organized into folders

### Setting Up Environment Variables

1. Click the gear icon in the top right corner
2. Select "Add" to create a new environment
3. Name it (e.g., "CCE-AS66A Development")
4. Add the following variables:
   - `baseUrl` (Initial value: `http://localhost:3000`)
   - `authToken` (Leave initial value empty)
5. Save the environment
6. Select it from the environment dropdown in the top right corner

### Authentication Flow

1. Use the "Register" request in the Authentication folder to create a new user
2. Use the "Login" request to authenticate and receive a token
   - The token will automatically be saved to your environment variables
3. All requests that require authentication will now work with this token

## API Structure

The API is organized into the following resource categories:

1. **Authentication** - User registration, login, and logout
2. **Users** - User management endpoints
3. **Championships** - Championship creation and management
4. **Teams** - Team management endpoints
5. **Agents** - Agent management endpoints
6. **Matches** - Match management endpoints
7. **Subscriptions** - Team subscription to championships
8. **Participants** - Participant (player/coach) management
9. **Participant Statistics** - Match-specific participant statistics
10. **Championship Statistics** - Aggregated championship-level statistics

## Integration with Frontend

For detailed instructions on integrating this API with your frontend application, please refer to the `API-DOCUMENTATION.md` file.

## Testing Guidelines

For recommended testing sequences and expected outcomes, check the `TEST-GUIDE.md` file.

## Troubleshooting

If you encounter issues:

1. Ensure the backend server is running
2. Verify your environment variables are set correctly
3. Make sure you've logged in for endpoints requiring authentication
4. Check request bodies match the required schema
