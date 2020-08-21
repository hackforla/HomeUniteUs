export interface Accounts {
    email: string
    accountId: string
    type: string
}

//the interface might change when accounts is created in mongo

//this is the data being sent to python route to check whether the user exists vvvv
// email: "testing@yahoo.com"
// email_verified: false
// name: "testing@yahoo.com"
// nickname: "testing"
// picture: "https://s.gravatar.com/avatar/3d751a0c27cbe4cd47f1fe09352c24fb?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fte.png"
// sub: "auth0|5ec1aa9f40fa560c7565123a"
// updated_at: "2020-05-29T20:53:09.704Z"
