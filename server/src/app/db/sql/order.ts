
export const setOrder = params => {
    return  ` insert into trans_hashes("send_addr", category, hash, task_id) 
        VALUES ('${params.address}', 6, '${params.hash}', ${params.taskId})`;
}