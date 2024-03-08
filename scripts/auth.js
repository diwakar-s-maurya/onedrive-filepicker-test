const msalParams = {
    auth: {
        authority: "https://login.microsoftonline.com/eb1f94dc-8d25-4c67-985c-04be74c8f698", //{tenant id / common / consumers}
        clientId: "d63e5128-a9f4-437c-9d8f-afefb9a9658f",
        redirectUri: "http://localhost:3000"
    },
}

const app = new msal.PublicClientApplication(msalParams);

async function getToken(command) {

    let accessToken = "";
    let authParams = null;

    switch (command.type) {
        case "SharePoint":
        case "SharePoint_SelfIssued":
            authParams = { scopes: [`${combine(command.resource, ".default")}`] };
            break;
        default:
            break;
    }

    try {

        // see if we have already the idtoken saved
        const resp = await app.acquireTokenSilent(authParams);
        accessToken = resp.accessToken;

    } catch (e) {

        // per examples we fall back to popup
        const resp = await app.loginPopup(authParams);
        app.setActiveAccount(resp.account);

        if (resp.idToken) {

            const resp2 = await app.acquireTokenSilent(authParams);
            accessToken = resp2.accessToken;

        }
    }

    return accessToken;
}
