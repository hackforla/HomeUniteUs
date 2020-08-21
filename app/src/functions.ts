// TODO: Deprecated and marked for removal

const dataFunc = {
    async guestsGet() {
        try {
            const getGuests = await fetch(`http://0.0.0.0:8765/guests/`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            })
            if (getGuests.status !== 200) {
                throw Error(`Error with GET Request: ${getGuests.status}`)
            }
            return await getGuests.json()
        } catch (err) {
            throw err
        }
    },
    async getSingleGuest(params: string) {
        try {
            const getGuest = await fetch(
                `http://0.0.0.0:8765/guests/${params}`,
                {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                }
            )
            if (getGuest.status !== 200) {
                throw Error(`Error with GET Request: ${getGuest.status}`)
            }
            return await getGuest.json()
        } catch (err) {
            throw err
        }
    },
    async guestAdd(guestInfo: Object) {
        try {
            const addGuest = await fetch(
                `http://0.0.0.0:8765/guests/addguest`,
                {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify(guestInfo),
                    headers: { 'Content-Type': 'application/json' },
                }
            )
            if (addGuest.status !== 200) {
                throw Error(`Error with POST Request: ${addGuest.status}`)
            }
            return await addGuest.json()
        } catch (err) {
            throw err
        }
    },
    async guestEdit(guestInfo: Object) {
        try {
            const editGuest = await fetch(
                `http://0.0.0.0:8765/guests/editguest`,
                {
                    method: 'PUT',
                    credentials: 'include',
                    body: JSON.stringify(guestInfo),
                    headers: { 'Content-Type': 'application/json' },
                }
            )
            if (editGuest.status !== 200) {
                throw Error(`Error with PUT Request: ${editGuest.status}`)
            }
            return await editGuest.json()
        } catch (err) {
            throw err
        }
    },
    async guestDelete(params: string) {
        try {
            const deleteGuest = await fetch(
                `http://0.0.0.0:8765/guests/${params}`,
                {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                }
            )
            if (deleteGuest.status !== 200) {
                throw Error(`Error with DELETE Request: ${deleteGuest.status}`)
            }
            return await deleteGuest.json()
        } catch (err) {
            throw err
        }
    },
    async hostsGet() {
        try {
            const getHosts = await fetch(`http://0.0.0.0:8765/hosts/`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            })
            if (getHosts.status !== 200) {
                throw Error(`Error with GET Request: ${getHosts.status}`)
            }
            return await getHosts.json()
        } catch (err) {
            throw err
        }
    },
    async getSingleHost(params: string) {
        try {
            const getHost = await fetch(`http://0.0.0.0:8765/hosts/${params}`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            })
            if (getHost.status !== 200) {
                throw Error(`Error with GET Request: ${getHost.status}`)
            }
            return await getHost.json()
        } catch (err) {
            throw err
        }
    },
    async hostAdd(guestInfo: Object) {
        try {
            const addHost = await fetch(`http://0.0.0.0:8765/hosts/addguest`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(guestInfo),
                headers: { 'Content-Type': 'application/json' },
            })
            if (addHost.status !== 200) {
                throw Error(`Error with POST Request: ${addHost.status}`)
            }
            return await addHost.json()
        } catch (err) {
            throw err
        }
    },
    async hostEdit(guestInfo: Object) {
        try {
            const editHost = await fetch(
                `http://0.0.0.0:8765/hosts/editguest`,
                {
                    method: 'PUT',
                    credentials: 'include',
                    body: JSON.stringify(guestInfo),
                    headers: { 'Content-Type': 'application/json' },
                }
            )
            if (editHost.status !== 200) {
                throw Error(`Error with PUT Request: ${editHost.status}`)
            }
            return await editHost.json()
        } catch (err) {
            throw err
        }
    },
    async hostDelete(params: string) {
        try {
            const deleteHost = await fetch(
                `http://0.0.0.0:8765/hosts/${params}`,
                {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                }
            )
            if (deleteHost.status !== 200) {
                throw Error(`Error with DELETE Request: ${deleteHost.status}`)
            }
            return await deleteHost.json()
        } catch (err) {
            throw err
        }
    },
}

export default dataFunc
