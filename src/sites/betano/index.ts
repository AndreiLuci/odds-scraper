import got from "got"

import { betsInfo } from "./types"

const categories = ['TENN', 'BASK', 'HAND', 'FOOT', 'BASE']

function buildURL(category:string){
    return `https://api-android-ro.betano.com/v3/api/league/upcoming/${category}?hours=24&addNextHoursTabs=true&sort=Leagues`
}

export default class betano{
    http
    constructor(){
        this.http = got.extend({
            throwHttpErrors:false 
        })
    }

    async fetchDailyEvents(category:string){
        const response = await this.http.get(buildURL(category), {headers:{
            'user-agent':'Android:API:25_Model:samsungSM-N975FSM-N975F_AppCode:309_AppName:3.38.1_Package:com.kaizengaming.betano_Product:sportsbook_DID:3939b42347abfcd4',
            'content-type':'application/json; charset=utf-8'
        }})

        if(response.statusCode != 200){
            throw new Error(`[${response.statusCode}] ${response.body}`)
        }
        return JSON.parse(response.body) as betsInfo
    }

    async start(){
        let basicData:betsInfo[] = []
        const promises:Promise<betsInfo>[] = [];
        categories.forEach(category=>{
            promises.push(this.fetchDailyEvents(category))
        })

        await Promise.all(promises).then(results=>{
            basicData = results
        })

        return basicData
    }
}