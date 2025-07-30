import { Header } from '../types/commonTypes';
import { Param } from '../types/commonTypes';

export const DRAWERWIDTH = 240;
export const METHODS = ['GET', 'POST', 'PUT', 'DELETE'] as const;

export const EMPTY_HEADER: Header = { key: '', value: '', enabled: true };
export const EMPTY_PARAM: Param = { key: '', value: '' };
