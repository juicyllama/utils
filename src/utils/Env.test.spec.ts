import * as path from 'path';

import { Env } from './Env';
describe('Env', () => {
    it('setEnvValue', () => {
        Env.setEnvValue({
            key: 'NODE_ENV',
            value: 'development',
            envPath: './',
            fileName: path.resolve(__dirname, 'env.env'),
        });
    });

    it('getEnvValue', () => {
        const result = Env.getEnvValue({
            key: 'NODE_ENV',
            envPath: './',
            fileName: path.resolve(__dirname, 'env.env'),
        });
        expect(result).toEqual('development');
    });
});
