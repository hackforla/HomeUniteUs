const dataFunc = {
    async get(params: string) {
        try {
            const getUsers = await fetch(`http://0.0.0.0:8765/users/${params}`)
            return await getUsers.json()
        }
        catch (err) {
            console.log(err)
        }
    }
}

export default dataFunc