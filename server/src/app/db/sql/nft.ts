export const setNftlist = (params,obj) => {
    let sql = `INSERT INTO nfts (info,account,chain,erc_type,create_time) VALUES `
    if (params.length > 0) {
        params.map((e,i) => {
        sql += `('${JSON.stringify(e)}','${obj.account}','${obj.chain}','${obj.erc_type}',${Date.now()})`

        i+1 === params.length ? sql += `;` : sql += `,`
        })
    }else{
        sql += `(null,'${obj.account}','${obj.chain}','${obj.erc_type}',${Date.now()});`
    }
    return sql
}

export const getNftlist = params => {
    let sql = ` SELECT * FROM nfts WHERE account = '${params}'`
    return sql
}