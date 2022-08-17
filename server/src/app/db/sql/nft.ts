export const setNftlist = (params,obj) => {
    let sql = `INSERT INTO nfts (info,create_time,issuer,erc_type,chain)
    VALUES `
    params.map((e,i) => {
        i+1 === params.length ? 
            sql += `('${JSON.stringify(e)}',${Date.now()},'${obj.account}','${obj.erc_type}','${obj.chain}');`
            :
            sql += `('${JSON.stringify(e)}',${Date.now()},'${obj.account}','${obj.erc_type}','${obj.chain}'),`
    })
    
    return sql
}

export const getNftlist = params => {
    let sql = ` SELECT * FROM nfts WHERE issuer = '${params}'`
    return sql
}