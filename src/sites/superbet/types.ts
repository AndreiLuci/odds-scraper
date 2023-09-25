export interface event {
    uuid:string,
    mn:string,
    msn:string,
    _id:number,
    si:number
}

export interface basicInfo{
    data:event[]
}

export interface betsInfo{
    data:[
        {
            odds:[{
                bgi:number,
                ov:number,
                os:string
            }]
        }
    ]
}