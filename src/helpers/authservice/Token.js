class Token{

    isValid(token){
        const payload = this.payload(token)
        if (payload){
            return payload.iss = !!("auth/admin/login" || "auth/admin/register")
            // return payload.iss = "http://127.0.0.1:8000/"
        }
        return false
    }

    payload(token){
        const payload = token.split('.')[1]
        return this.decode(payload)
    }

    decode(payload){
        return JSON.parse(atob(payload))
    }
}

// eslint-disable-next-line no-class-assign
export default Token = new Token();

