
// import fs from 'fs'
 // fs.writeFile("test.json", response.body, function(err) {
        //     if(err) {
        //         return console.log(err);
        //     }
        //     console.log("The file was saved!");
        // }); 

import got from "got"
import { basicInfo, betsInfo, competitions, match } from "./types"
const targetURL = "https://m.casapariurilor.ro/api/v4_17_0/prematch/leagues/competition/"
const categories = ["MCP3","MCP4","MCP283","MCP26","MCP30"]

export default class casa{
    http
    constructor(){
        this.http = got.extend({
            throwHttpErrors:false 
        })
    }

    async fetchDailyEvents(){
        const response = await this.http.get(`${targetURL}matches`, {headers:{
            'user-agent':'APP 3.37.6; AN 7.1.2',
            'x-filterid':'today',
            'x-sportids': ''
        }})

        if(response.statusCode != 200){
            throw new Error(`[${response.statusCode}] ${response.body}`)
        }
        return JSON.parse(response.body) as basicInfo[]     
    }

    async fetchBets(matchId:string){
        const response = await this.http.get(`${targetURL}match/${matchId}`, {headers:{
            'user-agent':'APP 3.37.6; AN 7.1.2'
        }})

        if(response.statusCode != 200){
            throw new Error(`[${response.statusCode}] ${response.body}`)
        }

        return JSON.parse(response.body) as betsInfo
    }

    async start(){
        const filteredCompetitions:competitions[][] = []
        const basicData = await this.fetchDailyEvents()
        let finalOdds:betsInfo[] = []
        basicData.forEach(event=>{
            if(categories.includes(event.sportId)){
                filteredCompetitions.push(event.competitions)
            }
        })
        
        const allMatches:match[][] = []
        filteredCompetitions.forEach(competition => {
           competition.forEach(liga=>{
            allMatches.push(liga.matches)
           })
        })
      
        const promises:Promise<betsInfo>[] = [];

       
        allMatches.forEach(match=>{
          match.forEach(game=>{
            promises.push(this.fetchBets(game.matchId))
          })
        })
          
        await Promise.all(promises).then(results=>{
            finalOdds = results
        })


        return finalOdds
    }
}
