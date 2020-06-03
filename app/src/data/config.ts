export const Constants = {
    ApiHost: '',
    ApiPort: '80',
    ApiPrefix: 'api',
    StaticFilePrefix: '',
}

export const ApiConfig = {
    UriPrefix:
        Constants.ApiHost.length > 0
            ? `${Constants.ApiHost}:${Constants.ApiPort}/${Constants.ApiPrefix}`
            : `/${Constants.ApiPrefix}`,
}

export const AppConfig = {
    AppName: 'Host Home',
    DefaultProfileImageUrl: `${Constants.StaticFilePrefix}/img/profile-placeholder.png`,
}
