import axios from 'axios';
import { logger } from '../lib/logger';

const BASE_URL = 'https://api-football-v3.p.rapidapi.com';

export const apiFootballClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-rapidapi-key': process.env.RAPIDAPI_KEY || '',
    'x-rapidapi-host': 'api-football-v3.p.rapidapi.com',
  },
});

export const footballDataClient = axios.create({
  baseURL: 'https://www.football-data.org/api',
  headers: {
    'X-Auth-Token': process.env.FOOTBALL_DATA_API_KEY || '',
  },
});

export const oddsApiClient = axios.create({
  baseURL: 'https://api.the-odds-api.com',
  params: {
    apiKey: process.env.ODDS_API_KEY || '',
  },
})

export const weatherClient = axios.create({
  baseURL: 'https://api.openweathermap.org',
  params: {
    appid: process.env.OPENWEATHER_API_KEY || '',
  },
})
