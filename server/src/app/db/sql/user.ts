export const setMyInfo = params => {
    let sql = `INSERT INTO users (address, username, avatar, telegram, wechat, skype, role)
        VALUES ('${params.address}', '${params.username}', '${params.avatar}', '${params.telegram}',
            '${params.wechat}', '${params.skype}', '{${params.role}}'
        )
    `;
    return sql
}

export const modifyMyInfo = params => {
    let sql = `update users SET username='${params.username}', avatar='${params.avatar}', telegram='${params.telegram}',
    wechat='${params.wechat}', skype='${params.skype}', role='{${params.role}}' WHERE address = '${params.address}'
    `;
    return sql
}

export const getMyInfo = (params) => {
    let sql = `SELECT * FROM public."users" WHERE address = '${params}'`
    return sql
}

export const modifyContacts = params => {
    let sql = `update users SET ${params.contactName} = '${params.contactValue}' where address = '${params.address}'`;
    return sql
}

export const setContacts = params => {
    let sql = `INSERT INTO users (address, ${params.contactName})
        VALUES ('${params.address}', '${params.contactValue}')`;
    return sql
}