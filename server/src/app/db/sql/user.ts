export const setMyInfo = params => {
    let sql = `INSERT INTO users (address, username, avatar, telegram, wechat, skype, discord, phone, role)
        VALUES ('${params.address}', '${params.username}', '${params.avatar}', '${params.telegram}',
            '${params.wechat}', '${params.skype}', '${params.discord}', '${params.phone}', '{${params.role}}'
        )
    `;
    return sql
}

export const modifyMyInfo = params => {
    let sql = `update users SET username='${params.username}', avatar='${params.avatar}', telegram='${params.telegram}',
    wechat='${params.wechat}', skype='${params.skype}', discord='${params.discord}', phone='${params.phone}' role='{${params.role}}' WHERE address = '${params.address}'
    `;
    return sql
}

export const getMyInfo = (params) => {
    let sql = `SELECT * FROM public."users" WHERE address = '${params}'`
    return sql
}

export const modifyContacts = params => {
    let sql = `update users SET 
    telegram = '${params.contact.telegramValue}' , 
    wechat = '${params.contact.wechatValue}' , 
    skype = '${params.contact.skypeValue}' , 
    discord = '${params.contact.discordValue}' , 
    phone = '${params.contact.phoneValue}'
    where address = '${params.address}'`;
    return sql
}

export const setContacts = params => {
    let sql = `INSERT INTO users (address, telegram, wechat, skype, discord, phone)
        VALUES ('${params.address}', '${params.contact.telegramValue}', '${params.contact.wechatValue}',
        '${params.contact.skypeValue}', '${params.contact.discordValue}', '${params.contact.phoneValue}')`;
        
    return sql
}