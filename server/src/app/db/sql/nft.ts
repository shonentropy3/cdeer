export const setNftlist = params => {
    let sql = `INSERT INTO nfts (info,account,chain,erc_type,create_time) VALUES `
    if (params.data.length > 0) {
        params.data.map((e,i) => {
        sql += `('${JSON.stringify(e)}','${params.account}','${params.chain}','${params.erc_type}',${Date.now()})`

        i+1 === params.data.length ? sql += `;` : sql += `,`
        })
    }else{
        sql += `(null,'${params.account}','${params.chain}','${params.erc_type}',${Date.now()});`
    }
    return sql
}

export const updateNftlist = (params) => {
    let sql = `UPDATE nfts set info = `
    if (params.data.length > 0) {
        params.data.map((e,i) => {
            sql += `('${JSON.stringify(e)}'),`
    
            // i+1 === params.data.length ? sql += `;` : sql += `,`
            })
    }else{
        sql += `(null),`
    }
    sql += ` create_time = ${Date.now()} where account = '${params.account}' and erc_type = '${params.erc_type}'`
    
    return sql
}

export const hasNft = params => {
    let sql = `SELECT * FROM nfts WHERE account = '${params}'`
    return sql
}

export const isOutTime = params => {
    let sql = `SELECT * FROM nfts WHERE account = '${params.account}' and create_time <= ${params.time}`
    return sql
}

export const getCacheNfts = params => {
    let sql = `SELECT * FROM nfts WHERE account = '${params.account}'`
    return sql
}