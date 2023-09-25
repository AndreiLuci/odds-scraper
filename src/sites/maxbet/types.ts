export interface basicInfo{
    data:{
        events:[
            {
                a:number,
                b:number,
                j:string,
                k:string,
                n:string
            }
        ]
    }
}

export interface betsInfo{
    data:{
        id:number,
        sportId:number,
        name:string,
        description:string,
        startsAt:string,
        active:boolean,
        markets:[
            {
                id:number,
                marketId:number,
                name:string,
                outcomes:[
                    {
                        id:number,
                        name:string,
                        odd:number
                    }
                ]
            }
        ]
    }
}