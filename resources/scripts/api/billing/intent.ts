import http from '@/api/http';

export interface PaymentIntent {
    id: string;
    secret: string;
}

interface UpdatePaymentIntent {
    id: number;
    node_id?: number;
    intent: string;
    vars?: { key: string, value: string }[];
    serverId?: number;
}

export const getIntent = (id: number, renewal?: boolean): Promise<PaymentIntent> => {
    return new Promise((resolve, reject) => {
        http.post(`/api/client/billing/products/${id}/intent`, { renewal })
            .then(({ data }) => resolve(data))
            .catch(reject);
    });
};

export const updateIntent = ({ id, intent, node_id, vars, serverId }: UpdatePaymentIntent): Promise<void> => {
    return new Promise((resolve, reject) => {
        http.put(`/api/client/billing/products/${id}/intent`, { intent, node_id, variables: vars, server_id: serverId })
            .then(() => resolve())
            .catch(reject);
    });
};
