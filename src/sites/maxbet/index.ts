import got from "got"
import { basicInfo, betsInfo } from "./types"

//https://sports-sm-distribution-api.de-2.nsoftcdn.com/api/v1/events/1200710?companyUuid=2191e3d6-b0e1-4f06-8b6a-4683203fb2fe&id=1200710&language=%7B%22default%22:%22ro%22,%22events%22:%22ro%22,%22sport%22:%22ro%22,%22category%22:%22ro%22,%22tournament%22:%22ro%22,%22team%22:%22ro%22,%22market%22:%22ro%22%7D&timezone=Europe%2FBucharest&dataFormat=%7B%22default%22:%22array%22,%22markets%22:%22array%22,%22events%22:%22array%22%7D
export default class maxbet{
    http
    constructor(){
        this.http = got.extend({
            throwHttpErrors:false 
        })
    }

    async fetchDailyEvents(){
        const date = new Date()
        const response = await this.http.get(`https://sports-sm-distribution-api.de-2.nsoftcdn.com/api/v1/events?deliveryPlatformId=3&dataFormat=%7B%22default%22:%22object%22,%22events%22:%22array%22,%22outcomes%22:%22array%22%7D&language=%7B%22default%22:%22ro%22,%22events%22:%22ro%22,%22sport%22:%22ro%22,%22category%22:%22ro%22,%22tournament%22:%22ro%22,%22team%22:%22ro%22,%22market%22:%22ro%22%7D&timezone=Europe%2FBucharest&company=%7B%7D&companyUuid=2191e3d6-b0e1-4f06-8b6a-4683203fb2fe&filter[from]=${date.getFullYear()}-${("0" + (date.getMonth()+1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}T${date.getHours()}:00:00&sort=startsAt,categoryPosition,categoryName,tournamentPosition,tournamentName&offerTemplate=WEB_OVERVIEW&shortProps=1`, {headers:{
            'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.7",
            "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Brave\";v=\"114\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "sec-gpc": "1",
            "Referer": "https://smprematch.7platform.net/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        }})

        if(response.statusCode != 200){
            throw new Error(`[${response.statusCode}] ${response.body}`)
        }
        return JSON.parse(response.body) as basicInfo  
    }

    async fetchBets(matchId:string){
        const response = await this.http.get(`https://sports-sm-distribution-api.de-2.nsoftcdn.com/api/v1/events/${matchId}?companyUuid=2191e3d6-b0e1-4f06-8b6a-4683203fb2fe&id=${matchId}&language=%7B%22default%22:%22ro%22,%22events%22:%22ro%22,%22sport%22:%22ro%22,%22category%22:%22ro%22,%22tournament%22:%22ro%22,%22team%22:%22ro%22,%22market%22:%22ro%22%7D&timezone=Europe%2FBucharest&dataFormat=%7B%22default%22:%22array%22,%22markets%22:%22array%22,%22events%22:%22array%22%7D`, {headers:{
            'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.7",
            "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Brave\";v=\"114\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "sec-gpc": "1",
            "Referer": "https://smprematch.7platform.net/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        }})

        if(response.statusCode != 200){
            throw new Error(`[${response.statusCode}] ${response.body}`)
        }

        return JSON.parse(response.body) as betsInfo
    }

    async start(){
        const basicData = await this.fetchDailyEvents()
        const promises:Promise<betsInfo>[] = [];
        let finalOdds:betsInfo[] = []
        basicData.data.events.forEach(event=>{
            promises.push(this.fetchBets(event.a.toString()))
        })

        await Promise.all(promises).then(results=>{
            finalOdds = results
        })

       return finalOdds
    }
}
