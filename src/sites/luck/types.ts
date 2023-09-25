export interface categoriesInfo{
    sps:[
        {
            id:number,
            dsl:{
                EN:string,
                RO:string
            },
            cts:[
                {
                    id:number,
                    dsl:{
                        EN:string,
                        RO:string
                    },
                    tns:[
                        {
                            id:number,
                            dsl:{
                                EN:string,
                                RO:string
                            },
                            ags:number[],
                            ba:number,
                        }
                    ]
                }
            ]
        }
    ]
}

export interface bet{
            cs:number,
            h:number,
            dia:number,
            eqs:[
                {
                    ce:number,
                    q:number,
                    dsl:string|null
                }
            ]
}

export interface tournament{

            p:number,
            a:number,
            bid:number,
            dsl:{
                EN:string,
                RO:string
            },
            scs:bet[],
            om:number,
            is:number,
            ts:string,
            oa:number,
            it:number,
            al:string,
            cida:number,
            cidh:number,
            gid:number,
            lv:boolean,
            pl:number,
            r:number

    
}

export interface basicInfo{
    avs:[
        tournament
    ],
    ags:number[]
}

export interface betsInfo{
    scs:[
       bet
    ],
    ts:string,
}

export interface scommesse{
    id:number,
    desc:string,
    aggId:number,
    handicap:number,
    ranking:number,
    odds:{
        id:number,
        desc:string,
        tooltip:string,
        value:number
    }[]
}

export interface compattate{
    [key:string]:string[]
}

export interface betData{
    idAggregata: number,
    descrizione:string,
    ranking:number,
    isPrincipale:boolean,
    scommesse:scommesse[],
    compattate:compattate[]
    sportId:number
}

export interface oddsOutcome{
    title:string,
    id:number,
    odds:
        {
            scoreDescription:string,
            value:number,
            odd:{ce:number, q:number, dsl:any}
        }[]
    
}

export interface matchData{
    sportRef: number,
    tournamentRef : number,
    pal: number,
    avv: number,
    id: number,
    desc: string,
    uniqueId:number,
    alias: string,
    timestamp: string,
    isLive:boolean,
}

