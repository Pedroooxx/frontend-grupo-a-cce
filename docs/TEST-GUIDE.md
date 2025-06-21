# CCE-AS66A API Testing Guide

## Environment Variables

Create a new environment in Postman with these variables:

| Variable    | Initial Value           | Description                                |
|-------------|-------------------------|--------------------------------------------|
| baseUrl     | http://localhost:3000   | The base URL of the API                    |
| authToken   | (leave empty)           | Will be automatically filled after login   |

## Test Sequences

Below are step-by-step test sequences to validate different aspects of the application:

### Authentication Flow
1. Register a new user (POST /auth/register)
2. Login with the new user (POST /auth/login)
3. Test an authenticated endpoint (e.g., POST /teams)
4. Logout (POST /auth/logout)
5. Test the same authenticated endpoint again to verify it fails

### Championship Management Flow
1. Login
2. Create a new championship (POST /championships)
3. Create teams (POST /teams)
4. Add participants to teams (POST /participants)
5. Create subscriptions for teams to join the championship (POST /subscriptions)
6. Generate bracket (POST /championships/{id}/generate-bracket)
7. View championship matches (GET /championships/{id}/matches)
8. Update match results (PUT /championships/{id}/matches/bulk-update)
9. Generate next phase (POST /championships/{id}/generate-next-phase)

### Team Statistics Flow
1. Login
2. Create a team and championship
3. Add participants to the team
4. Subscribe to championship
5. Generate bracket and record match results
6. Create participant statistics for matches (POST /participant-stats)
7. View team statistics (GET /participant-stats/team/{teamId}/stats)
8. View championship statistics (GET /championship-stats/overview/{id}/teams)

### Player Statistics Flow
1. Create participant statistics for multiple matches
2. View player statistics (GET /participant-stats/player/{playerId})
3. View top players (GET /participant-stats/top-players/{championshipId})

## Expected Outcomes

The following table shows expected status codes for each endpoint:

| Endpoint                                   | Method | Success   | Common Error Codes      |
|--------------------------------------------|--------|-----------|-------------------------|
| /auth/register                             | POST   | 201       | 400 (validation error)  |
| /auth/login                                | POST   | 200       | 401 (invalid credentials) |
| /auth/logout                               | POST   | 200       | 401 (not authenticated) |
| /users                                     | GET    | 200       | -                       |
| /users/{id}                                | GET    | 200       | 404 (not found)         |
| /users/{id}                                | PUT    | 200       | 401, 400                |
| /users/{id}                                | DELETE | 200       | 401, 404                |
| /championships                             | POST   | 201       | 401, 400                |
| /championships                             | GET    | 200       | -                       |
| /championships/{id}                        | GET    | 200       | 404                     |
| /championships/{id}                        | PUT    | 200       | 401, 400, 404           |
| /championships/{id}                        | DELETE | 200       | 401, 404                |
| /championships/{id}/generate-bracket       | POST   | 200       | 401, 404                |
| /championships/{id}/matches                | GET    | 200       | 404                     |
| /championships/{id}/matches/bulk-update    | PUT    | 200       | 401, 400, 404           |
| /teams                                     | POST   | 201       | 401, 400                |
| /teams                                     | GET    | 200       | -                       |
| /teams/{teamId}                            | GET    | 200       | 404                     |
| /teams/{teamId}                            | PUT    | 200       | 401, 400, 404           |
| /teams/{teamId}                            | DELETE | 200       | 401, 404                |
| /teams/{teamId}/validate                   | GET    | 200       | 404                     |

## Common Issues and Troubleshooting

1. **Authentication Issues**
   - Check if token is properly set in environment
   - Verify token hasn't expired
   - Ensure Authorization header is correctly formatted

2. **Validation Errors**
   - Review schema requirements in request body
   - Check error message for specific validation issues

3. **Entity Relationships**
   - Ensure IDs referenced in requests actually exist
   - Check that referenced entities are in the correct state

4. **Performance Issues**
   - Consider pagination for endpoints returning large collections
   - Monitor response times for optimization opportunities
   
## Frontend Integration Notes

1. Store authentication token in secure storage (e.g., HttpOnly cookies, localStorage with proper security)
2. Implement token refresh mechanisms for long sessions
3. Use interceptors to automatically include the token in requests
4. Handle common error codes with appropriate UI feedback
5. Implement form validation that matches backend validation requirements
