import axios from 'axios';

// API-Football client
export const apiFootballClient = axios.create({
  baseURL: 'https://v3.football.api-sports.io',
  headers: {
    'x-apisports-key': process.env.API_FOOTBALL_KEY || 'your_api_key_here',
  },
});

// Football-Data.org client
export const footballDataClient = axios.create({
  baseURL: 'https://api.football-data.org/v4',
  headers: {
    'X-Auth-Token': process.env.FOOTBALL_DATA_KEY || 'your_api_key_here',
  },
});

// Odds API client
export const oddsApiClient = axios.create({
  baseURL: 'https://api.the-odds-api.com/v4',
  params: {
    apiKey: process.env.ODDS_API_KEY || 'your_api_key_here',
  },
});

export default {
  apiFootballClient,
  footballDataClient,
  oddsApiClient,
};
