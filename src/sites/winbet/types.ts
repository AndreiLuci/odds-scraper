export interface categoriesMarkets{
    allMatches:{
        topMarkets:[
            {
                id:number,
                name:string,
                marketTemplatePath:string
            }
        ]
    }
}

export interface categoryEvents{
    sections:[
        {
            data:[
                {
                    eventId:number
                }
            ]
        }
    ]
}

export interface eventData{
    marketsData:{
        [key:string]:{
            outcomes:[
                {
                    name:string
                    title:string,
                    odds:number,
                    americanOdds:number
                }
            ],
            title:string,
            customBet:false
        }
    }
    eventTitle:string,
    startTime:string
}