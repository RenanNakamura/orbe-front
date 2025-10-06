import {axiosInstance} from './BaseService';
import {AxiosResponse} from 'axios';
import {environment} from '../../../../environments/environment';

const _api = 'api/v1/tag';

export const TagService = {

    findAll: async (): Promise<AxiosResponse> => {
        try {
            return await axiosInstance.get(`${environment.buddy}/${_api}`);
        } catch (e) {
            console.error(`Error fetching tags`, e);
            throw e;
        }
    },

};
