export const Fetch = async (endpoint) => {
    try {
        const res = await api.get(endpoint);
        return "ทดสอบ"
    } catch (e) {
        console.log(e);
    }
};

export const Update = async (endpointID, formUpdate) => {
    try {
        const res = await api.put(endpointID, formUpdate);
    } catch (e) {
        console.log(e);
    }
}

export const Insert = async (endpoint, formInsert) => {
    try {
        const res = await api.port(endpoint, formInsert);
    } catch (e) {
        console.log(e);
    }
}

export const Delete = async (endpointID) => {
    try {
        const res = await api.delete(endpointID);
    } catch (e) {
        console.log(e);
    }
}