export interface match{
    matchId:string,
    name:string,
    participantH1:string,
    participantA1:string
}

export interface competitions{
    competitionId:string,
    nameCompetition:string
    matches: match[]
}
export interface basicInfo{
    nameSport:string,
    nameLeague:string,
    sportId:string,
    competitions:competitions[]
}

export interface betsInfo{
    matchId:string,
    markets:[
        {
            marketId:string,
            nameMarket:string,
            odds:[
                {
                    nameOdds:string
                    value:number,
                    displayType:string
                }
            ]
        }
    ]
}