import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios

  async executeSeed() {
    try {
      const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=6')

      data.results.forEach(({name, url}) => {
        const segmentes = url.split('/')
        const nro: number = +segmentes[segmentes.length - 2]
        console.log({name, nro});
        
      })
    return data.results
    } catch (error) {
      console.log(error);
      
    }
    
  }
}
