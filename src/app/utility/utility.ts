import { environment } from "src/environments/environment";

/**
 * name
 */
export class Utility {
    getImageUrl(overviewfiles: any): string| null{
        if(overviewfiles.length > 0){
            const imgObj = overviewfiles[0];
            if(imgObj && imgObj.fileurl){
                  return imgObj.fileurl.replace('/webservice','');  
            }
        }
       return null;
    }

    getToken(): any{
       
        return environment.adminToken;
    }
}