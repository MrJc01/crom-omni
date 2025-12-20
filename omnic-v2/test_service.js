// @service interface: PaymentGateway - RPC Client Proxy
const PaymentGateway = {
    async process(amount, currency) {
        const response = await fetch("http://payment-api:3000/PaymentGateway/process", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: amount, currency: currency })
        });
        return await response.json();
    },
    async refund(transaction_id) {
        const response = await fetch("http://payment-api:3000/PaymentGateway/refund", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ transaction_id: transaction_id })
        });
        return await response.json();
    },
    async get_balance(account_id) {
        const response = await fetch("http://payment-api:3000/PaymentGateway/get_balance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ account_id: account_id })
        });
        return await response.json();
    },
};

