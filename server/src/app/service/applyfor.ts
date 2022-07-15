import { Body, Injectable } from '@nestjs/common';

@Injectable()
export class ApplyforService {



    // : Promise<Project[]>
    async apply(@Body() body: any)  {
        let sql = `					 
            insert into table(pro_id,address,count,hash) 
            VALUES ('');
        `;
        // return await this.projectRepository.query(sql)
        return body
    }
}
