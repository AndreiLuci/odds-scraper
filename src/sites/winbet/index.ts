import got from "got"
import {categoriesMarkets, categoryEvents, eventData} from "./types"
const categories = [
    1001,
    1002,
    1003,
    1004,
    1005,
    1006,
    1020,
    1023,
    1010,
    1012,
    1013,
    1016,
    1029,
    1117,
    1137,
]

export default class winbet{
    http
    constructor(){
        this.http = got.extend({
            throwHttpErrors:false,
            timeout:2000
        })
    }

    async fetchDailyEvents(category:number, market:number){
        const response = await this.http.get(`https://winbet-ro-api.egt-digital.com/api/sportsapi/public/sport-events/upcoming/${category}/${market}/false/48`, {headers:{
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Brave\";v=\"114\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "sec-gpc": "1",
            "x-platform-device": "desktop",
            "x-platform-exp": "1686653200",
            "x-platform-hash": "7wm9xUus8asqgbfehcHmMA",
            "x-platform-lang": "ro",
            "x-platform-tz": "180",
            "Referer": "https://winbet.ro/",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        }})

        if(response.statusCode != 200){
            throw new Error(`[${response.statusCode}] ${response.body}`)
        }

        return JSON.parse(response.body) as categoryEvents

    }

    async fetchMarkets(category:number){
        const response = await this.http.get(`https://winbet-ro-api.egt-digital.com/api/sportsapi/public/market-templates/upcoming/${category}/24`, {headers:{
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Brave\";v=\"114\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "sec-gpc": "1",
            "x-platform-device": "desktop",
            "x-platform-exp": "1686653722",
            "x-platform-hash": "O0YE2mIJeD-gzI81WyNxCw",
            "x-platform-lang": "ro",
            "x-platform-tz": "180",
            "Referer": "https://winbet.ro/",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        }})

        if(response.statusCode != 200){
            throw new Error(`[${response.statusCode}] ${response.body}`)
        }
        return JSON.parse(response.body) as categoriesMarkets
    }

    async fetchEventData(eventId:number){
        const response = await this.http.get(`https://winbet-ro-api.egt-digital.com/api/sportsapi/public/sport-events/eventview/normalized/${eventId}`, {headers:{
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Brave\";v=\"114\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "sec-gpc": "1",
            "x-platform-device": "desktop",
            "x-platform-exp": "1686656276",
            "x-platform-hash": "IXhfieRLUcLAnuQcwcHMdw",
            "x-platform-lang": "ro",
            "x-platform-tz": "180",
            "Referer": "https://winbet.ro/",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        }})

        if(response.statusCode != 200){
            throw new Error(`[${response.statusCode}] ${response.body}`)
        }

        return JSON.parse(response.body) as eventData
    }

    async start(){

        const finalOdds:eventData[][] = []
        for(let x=0;x<categories.length;x++){
            const marketsIds = await this.fetchMarkets(categories[x])
            const categoryEvents = await this.fetchDailyEvents(categories[x], marketsIds.allMatches.topMarkets[0].id)
            const categoryEventsPromise:Promise<eventData>[] = []
            
            categoryEvents.sections.forEach(category=>{
                category.data.forEach(eventId=>{
                    categoryEventsPromise.push(this.fetchEventData(eventId.eventId))
                })
            })
            await Promise.all(categoryEventsPromise).then(results=>{
                finalOdds.push(results)
            })

            
            
        }
        // const marketsIds = await this.fetchMarkets(categories[0])

        // const categoryEvents = await this.fetchDailyEvents(categories[0], marketsIds.allMatches.topMarkets[0].id)
        // const categoryEventsIds:number[] = []

        // categoryEvents.sections.forEach(category=>{
        //     category.data.forEach(eventId=>{
        //         categoryEventsIds.push(eventId.eventId)
        //     })
        // })

        // const eventOdds = await this.fetchEventData(categoryEventsIds[0])

    }



}



