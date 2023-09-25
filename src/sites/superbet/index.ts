import got from "got"
import { basicInfo, event, betsInfo } from "./types"
const targetURL = "https://production-superbet-offer-ro.freetls.fastly.net/"
const categories = ["2", "4", "5", "11", "20"]


export default class superbet{
    http
    constructor(){
        this.http = got.extend({
            throwHttpErrors:false
        })
    }

    async fetchDailyEvents(){
        const date = new Date()
        const endDate = new Date(date)
        endDate.setDate(endDate.getDate()+1)
    
        const response = await this.http.get(`${targetURL}offer/getOfferByDate?startDate=${date.getFullYear()}-${("0" + (date.getMonth()+1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}&endDate=${endDate.getFullYear()}-${("0" + (endDate.getMonth() + 1)).slice(-2)}-${("0" + endDate.getDate()).slice(-2)}&preselected=1&clientSourceType=android`, {headers:{
            'user-agent':'Romania/3.44.4 (ro.superbet.sport; build:2023052501; Android 7.1.2) okhttp/4.10.0',
        }})

        if(response.statusCode != 200){
            throw new Error(`[${response.statusCode}] ${response.body}`)
        }

        return JSON.parse(response.body) as basicInfo
    }

    async fetchBets(matchId:string){
        const response = await this.http.get(`${targetURL}matches/byId?matchIds=${matchId}&oddsresults=1&clientSourceType=android`, {headers:{
            'user-agent':'Romania/3.44.4 (ro.superbet.sport; build:2023052501; Android 7.1.2) okhttp/4.10.0'
        }})

        if(response.statusCode != 200){
            throw new Error(`[${response.statusCode}] ${response.body}`)
        }

        return JSON.parse(response.body) as betsInfo
    }

    async start(){
        const basicData = await this.fetchDailyEvents()
        const filteredEvents:event[] = []
        basicData.data.forEach(event => {
            if(categories.includes(event.si.toString())){
                filteredEvents.push(event)
            }
        });

        let matchids = ''
        filteredEvents.forEach(event=>{
            matchids = matchids + event._id + ','
        })

        matchids = matchids.slice(0, -1)
        const finalOdds = await this.fetchBets(matchids)
        return finalOdds
    }
}