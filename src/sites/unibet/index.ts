import got from "got"
import { basicInfo, betsInfo } from "./types"
import { tryRetry } from "../../utils/others"
const categories = ['football','basketball','tennis','baseball','handball']

export default class unibet{
    http
    constructor(){
        this.http = got.extend({
            throwHttpErrors:false,
            timeout:2000
        })
    }

    async fetchDailyEvents(category:string){
        const response = await this.http.get(`https://eu-offering-api.kambicdn.com/offering/v2018/ubro/listView/${category}.json?lang=ro_RO&market=RO&client_id=2&channel_id=1&ncid=${Date.now()}&useCombined=true`, {headers:{
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            "accept-language": "en-US,en;q=0.7",
            "cache-control": "max-age=0",
            "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Brave\";v=\"114\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "sec-gpc": "1",
            "upgrade-insecure-requests": "1",
            'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        }})

        if(response.statusCode != 200){
            throw new Error(`[${response.statusCode}] ${response.body}`)
        }
        return JSON.parse(response.body) as basicInfo
    }

    async fetchBets(matchId:string){
        const response = await this.http.get(`https://eu-offering-api.kambicdn.com/offering/v2018/ubro/betoffer/event/${matchId}.json?lang=ro_RO&market=RO&client_id=2&channel_id=1&ncid=${Date.now()}&includeParticipants=true`, {headers:{
            'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
        }})

        if(response.statusCode != 200){
            throw new Error(`[${response.statusCode}] ${response.body}`)
        }

        return JSON.parse(response.body) as betsInfo
    }

    async start(){
        const basicData:basicInfo[] = []
        let finalOdds:betsInfo[] = []

        for(let x=0; x<categories.length; x++){
            const data = await this.fetchDailyEvents(categories[x])
            basicData.push(data)
        }
        const filterDate = new Date()
        filterDate.setDate(filterDate.getDate()+2)
        basicData.forEach((data)=>{
            data.events.forEach((event,index)=>{
                const date = new Date(event.event.start)
                if(date>filterDate){
                    data.events.splice(index,1)
                }
            })
        })

        const promises:Promise<betsInfo>[] = [];

        basicData.forEach(event=>{
            event.events.forEach(match=>{
                promises.push(tryRetry(()=> this.fetchBets(match.event.id.toString()),{
                    maxTries:10,
                    delay:0
                }))
            })
        })

        await Promise.all(promises).then(results=>{
            finalOdds = results
        })

        console.log(finalOdds)
    }


}



