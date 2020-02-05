const dataFunc = {
    async getGuests() {
        try {
            const getUsers = await fetch(`http://0.0.0.0:8765/guests/`,
                {
                    method: "GET",
                    headers: { 'Content-Type': 'application/json' }
                })
            return await getUsers.json()
        }
        catch (err) {
            throw err
        }
    },
    async getGuest(params: string) {
        try {
            const getUser = await fetch(`http://0.0.0.0:8765/guests/${params}`,
                {
                    method: "GET",
                    headers: { 'Content-Type': 'application/json' }
                })
            return await getUser.json()
        }
        catch (err) {
            throw err
        }
    },
}

export default dataFunc