export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Football Match Score Tracker API',
    version: '1.0.0'
  },
  paths: {
    '/api/teams': {
      get: {
        summary: 'Get all active teams'
      },
      post: {
        summary: 'Create or restore a team',
        description: "JSON Body: { 'name': 'Team Name' }"
      }
    },
    '/api/teams/{id}': {
      delete: {
        summary: 'Soft-delete a team by ID'
      }
    },
    '/api/matches': {
      get: {
        summary: 'Get all matches'
      },
      post: {
        summary: 'Start a new match',
        description: "JSON Body: { 'team1_id': 'id', 'team2_id': 'id' }"
      }
    },
    '/api/matches/{id}': {
      get: {
        summary: 'Get a match details'
      },
      delete: {
        summary: 'Soft-delete a match by ID'
      }
    },
    '/api/matches/{id}/goals': {
      post: {
        summary: 'Increment goal count',
        description: "JSON Body: { 'team': '1' } or { 'team': '2' }"
      },
      delete: {
        summary: 'Decrement goal count (revert mis-click)',
        description: "JSON Body: { 'team': '1' } or { 'team': '2' }"
      }
    },
    '/api/matches/{id}/finish': {
      patch: {
        summary: 'Mark match as finished'
      }
    }
  }
};
