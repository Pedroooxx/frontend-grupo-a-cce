# API Documentation and Integration Guide

This document provides instructions on how to use the Postman collection for testing and integrating with the CCE-AS66A backend API.

## Getting Started

### Prerequisites
- [Postman](https://www.postman.com/downloads/) installed on your computer
- The backend server running (locally or remotely)

### Importing the Collection
1. Open Postman
2. Click on "File" > "Import" or press Ctrl+O (Cmd+O on Mac)
3. Select the `postman-collection.json` file
4. Click "Import"

### Environment Setup
Create an environment to store variables like `baseUrl` and `authToken`:

1. Click the gear icon (⚙️) in the top right corner and select "Manage Environments"
2. Click "Add" to create a new environment
3. Name it (e.g., "CCE-AS66A Local")
4. Add a variable named `baseUrl` with the value of your backend server (default: `http://localhost:3000`)
5. Save the environment
6. Select the environment from the environment dropdown in the top right corner

## Authentication

### Creating a User
1. Use the "Register" endpoint in the Authentication folder
2. Fill in the required user details
3. Send the request

### Logging In
1. Use the "Login" endpoint with the registered user credentials
2. The `authToken` will automatically be saved to your environment variables
3. This token will be used for all endpoints that require authentication

### Logging Out
Use the "Logout" endpoint when you're done with your authenticated session.

## Testing Workflow

Below is a recommended sequence for testing the API:

1. **Authentication**:
   - Register a user
   - Login to get an auth token

2. **User Management**:
   - Get all users
   - Get a specific user
   - Update user information

3. **Championship Creation and Management**:
   - Create a championship
   - Get all championships
   - Get a specific championship
   - Update championship information

4. **Team Management**:
   - Create a team
   - Get all teams
   - Get a specific team

5. **Participants**:
   - Create participants (players/coaches)
   - Associate participants with teams

6. **Subscriptions**:
   - Subscribe teams to championships

7. **Championship Management**:
   - Generate bracket for a championship
   - Get championship matches

8. **Match Management**:
   - Update match results
   - Get match information

9. **Statistics**:
   - Record participant statistics
   - Record championship statistics
   - View statistics reports

## Notes for Frontend Integration

- Use the "Login" endpoint to obtain an authentication token and store it in your frontend application
- Include the token in the `Authorization` header for all requests that require authentication
- Handle token expiration by redirecting to the login page when receiving 401 Unauthorized responses
- Use the structured endpoints to map to your frontend components

## Headers

For authenticated endpoints, include:
```
Authorization: Bearer {{authToken}}
```

For endpoints with request bodies, include:
```
Content-Type: application/json
```

## Common Response Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid input
- **401 Unauthorized**: Authentication required or failed
- **403 Forbidden**: Lacks permission for the requested operation
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side error

## Tips for Effective Testing

1. Test the authentication flow first
2. Create test data in the correct order (users → teams → championships → participants → subscriptions)
3. Test both positive and negative scenarios
4. Verify validation rules are enforced
5. Check ownership restrictions are properly applied

## Collection Maintenance

Update the collection when API endpoints change:

1. Right-click on the collection in Postman
2. Select "Export"
3. Save the updated JSON file
