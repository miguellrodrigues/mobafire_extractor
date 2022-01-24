import axios from 'axios';

const url = 'https://ddragon.leagueoflegends.com/';

const api = axios.create({
  baseURL: url,
});

export default api;