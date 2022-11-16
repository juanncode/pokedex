import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { RemoteDataSource } from '../../dist/common/interfaces/remote-data-source.interface';
import { AxiosAdapter } from '../common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly httpAdapter: AxiosAdapter
  ) {

  }

  async executeSeed() {
    try {
      await this.pokemonModel.deleteMany({})
      const data = await this.httpAdapter.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=30')
      
      //primera forma de realizar la inserción simultanea

      // --------------------------------
      // const insertPromisesArray = []

      // data.results.forEach(async ({name, url}) => {
      //   const segmentes = url.split('/')
      //   const no: number = +segmentes[segmentes.length - 2]
        
      //   insertPromisesArray.push(
      //     this.pokemonModel.create({name,no})
      //   )
      //   // const pokemon = await this.pokemonModel.create({name, no})
        
      // })

      // await Promise.all(insertPromisesArray);
      // --------------------------------

      //segunda forma de realizar la inserción simultanea

     // --------------------------------
      const pokemonToInsert: {name: string, no: number}[] = []

      data.results.forEach(async ({name, url}) => {
        const segmentes = url.split('/')
        const no: number = +segmentes[segmentes.length - 2]
        
        pokemonToInsert.push({name,no})
      })

      await this.pokemonModel.insertMany(pokemonToInsert)
      // --------------------------------

      return 'Seed execute'
    } catch (error) {
      console.log(error);
      
    }
    
  }
}
